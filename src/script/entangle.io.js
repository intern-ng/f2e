/**
 * Entangle - I/O Toolkit
 */

entangle.extend({

  /**
   * @name data
   * @desc resolves static data
   */
  data: function () { // {{{
    var data = array(arguments);
    return function () {
      fapply(this.resolve, this, data);
    };
  }, // }}} data

  /**
   * @name inject
   * @desc inject static value to data object
   * @param conv...
   */
  inject: function () {
    var conv = [ entangle.passby() ].concat(array(arguments));
    return entangle()
    .hash(conv)
    .sponge(true)
    .fold(_.merge, Object);
  },

  /**
   * @name preset
   * @desc inject static value to data object
   * @param conv...
   */
  preset: function () {
    var conv = array(arguments);
    conv.push(entangle.passby());
    return entangle()
    .hash(conv)
    .sponge(true)
    .fold(_.merge, Object);
  },

  /**
   * @name timeout
   * @desc set timeout to next converter
   * @param interval - time in milliseconds
   */
  timeout: function (interval) { // {{{

    var watch = (function () {
      var timer;
      return {
        clear: function () { window.clearTimeout(timer); },
        setup: function (func) {
          watch.clear();
          timer = window.setTimeout(func, interval);
        }
      };
    })();

    return function () {
      var _this = this, args = arguments;
      watch.setup(function () {
        fapply(_this.resolve, _this, args);
      });
    };

  }, // }}} timeout

  /**
   * @name http
   * @desc performing http get request
   * @param method - GET/PUT/POST/DELETE
   * @param option - options passed to jQuery.ajax
   */
  http: function (method, option) { // {{{
    return function (url, data, _option) {
      var _this = this;
      var _url = (typeid(url) == 'function') ? url.apply(this, arguments) : url;
      _option = _.defaults(_option || {}, option);
      return ajax(method, _url, data, _option, ajax.handler('*', function (data, status, xhr) {
        return _this.resolve({
          data: data,
          status: status,
          xhr: xhr
        });
      }));
    };
  }, // }}} http

  /**
   * @name json
   * @desc ajax method with json data
   */
  json: function (method, option) { // {{{ json
    return entangle.http(method, _.defaults(option || {}, {
      cache: false,
      dataType: 'json'
    }));
  }, // }}} json

});

