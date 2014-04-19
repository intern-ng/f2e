/**
 * Entangle - Reactive Framework
 */

var entangle = (function () {

  function Entangle () {
    this.runtime = {}; // chain-level runtime status object
  }

  return _.extend(function () { return new Entangle(); }, {

    initiator: function (fu) {

      return function () {
        var _this = this;

        var converter = fu.apply(_this, Array.prototype.slice.call(arguments, 0));

        if (this.last) {
          this.last.next = converter;
        } else {
          var contextof = function (converter, runtime) {
            return {

              // resolve - call next converter {{{
              resolve: function () {
                var args = Array.prototype.slice.call(arguments, 0);
                var next = converter.next || _this.next; // cascading converter
                // FIXME use arguments expansion here (efficiency)
                if (next) next.apply(contextof(next, runtime), args);
                return this;
              },
              // }}} resolve

              // failure - TODO issue conversion failure(s) {{{
              failure: function () { return this; },
              // }}} failure

              // runtime - change the runtime container of next converter {{{
              runtime: function (rt) {
                if (!rt) {
                  return runtime;
                } else {
                  runtime = rt;
                  return this;
                }
              },
              // }}} runtime

            };
          };
          _this.resolve = converter.bind(contextof(converter, _this.runtime));
        }

        _this.last = converter;

        return _this;

      };

    },

    extend: function (kis) {
      _.extend(Entangle.prototype, _.transform(kis, function (r, v, k) {
        r[k] = entangle.initiator(v);
      }));
    }

  });

})();

