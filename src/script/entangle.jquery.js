/**
 * Entangle - jQuery Toolkit
 */

(function () {

  var param_delimiter = /^{{([\s\S]+?)}}$/;

  entangle.extend({

    /**
     * @name jQuery($)
     * @desc create jQuery object
     */
    $: function () {
      return function (el) {
        return this.resolve($(el));
      };
    },

  });

  entangle.extend(
    _(jQuery.fn)
    .methods()
    .transform(function (r, name) {

      r['$' + name] = function () {
        var capture = [ '$el', '___' ];

        var args = _.map(arguments, function (value) {
          var match = param_delimiter.exec(value);
          if (match) {
            // parameter key
            value = match[1];
            capture.push(value);
            return function (___) { return ___[value]; };
          } else {
            // static value
            return function () { return value; };
          }
        });

        return _.extend(function ($el, ___) {
          return this.resolve(
            jQuery.fn[name]
            .apply($el, _.map(args, function (get) {
              return get(___);
            }))
          );
        }, {
          capture: capture
        });
      };

    }, {})
    .value()
  );

})();