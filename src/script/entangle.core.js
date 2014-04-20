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
   * @name hash
   * @desc pipe same input to group of converters
   * @param convs {object} - { channel_name -> converter }
   */
  hash: function (convs) {
  },

  /**
   * @name fold
   * @desc fold/reduce the input
   * @param reducer - reduce function
   * @param accumulator - accumulator creator
   * @param context - reduce function execution context
   */
  fold: function (reducer, accumulator, context) {
  },

  /**
   * @name fork
   * @desc resolve each item to converter
   * @param create {function} - create a converter
   */
  fork: function (create) {
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
   */
  capture: function () {

  },

  /**
   * @name transform
   * @desc transform data with simple function
   */
  transform: function () {

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

