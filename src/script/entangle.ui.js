/**
 * Entangle - UI Toolkit
 */

entangle.extend({

  /**
   * @name location
   * @desc window.location object
   */
  location: function () {

    var converter = function () {
      this.resolve(location);
    };

    // get location from window object
    var location = {
      host: window.location.host,
      hostname: window.location.hostname,
      protocol: window.location.protocol,
      search: window.location.search,
      href: window.location.href,
      port: window.location.port,
      pathname: window.location.pathname,
      hash: window.location.hash,
    };

    var context = this.contextof(converter);

    // listen for hash change event
    $(window).on('hashchange', function () {
      location.hash = window.location.hash;
      context.resolve(location);
    });

    return converter;
  },

  /**
   * @name qs
   * @desc parse querystring to object
   */
  qs: function () {
    return function (search) {
      this.resolve($.parseParams(search));
    };
  },

  /**
   * @name apply
   * @desc apply a set of function calls to jQuery object with value(s) from pipe
   */
  $apply: function (selector, calls) {
    var $el = $(selector);
    calls = _.transform(calls, function (r, v, k) {
      r[k] = (typeid(v) == 'array') ? v : [v];
    });
    return function (___) {
      _.each(calls, function (v, k) {
        if (_.any(v, function (name) { return !___.hasOwnProperty(name); })) {
          return;
        }
        $.fn[k].apply($el, _.map(v, function (name) {
          return ___[name];
        }));
      });
    };
  },

});

