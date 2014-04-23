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
    return this.head.apply(this.head, args);
  };

  // }}}

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

        if (this instanceof Entangle) {
          return converter ? this.append(converter) : this;
        } else {
          return converter;
        }

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
      var _kis = _.transform(kis, function (r, v, k) {
        r[k] = entangle.initiator(v);
      });
      _.extend(Entangle.prototype, _kis);
      _.extend(this, _kis);
      return this;
    }

  });

})();

