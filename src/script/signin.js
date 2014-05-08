
var signin = new entangle.Application();

signin.extend({

  username: entangle()

  .$('input[name="username"]')
  .$on('input', { preventDefault: true })
  .$val()
  .$pack('username'),

  password: entangle()

  .$('input[name="password"]')
  .$on('input', { preventDefault: true })
  .$val()
  .$pack('password'),

  formdata: entangle()

  .sponge()
  .pick('username', 'password')
  .pack('username', 'password')
  .pack('data')
  .inject(entangle.data({ url: '/signin' })),

  action: entangle()

  .$('form')
  .$on('submit', { preventDefault: true })
  .cond('object', 'object')
  .pack('$el', 'e')
  .pick('e')
  .pick('timeStamp')
  .pack('event'),

  submit: entangle()

  .sponge()
  .pick('url', 'data', 'event')
  .pack('url', 'data')
  .pick('url', 'data')
  .json('post')
  .pick(function (status, data) {
    if (status == 200) {
      window.location = '/dashboard.html';
    } else {
      alert('登录失败');
    }
  }),

});

signin.dependency({
  submit: [ 'formdata', 'action' ],
});

signin.route({
  username: 'formdata',
  password: 'formdata'
});

app.route({
  init: [ signin.username, signin.password, signin.action ]
});

