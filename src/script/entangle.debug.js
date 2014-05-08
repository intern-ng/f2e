/**
 * Entangle - Debug Utility
 */

entangle.extend({

  /**
   * @name breakpoint
   * @desc set a breakpoint here
   */
  breakpoint: function () {
    return function () {
      // jshint -W087
      debugger;
      return this.resolve.apply(this, arguments);
    };
  },

  /**
   * @name monitor
   * @desc monitor arguments here
   */
  monitor: function () {
    return function () {
      console.debug(array(arguments));
      return this.resolve.apply(this, arguments);
    };
  }

});

