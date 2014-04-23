/**
 * Entangle Application
 */

entangle.Application = (function () {

  function Application (flow) {
    this.main = entangle();
    _.extend(this, flow);
  }

  _.extend(Application.prototype, {

    constructor: Application,

    route: function (obj) {
      _.each(obj, function (v, k) {
        this[k].fork(v);
      }, this);
      return this;
    },

    call: function () {
      this.main.call();
    },

  });

  return Application;

})();

