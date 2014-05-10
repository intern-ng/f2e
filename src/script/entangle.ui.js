/**
 * Entangle - UI Toolkit
 */

entangle.extend({

  /**
   * @name location
   * @desc window.location object
   */
  location: function () { // {{{

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

    // listen for hash change event
    $(window).on('hashchange', function () {
      location.hash = window.location.hash;
      converter.resolve(location);
    });

    return converter;

  }, // }}} location

  /**
   * @name qs
   * @desc parse querystring to object
   */
  qs: function () { // {{{
    return function (search) {
      this.resolve($.parseParams(search));
    };
  }, // }}} qs

  /**
   * @name invoke
   * @desc apply a set of function calls to object with value(s) from pipe
   */
  invoke: function (object, call) { // {{{
    var _call = _.transform(call, function (r, v, k) {
      r[k] = (typeid(v) == 'array') ? v : [v];
    });
    return function (___) {
      _.each(_call, function (v, k) {
        if (_.any(v, function (name) { return !___.hasOwnProperty(name); })) {
          return;
        }
        fapply(object[k], object, _.map(v, function (name) {
          return ___[name];
        }));
      });
    };
  }, // }}} invoke

  /**
   * @name join
   * @desc join list of values to string
   * @param delimiter
   */
  join: function (delimiter) { // {{{
    return function (___) {
      this.resolve(_.flatten(___).join(delimiter));
    };
  }, // }}} join

  /**
   * @name classname
   * @desc transform list of classname to classname string
   */
  classname: function () { // {{{
    return entangle.join(' ');
  }, // }}} classname

  /**
   * @name radio
   * @desc resolves radio selection (`on`/`off` set)
   * @param universe {array} - all states
   */
  radio: function (universe, selector) { // {{{
    return entangle()
    .hash({
      _states: entangle.data(universe),
      current: entangle.passby()
    })
    .sponge()
    .hash({
      on: entangle().pick('current'),
      off: entangle().pick('_states', 'current').difference()
    });
  }, // }}}

  /**
   * @name class
   * @desc add `on` classes and removes `off` classes
   */
  class$: function (selector) { // {{{
    return entangle()
    .each(entangle.classname)
    .sponge()
    .invoke$(selector, {
      addClass: 'on', removeClass: 'off'
    });
  }, // }}}

  /**
   * @name date
   * @desc add `on` classes and removes `off` classes
   */
  date: function () { // {{{
    return function (data) {
      return this.resolve(new Date(data));
    };
  }, // }}}

  /**
   * @name visibic
   * @desc `visibic` element visibility control
   */
  visibic$: function (selector) {
    return function (enabled) {
      enabled = typeid(enabled) == 'array' ? enabled : [ enabled ];
      enabled.push('*');
      $(selector)
      .addClass('hidden')
      .filter(_.map(enabled, function (v) {
        return '[data-visibic~="' + v + '"]';
      }).join(', '))
      .removeClass('hidden');
    };
  },

});

