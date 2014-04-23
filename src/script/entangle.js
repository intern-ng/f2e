/**
 * Entangle - Reactive Framework
 */

var entangle = (function () {

  function Entangle () { }

  // @interface(converter>function) {{{

  Entangle.prototype.call = function (ctx) {
    var args = Array.prototype.slice.call(arguments, 1);
    return this.apply(ctx, args);
  };

  Entangle.prototype.apply = function (ctx, args) {
    // XXX an entangle can only been attached once
    this.context = ctx;
    return this.head.apply(this.contextof(this.head), args);
  };

  // }}}

  Entangle.prototype.contextof = function (converter) {

    var _this = this;

    return {

      next: function () { return converter.next; },

      // resolve - call next converter {{{
      resolve: function () {
        var next = this.next();
        if (next) {
          // FIXME use arguments expansion here (efficiency)
          fapply(next, _this.contextof(next), arguments);
        } else {
          // cascading resolve
          if (_this.context && _this.context.resolve) {
            fapply(_this.context.resolve, _this.context, arguments);
          }
        }
        return this;
      },
      // }}} resolve

      // failure - TODO issue conversion failure(s) {{{
      failure: function () { return this; },
      // }}} failure

    };

  };

  Entangle.prototype.append = function (converter) {

    if (this.last) {
      this.last.next = converter;
    } else {
      this.head = converter;
    }

    this.last = converter;

    return this;

  };

  return _.extend(function () { return new Entangle(); }, {

    Entangle: Entangle,

    initiator: function (fu) {

      return function () {

        var converter = fapply(fu, this, arguments);

        if (converter && !converter.isReady) {
          converter = entangle.prepare(converter);
        }
        if (converter) this.append(converter);

        return this;

      };

    },

    prepare: function (converter) {
      return _.extend(converter, {

        isReady: true,

        descend: function () { return converter.next; },

        resolve: function () {
          var next = this.descend();
          if (next) next.apply(next, arguments);
        },

        failure: function () {

        },

      });
    },

    extend: function (kis) {
      _.extend(Entangle.prototype, _.transform(kis, function (r, v, k) {
        r[k] = entangle.initiator(v);
      }));
      return _.extend(this, kis);
    }

  });

})();

