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

    extend: function (obj) {
      _.each(obj, function (v, k) {
        if (this[k]) {
          throw new ReferenceError ('duplicated declaration of `' + k + '`');
        } else {
          this[k] = v;
        }
      });
      return this;
    },

    route: function (obj) {
      _.each(obj, function (v, k) {
        this[k].fork(v);
      }, this);
      return this;
    },

    setup: function () {
      this.main.call();
    },

  });

  return Application;

})();

