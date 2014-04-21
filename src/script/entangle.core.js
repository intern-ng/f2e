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
   * @name flow
   * @desc combine different converter to one converter
   * @param convs {array}   - [ converter ]
   */
  flow: function (convs) { // {{{
    // construct an entangle chain by array
    var q = entangle();
    _(arguments).flatten().each(function (converter) { q.append(converter); });
    return q;
  }, // }}} flow

  /**
   * @name fork
   * @desc pipe same input to group of converters
   * @param convs {object} - { channel_name -> converter }
   */
  fork: function (convs) { // {{{
    return function () {
      var _this = this;
      var _args = array(arguments);
      _.each(convs, function (converter, channel) {
        converter.apply({
          resolve: function (___) {
            var _args = array(arguments);
            return _this.resolve(
              pair(channel, (_args.length == 1) ? ___ : _args)
            );
          },
          failure: function (err) { /* TODO error handling */ }
        }, _args);
      });
    };
  }, // }}} fork

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
   * @name hash
   * @desc resolve each item to converter
   * @param create {function} - create a converter
   */
  hash: function (create) { // {{{
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
  }, // }}} hash

  /**
   * @name sponge
   * @desc cache the data for next converter
   * @param cache - (optional) function to put cached data and input together (_.extend by default)
   */
  sponge: function (cache) { // {{{
    var data, cc = cache || _.extend;
    return function (___) {
      this.resolve(data ? cc(data, ___) : data = ___);
    };
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
        var next = this.next();
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
   * @desc rename values
   * @param mapping {object} - { destination : source }
   */
  move: function (mapping) { // {{{
    return function (___) {
      _.each(mapping, function (v, k) {
        ___[k] = ___[v];
        delete ___[v];
      });
      this.resolve(___);
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

