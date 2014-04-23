/**
 * Entangle Application
 */

entangle.Application = (function () {

  function Application (flow) {
    _.extend(this, flow);
  }

  _.extend(Application.prototype, {

    constructor: Application,

    extend: function (obj) {
      _.forOwn(obj, function (v, k) {
        if (this[k]) {
          throw new ReferenceError ('duplicated declaration of `' + k + '`');
        } else {
          this[k] = v;
        }
      }, this);
      return this;
    },

    dependency: function (obj) {
      this.route(_.transform(obj, function (r, v, k) {
        var ref = v.split(' ');
        var chain = ref[0], slot = ref[1] || '$';
        r[chain] = r[chain] || {};
        r[chain][slot] = r[chain][slot] || [];
        r[chain][slot].push(this[k]);
      }, {}, this));
    },

    route: function (obj) {
      _.each(obj, function (v, k) {
        this[k].fork(v);
      }, this);
      return this;
    },

    setup: function () {
      if (this.main) {
        this.main.call();
      } else {
        throw new ReferenceError ('`main` function is not defined for setup');
      }
    },

  });

  return Application;

})();

