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
   */
  fork: function (def) {

  },

  /**
   * @name hash
   * @desc use next converter to resolve each item in data
   */
  hash: function () {

  },

  /**
   * @name fold
   * @desc fold/reduce the input
   */
  fold: function () {

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
   * @name sponge
   * @desc cache the data for next converter
   *       use `idattr` to access multiple context
   *       sponge is stacked under different context
   */
  sponge: function () {

  },

  /**
   * @name diff
   * @desc cache the input and output only differences
   */
  diff: function () {

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

