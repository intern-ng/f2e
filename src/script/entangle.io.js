/**
 * Entangle - I/O Toolkit
 */

entangle.extend({

  /**
   * @name data
   * @desc resolves static data
   */
  data: function () { // {{{
    var data = array(arguments);
    return function () {
      fapply(this.resolve, this, data);
    };
  }, // }}} data

  /**
   * @name timeout
   * @desc set timeout to next converter
   * @param interval - time in milliseconds
   */
  timeout: function (interval) { // {{{

    var watch = (function () {
      var timer;
      return {
        clear: function () { window.clearTimeout(timer); },
        setup: function (func) {
          watch.clear();
          timer = window.setTimeout(func, interval);
        }
      };
    })();

    return function () {
      var _this = this, args = arguments;
      watch.setup(function () {
        fapply(_this.resolve, _this, args);
      });
    };

  }, // }}} timeout

});

