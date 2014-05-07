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

    // Syntax
    //  DEPENDENCY := 'CONVNAME' | 'CONVNAME SLOTNAME' | [ 'CONVNAME', 'SLOTNAME', ... ]
    //              |  CONVERTER | [ CONVERTER, 'SLOTNAME', ... ]
    //  OBJ        := { CONVNAME: DEPENDENCY | [ DEPENDENCY ] }
    dependency: function (obj) {
      var app = this;
      _.each(obj, function (v, k) {
        _.each(typeid(v) == 'array' ? v : [ v ], function (v) {

          var descender = app[k];

          if (typeid(v) == 'string') v = v.split(' ');
          if (typeid(v) != 'array') v = [ v ];
          if (v.length < 2) v = v.concat([ '$' ]);

          if (typeid(v[0]) == 'string') {
            v[0] = app[v[0]];
          }

          var chain = v.shift();

          _.each(v, function (slotname) {
            chain.fork(slotname, descender);
          });

        });
      });
      return this;
    },

    // Syntax
    //  CONVERTER := STRING | CONVERTER_FUNCTION
    //  CHILDREN  := [ CONVERTER ] | CONVERTER
    //  SLOTDEFS  := { SLOTNAME: CHILDREN }
    //  OBJ       := { CONVNAME: SLOTDEFS | CHILDREN }
    route: function (obj) {
      var app = this;
      _.each(obj, function (v, k) {
        if (typeid(v) == 'function' || v instanceof entangle.Entangle) v = [ v ];
        if (typeid(v) != 'object') v = { $: v };
        v = _.transform(v, function (r, v, k) {
          if (typeid(v) != 'array') v = [ v ];
          r[k] = _.map(v, function (v) {
            if (typeid(v) == 'string') {
              return app[v];
            } else {
              return v;
            }
          });
        });
        app[k].fork(v);
      });
      return this;
    },

    setup: function () {
      if (this.init) {
        this.init.call();
      } else {
        throw new ReferenceError ('`init` function is not defined for setup');
      }
    },

  });

  return Application;

})();

