//////////////////////////
// Entangle Utility Kit //
//////////////////////////

var eukit = {};

_.extend(eukit, {

  io: {}

});

////////
// IO //
////////

_.extend(eukit.io, {

  /**
   * @name HttpGet
   * @desc data juicer by performing http get request
   */
  HttpGet: function (url, data) {
    return function () {
      var _this = this;
      var _url = (typeid(url) == 'function') ? url.apply(this, arguments) : url;
      return ajax.get(_url, data, {
        cache: false,
        dataType: 'json'
      }, ajax.handler('*', function (data, status, xhr) {
        return _this.resolve({
          data: data,
          status: status,
          xhr: xhr
        });
      }));
    };
  },

});


