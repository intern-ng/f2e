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
    $: function (_el) {
      return function (el) {
        return this.resolve($(_el || el));
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
            if (value == '___') {
              return function (___) { return ___; };
            } else {
              return function (___) { return ___[value]; };
            }
          } else {
            // static value
            return function () { return value; };
          }
        });

        return _.extend(function ($el, ___) {
          return this.resolve($el, jQuery.fn[name]
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


entangle.extend({

  $on: function (event, option) {

    option = option || {};

    var data = option.data,
    selector = option.selector,
    preventDefault = !!option.preventDefault;

    return function ($el) {
      var _this = this;
      $el.on(event, selector, data, function (e) {
        if (preventDefault) e.preventDefault();
        _this.resolve($el, e);
      });
      return this.resolve($el);
    };

  },

  $pick: function () {
    return entangle.pick.apply(entangle, [ '$el' ].concat(array(arguments)));
  },

  $pack: function () {
    return entangle.pack.apply(entangle, [ '$el' ].concat(array(arguments)));
  },

});

})();
