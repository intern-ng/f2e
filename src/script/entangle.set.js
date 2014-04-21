/**
 * Entangle - Set Calculation Toolkit
 */

entangle.extend({

  /**
   * @name union
   * @desc resolves union set of input arrays
   */
  union: function () {
    return function () {
      this.resolve(_.union.apply(null, arguments));
    };
  },

  /**
   * @name intersection
   * @desc resolves intersection set of input arrays
   */
  intersection: function () {
    return function () {
      this.resolve(_.intersection.apply(null, arguments));
    };
  },

  /**
   * @name difference
   * @desc exclude array of values from the first array (relative complement)
   */
  difference: function () {
    return function () {
      this.resolve(_.difference.apply(null, arguments));
    };
  },

});
