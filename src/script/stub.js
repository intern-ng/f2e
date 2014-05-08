
entangle.extend({

  /**
   * @name http
   * @desc test http data provider
   * @param method - GET/PUT/POST/DELETE
   */
  http: function (method, option) { // {{{
    return function (url, data, _option) {
      var _this = this;
      var _url = (typeid(url) == 'function') ? url.apply(this, arguments) : url;
      _option = _.defaults(_option || {}, option);
      var route = _.find(stub.router, function (v, k) {
        var match = v.exec(url);
        if (match) {
          if (stub.server && stub.server[k] && stub.server[k][method]) {
            console.debug('stub>', method, url, '=>', k);
            var res = stub.server[k][method](data, match);
            console.debug('stub:', res);
            _this.resolve(res);
            return true;
          } else {
            console.error('stub>', method, url, '=> NOT FOUND');
          }
        }
      });

      if (!route) return _this.resolve({
        data: '',
        status: 404
      });
    };
  }, // }}} http

});

var stub = {

  save: function (part) { // {{{
    localStorage.setItem(part, JSON.stringify(stub.data[part]));
  }, // }}}

  router: {
    signin: /\/signin/i,
    logout: /\/logout/i,
    u_item: /\/u\/([^/]+)/i,
    u_prof: /\/u\/([^/]+)\/p/i,
    u_curr: /\/u/i,
    u_list: /\/u\//i,
  },

  server: {

    signin: { // {{{

      post: function (data) {
        var account = _.find(stub.data.u, function (u) { return u.username == data.username; });
        if (!account) return { status: 404 };
        if (account.password != data.password) return { status: 403 };
        stub.data.e = {};
        stub.data.e.account = account;
        stub.save('e');
        return {
          status: 200,
          data: account,
        };
      },

    }, // }}}

    logout: { // {{{

      post: function () {
        stub.data.e = {};
        stub.save('e');
        return {
          status: 200
        };
      },

    }, // }}}

    u_curr: {

      get: function () {
        return {
          status: stub.data.e.account? 200: 403,
          data: stub.data.e.account
        };
      },

    },

    u_list: { // {{{

      get: function (data, match) {
        return {
          status: 200,
          data: _.map(stub.data.u, function (u, i) { return u.id; } )
        };
      },

      post: function (data, match) {

        var added = _.map(data, function (data) {

          var account = {
            uid: stub.data.u.length,
            p: {},
            c: [],
            m: [],
          };

          _.extend(account, data);

          if (_.any(stub.data.u, function (u) { return u.username == account.username; })) {
            return {
              err: 'duplicated',
              req: account,
            };
          }

          stub.data.u.push(account);

          return account;

        });

        stub.save('u');

        return {
          status: 200,
          data: added,
        };

      },

      delete: function (data, match) {
        var removed = _.remove(stub.data.u, function (u) { return '' + u.id == match[1]; });
        stub.save('u');
        return {
          status: 200,
          data: removed,
        };
      },

    }, // }}}

    u_prof: { // {{{

      get: function (data, match) {

        var account = _.find(stub.data.u, function (u) { return u.id == match[1]; });

        return {
          status: account? 200: 404,
          data: account && account.p,
        };

      },

      post: function (data, match) {

        var account = _.find(stub.data.u, function (u) { return u.id == match[1]; });

        var result = {
          status: account? 200: 404,
          data: account && _.extend(account.p, data),
        };

        stub.save('u');

        return result;

      },

    }, // }}}

    u_item: { // {{{

      get: function (data, match) {

        var account = _.find(stub.data.u, function (u) { return u.id == match[1]; });

        return {
          status: account? 200: 404,
          data: account && account,
        };

      },

      post: function (data, match) {

        var account = _.find(stub.data.u, function (u) { return u.id == match[1]; });

        var result = {
          status: account? 200: 404,
          data: account && _.extend(account, data),
        };

        stub.save('u');

        return result;

      },

    }, // }}}

  },

};

if (!localStorage.getItem('inited')) {

  localStorage.setItem('inited', true);

  localStorage.setItem('e', JSON.stringify({}));
  localStorage.setItem('u', JSON.stringify([{
    id: 0,
    username: 'admin',
    password: 'admin',
    role: 'admin',
    email: 'admin@bar.lz',
    p: {
      nickname: '管理员',
      photo: '/img/default_photo.jpg',
      cover: '/img/default_cover.jpg',
    },
    m: [],
    c: [],
  }]));

}

stub.data = {

  e: JSON.parse(localStorage.getItem('e')) || {},
  u: JSON.parse(localStorage.getItem('u')) || [],

};
