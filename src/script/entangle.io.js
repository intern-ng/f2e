/**
 * Entangle - I/O Toolkit
 */

entangle.extend({

  /**
   * @name data
   * @desc resolves static data
   */
  data: function (data) {
    return function () {
      this.resolve(data);
    };
  },

  /**
   * @name Poll
   * @desc Keep polling for data changes
   * @param juicer {function} - function to juice data
   * @param interval - time in milliseconds between each call to get data
   */
  poll: function (juicer, interval) {

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

    var status = 'stopped';
    var args = [];

    var converter = function () {
      args = Array.prototype.slice.call(arguments, 0);
      if (status != 'running') loop();
    };

    var context = this.contextof(converter);

    var loop = function () {
      status = 'running'; watch.clear();
      juicer.apply({
        resolve: function () {
          fapply(context.resolve, context, arguments);
          status = 'stopped'; watch.setup(loop);
        },
        failure: function () {
          /* TODO error handling */
          status = 'stopped'; watch.setup(loop);
        }
      }, args);
    };

    return converter;

  },

});

