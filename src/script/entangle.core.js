/**
 * Entangle - Core Foundation
 */

entangle.extend({

  /**
   * @name passby
   * @desc pass all data as-is to next converter
   */
  passby: function () { // {{{
    return function () {
      this.resolve.apply(this, arguments);
    };
  }, // }}} passby

  /**
   * @name slot
   * @desc create a slot(marker) for fork on a chain
   * @param name {string}
   */
  slot: function (name) { // {{{
    return _.extend(function () {
      this.resolve.apply(this, arguments);
      _.each(this.branches, function (converter) {
        converter.apply(converter, this);
      }, arguments);
    }, {
      slotname: name,
      branches: []
    });
  }, // }}} slot

  /**
   * @name fork
   * @desc fork current data to different converters
   * @param slotname {string} - (optional) fork from this slot
   * @param convs {array}
   */
  fork: function (name, convs) { // {{{
    if (typeid(name) != 'string') {
      convs = name; name = '___';
    }
    if (typeid(convs) != 'object' || convs instanceof entangle.Entangle) {
      convs = pair(name, convs);
    }
    _.each(convs, function (converters, slotname) {
      if (typeid(converters) != 'array') {
        converters = [ converters ];
      }

      var slot;

      if (slotname == '___') {
        slot = this.slot().last; // append a new slot to current location
      } else {
        slot = (function find (conv) {
          if (!conv) return null;
          if (conv instanceof entangle.Entangle) conv = conv.head;
          if (conv.slotname == slotname) return conv;
          // Never search into branches in a slot
          return find(conv.next);
        })(this.head);

        if (!slot) {
          throw new ReferenceError ('Cannot find slot with name "' + slotname + '"');
        }
      }

      slot.branches = slot.branches.concat(converters);

    }, this);
  }, // }}} fork

  /**
   * @name hash
   * @desc pipe same input to group of converters and obtained named values
   * @param convs {object} - { channel_name -> converter }
   */
  hash: function (convs) { // {{{
    var converter = function () {
      var _args = arguments;
      _.each(convs, function (converter) {
        converter.apply(converter, _args);
      });
    };

    _.each(convs, function (convert, channel) {
      convert.next = function (___) {
        converter.resolve(pair(channel, (arguments.length == 1) ? ___ : array(arguments)));
      };
    });

    return converter;
  }, // }}} hash

  /**
   * @name fold
   * @desc fold/reduce the input
   * @param reducer - reduce function
   * @param accumulator - accumulator creator
   * @param context - reduce function execution context
   */
  fold: function (reducer, accumulator, context) { // {{{
    return function (___) {
      this.resolve(
        _.reduce(___, reducer, accumulator(), context)
      );
    };
  }, // }}} fold

  /**
   * @name each
   * @desc resolve each item to converter
   * @param create {function} - create a converter
   */
  each: function (create) { // {{{
    var convs = {};
    return function (___) {
      var _this = this;
      _.each(___, function (v, k, d) {
        if (!convs.hasOwnProperty(k)) {
          // create a converter
          convs[k] = create(v, k);
        }
        convs[k].call({
          resolve: function (___) {
            var _args = array(arguments);
            return _this.resolve(
              pair(k, (_args.length == 1) ? ___ : _args)
            );
          },
          failure: function (err) { /* TODO error handling */ }
        }, v, d);
      });
    };
  }, // }}} each

  /**
   * @name sponge
   * @desc cache the data for next converter
   * @param always {boolean} - (optional) resolves result ignoring whether the buffered data has changed (false by default)
   * @param cache {function} - (optional) function to put cached data and input together (`eukit.extend` by default)
   */
  sponge: function (always, cache) { // {{{

    if (typeid(always) == 'function') { cache = always; }
    if (typeid(always) != 'boolean' ) { always = false; }

    var data, _cache = cache || eukit.cache;

    var status;

    var resolv = function () {
      status = 'stopped';
      converter.resolve(data);
    };

    var converter = function (___) {
      var c = _cache(data, ___);
      data = c.data;
      if ((always || c.changed) && status != 'waiting') {
        setTimeout(resolv, 1); status = 'waiting';
      }
    };

    return converter;

  }, // }}} sponge

  /**
   * @name filter
   * @desc filter input items to output
   */
  filter: function () {

  },

  /**
   * @name collect
   * @desc transform array to object
   * @param idattr {function/string} - get id from item value (use item key as id by default)
   */
  collect: function (idattr) { // {{{
    if (typeid(idattr) == 'string') {
      var idname = idattr;
      idattr = function (v) { return v[idname]; };
    }
    return function (___) {
      this.resolve(_.reduce(___, function (r, v, k) {
        r[idattr ? idattr(v) : k] = v;
      }, {}));
    };
  }, // }}} collect

  /**
   * @name diff
   * @desc cache the input and output only differences,
   *       will wrap data with metadata
   */
  diff: function () {

  },

  /**
   * @name patch
   * @desc patch the cached output value with diff
   */
  patch: function () {

  },

  /**
   * @name array
   * @desc wrap values with array
   * @param skipArray - (optional) whether skip values that is already an array (false by default)
   */
  array: function (skipArray) { // {{{
    return function () {
      fapply(this.resolve, this, _.map(arguments, function (v) {
        if (skipArray) {
          return Array.isArray(v) ? v : [ v ];
        } else {
          return [ v ];
        }
      }));
    };
  }, // }}} array

  /**
   * @name cases
   * @desc iterate an array and resolve value with appropriate case
   */
  cases: function (mapping) { // {{{
    return function () {
      fapply(this.resolve, this, _.map(arguments, function (arg) {
        return _.map(arg, function (v) {
          var caseval = mapping[v] || mapping.___;
          return (typeid(caseval) == 'function') ? caseval(v) : caseval;
        });
      }));
    };
  }, // }}} cases

  /**
   * @name pick
   * @desc control next converter to be triggered when input matches a parameter specification
   * @param capture {array/strings} - (optional) data handler or capturing array (auto-detect by default)
   * @param handler {function} - (optional) handler called with array (to resolve by default)
   * @param forceAll {boolean} - (optional) trigger only when input meets all captures (true by default)
   */
  pick: function (capture, handler, forceAll) { // {{{
    var args = array(arguments);

    if (typeid(forceAll = args.pop()) != 'boolean') {
      handler = forceAll;
      forceAll = true;
    } else {
      handler = args.pop();
    }

    if (typeid(handler) != 'function') {
      capture = handler;
      handler = null;
    } else {
      capture = args.pop();
    }

    if (typeid(capture) != 'array' && capture) {
      args.push(capture);
      capture = args.slice(0);
    }

    if (!capture) {
      // autodetect from handler function definition
      capture = handler && (handler.capture || signatureof(handler).param);
    }

    return function (___) {

      if (!capture) {
        var next = this.descend();
        capture = next && (next.capture || signatureof(next).param) || [ '___' ];
      }

      if (forceAll && _.any(capture, function (name) {
        return name != '___' && !___.hasOwnProperty(name);
      })) {
        return;
      }

      var args = _.map(capture, function (name) {
        return (name == '___') ? ___ : ___[name];
      });

      return fapply(handler || this.resolve, this, args);

    };
  }, // }}} pick

  /**
   * @name pack
   * @desc pack arguments with provided array name
   * @param names {array} - name for positioned parameter
   */
  pack: function (names) { // {{{
    if (typeid(names) != 'array') {
      names = Array.prototype.slice.call(arguments, 0);
    }
    return function () {
      this.resolve(_.object(names, arguments));
    };
  }, // }}} pack

  /**
   * @name move
   * @desc rename values (safe for swap)
   * @param mapping {object} - { source -> destination }
   */
  move: function (mapping) { // {{{
    return function (___) {
      this.resolve(_.transform(___, function (r, v, k) {
        r[mapping[k] || k] = v;
      }));
    };
  }, // }}} move

  /**
   * @name transform
   * @desc transform data with simple function
   */
  transform: function (process) { // {{{
    return process;
  }, // }}} transform

});

