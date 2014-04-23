/**
 * Entangle - Reactive Framework
 */

var entangle = (function () {

  function Entangle () {

    var _next = null;

    Object.defineProperty(this, 'next', {
      get: function () { return _next; },
      set: function (value) {
        _next = value;
        this.last.next = value;
      }
    });

  }

  // @interface(converter>function) {{{

  Entangle.prototype.call = function (ctx) {
    var args = Array.prototype.slice.call(arguments, 1);
    return this.apply(ctx, args);
  };

  Entangle.prototype.apply = function (ctx, args) {
    return this.head.apply(this.head, args);
  };

  // }}}

  Entangle.prototype.flow = function (converter) { // {{{

    if (this.last) {
      this.last.next = converter;
    } else {
      this.head = converter;
    }

    this.last = converter;

    this.last.next = this.next;

    return this;

  }; // }}} flow

  return _.extend(function () { return new Entangle(); }, {

    Entangle: Entangle,

    initiator: function (fu, typename) { // {{{

      return function () {

        var converter = fu.apply(this, arguments);

        if (converter && !converter.isReady) {
          converter = entangle.prepare(converter, typename);
        }

        if (this instanceof Entangle) {
          return converter ? this.flow(converter) : this;
        } else {
          return converter;
        }

      };

    }, // }}} initiator

    prepare: function (converter, typename) { // {{{
      return _.extend(converter, {

        isReady: true,

        typename: typename,

        descend: function () { return converter.next; },

        resolve: function () {
          var next = this.descend();
          if (next) next.apply(next, arguments);
        },

        failure: function () {

        },

      });
    }, // }}} prepare

    extend: function (kis) { // {{{

      var _kis = _.transform(kis, function (r, v, k) {
        r[k] = entangle.initiator(v, k);
      });

      _.extend(Entangle.prototype, _kis);
      _.extend(this, _kis);

      return this;

    }, // }}} extend

  });

})();

