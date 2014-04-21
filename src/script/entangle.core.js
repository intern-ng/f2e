/**
 * Entangle - Core Foundation
 */

entangle.extend({

  /**
   * @name passby
   * @desc pass all data as-is to next converter
   */
  passby: function () {
    return function (___) {
      this.resolve(___);
    };
  },

  /**
   * @name flow
   * @desc combine different converter to one converter
   * @param convs {array}   - [ converter ]
   */
  flow: function (convs) {
    // construct an entangle chain by array
    var q = entangle();
    _(arguments).flatten().each(function (converter) { q.append(converter); });
    return q;
  },

  /**
   * @name fork
   * @desc pipe same input to group of converters
   * @param convs {object} - { channel_name -> converter }
   */
  fork: function (convs) {
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
  },

  /**
   * @name fold
   * @desc fold/reduce the input
   * @param reducer - reduce function
   * @param accumulator - accumulator creator
   * @param context - reduce function execution context
   */
  fold: function (reducer, accumulator, context) {
    return function (___) {
      this.resolve(
        _.reduce(___, reducer, accumulator(), context)
      );
    };
  },

  /**
   * @name hash
   * @desc resolve each item to converter
   * @param create {function} - create a converter
   */
  hash: function (create) {
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
  },

  /**
   * @name sponge
   * @desc cache the data for next converter
   * @param cache - (optional) function to put cached data and input together (_.extend by default)
   */
  sponge: function (cache) {
    var data, cc = cache || _.extend;
    return function (___) {
      this.resolve(data ? cc(data, ___) : data = ___);
    };
  },

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
  collect: function (idattr) {
    if (typeid(idattr) == 'string') {
      var idname = idattr;
      idattr = function (v) { return v[idname]; };
    }
    return function (___) {
      this.resolve(_.reduce(___, function (r, v, k) {
        r[idattr ? idattr(v) : k] = v;
      }, {}));
    };
  },

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
   * @name capture
   * @desc control next converter to be triggered when input matches a parameter specification
   * @param capture {array} - (optional) data handler or capturing array (auto-detect by default)
   * @param handler {function} - (optional) handler called with array (to resolve by default)
   * @param forceAll {boolean} - (optional) trigger only when input meets all captures (true by default)
   */
  capture: function (capture, handler, forceAll) {
    if (typeid(handler) == 'boolean') {
      forceAll = handler; handler = null;
    }
    if (typeid(capture) == 'function') {
      handler = capture; capture = null;
    }
    if (typeid(capture) == 'string') {
      capture = [ capture ];
      if (typeid(handler) == 'string') {
        capture = array(arguments);
        handler = capture.pop();
        if (typeid(handler) == 'string') {
          capture.push(handler);
          handler = null;
        }
      }
    }
    if (typeid(forceAll) != 'boolean') {
      forceAll = true;
    }
    if (!capture) {
      // autodetect from handler function definition
      capture = handler ? (handler.capture || signatureof(handler).param) : null;
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
      fapply(handler || this.resolve, this, args);
    };
  },

  /**
   * @name pack
   * @desc pack arguments with provided array name
   * @param names {array} - name for positioned parameter
   */
  pack: function (names) {
    if (typeid(names) != 'array') {
      names = Array.prototype.slice.call(arguments, 0);
    }
    return function () {
      this.resolve(_.object(names, arguments));
    };
  },

  /**
   * @name transform
   * @desc transform data with simple function
   */
  transform: function (process) {
    return process;
  },

  /**
   * @name pick
   * @desc pick specific value as output
   * @param valname {string} - name of value to be picked
   */
  pick: function (valname) {
    return function (___) {
      return this.resolve(___[valname]);
    };
  }

});

