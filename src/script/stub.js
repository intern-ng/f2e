
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
            _this.resolve(_.cloneDeep(res));
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
    signin: /^\/signin$/i,
    logout: /^\/logout$/i,
    faq   : /^\/faq$/i,
    u_item: /^\/u\/([^/]+)$/i,
    u_prof: /^\/u\/([^/]+)\/p$/i,
    u_curr: /^\/u$/i,
    u_list: /^\/u\/$/i,
    c_item: /^\/c\/([^/]+)$/i,
    c_list: /^\/c\/$/i,
    t_item: /^\/t\/([^/]+)$/i,
    t_list: /^\/t\/$/i,
    y_item: /^\/c\/([^/]+)\/y\/([^/]+)$/i,
  },

  server: {

    signin: { // {{{

      post: function (data) {
        var account = _.find(stub.data.u, function (u) { return u.username == data.username; });
        if (!account) return { status: 404 };
        if (account.password != data.password) return { status: 403 };
        stub.data.e = {};
        stub.data.e.account = account.id;
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

    faq: { // {{{

      get: function (data) {
        return {
          status: 200,
          data: stub.data.faq
        };
      },

      post: function (data) {
        stub.data.faq = data;
        stub.save('faq');
        return {
          status: 200
        };
      },

    }, // }}}

    u_curr: { // {{{

      get: function () {
        return stub.server.u_item.get({}, [ undefined, stub.data.e.account ]);
      },

    }, // }}}

    u_list: { // {{{

      get: function (data, match) {
        return {
          status: 200,
          data: _(stub.data.u).filter(function (u) { return !u.deleted; }).map(function (u) { return u.id; }).value()
        };
      },

      post: function (data, match) {

        var added = _.map(data, function (data) {

          var account = {
            id: stub.data.u.length,
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
          data: account && _.merge(account, data),
        };

        stub.save('u');

        return result;

      },

      'delete': function (data, match) {
        var account = _.find(stub.data.u, function (u) { return '' + u.id == match[1]; });
        account.deleted = true;
        stub.save('u');
        return {
          status: 200,
          data: account,
        };
      },

    }, // }}}

    y_item: { // {{{

      get: function (data, match) {

        var c = stub.server.c_item.get(data, match).data;

        var i = _.find(c.y, function (u) { return u.id == match[2]; });

        return {
          status: i? 200: 404,
          data: i,
        };

      },

      post: function (data, match) {

        var c = stub.server.c_item.get(data, match).data;

        var i = _.find(c.y, function (u) { return u.id == match[2]; });

        if (!i) c.y.push(i = { id: match[2], accepted: false, created_at: Date.now() });

        delete i.deleted;

        i = _.merge(i, data);

        stub.save('c');

        return {
          status: 200,
          data: i
        };

      },

      'delete': function (data, match) {

        var c = stub.server.c_item.get(data, match).data;
        var i = _.find(c.y, function (u) { return u.id == match[2]; });

        if(i) i.deleted = true;

        stub.save('c');

        return {
          status: 200,
          data: i,
        };

      },

    }, // }}}

  },

};

var crud = function (name, create, list, update, remove, itemdata) { // {{{

  create = create || _.merge;
  list = list || _.partialRight(_.map, function (i) { return i.id; });
  update = update || _.merge;
  remove = remove || _.identity;
  itemdata = itemdata || _.identity;

  stub.server[name + '_list'] = {

    get: function (data, match) { // {{{

      return {
        status: 200,
        data: list(_.filter(stub.data[name], function (i) { return !i.deleted; }))
      };

    }, // }}}

    post: function (data, match) { // {{{

      var added = _.map(data, function (data) {

        var item = {
          id: stub.data[name].length,
          creator: stub.data.e.account,
          created_at: Date.now(),
        };

        item = create(item, data) || item;

        stub.data[name].push(item);

        return item;

      });

      stub.save(name);

      return {
        status: 200,
        data: added,
      };

    }, // }}}

  };

  stub.server[name + '_item'] = {

    get: function (data, match) { // {{{

      var item = _.find(stub.data[name], function (i) { return i.id == match[1]; });

      item = itemdata(item || item);

      return {
        status: item? 200: 404,
        data: item,
      };

    }, // }}}

    post: function (data, match) { // {{{

      var item = _.find(stub.data[name], function (i) { return i.id == match[1]; });

      item = update(item, data) || item;

      stub.save(name);

      return {
        status: item? 200: 404,
        data: item,
      };

    }, // }}}

    'delete': function (data, match) { // {{{

      var item = _.find(stub.data[name], function (i) { return '' + i.id == match[1]; });

      item = remove(item) || item;

      if(item) item.deleted = true;

      stub.save(name);

      return {
        status: 200,
        data: item,
      };

    }, // }}}

  };

}; // }}}

crud('c', function (course, data) {

  _.extend(course, {

    state: 'preparing',
    t: [],
    y: [],

  });

  _.extend(course, data);

}, undefined, _.extend);

crud('t', function (task, data) {

  _.extend(task, {

    a: [],

  });

  _.extend(task, data);

}, undefined, _.extend);


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
  c: JSON.parse(localStorage.getItem('c')) || [],
  t: JSON.parse(localStorage.getItem('t')) || [],
  faq: JSON.parse(localStorage.getItem('faq')) || '',

};

