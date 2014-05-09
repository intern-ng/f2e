/////////////
// Setting //
/////////////

app.extend({

  urlhash: entangle()

  .pick(function (hash) {
    this.resolve(hash[0] == '#' ? hash.slice(1) : hash);
  }),

  setting_set_path: entangle()

  .pick(function (hash) {
    $('.navlist a').removeClass('active');
    $('.navlist a[href="' + hash + '"]').addClass('active');
  }),

  setting_set_section: entangle()

  .visibic$('.panel-control > [data-visibic]'),

  setting_set_account: entangle()

  .pick(function (username, email) {
    $('input[name="username"]').val(username);
    $('input[name="email"]').val(email);
  }),

  setting_logout: entangle()

  .$('button[name="logout"]')
  .$on('click', { preventDefault: true })
  .spec('object', 'object')
  .pack('$el', 'e')
  .pick('e')
  .pick('timeStamp')
  .data('/logout')
  .json('post')
  .pick(function (status) {
    if (status == 200) {
      window.location = '/signin.html';
    }
  }),

  setting_load_faq: entangle()

  .data('/faq')
  .http('get')
  .pick('data')
  .$()
  .$appendTo('.view-faq')

});

app.dependency({
  setting_set_section: 'urlhash',
  setting_set_account: 'userdata',
  setting_set_path: 'location',
  setting_logout: 'init',
  urlhash: 'location'
});

app.route({
  init: 'setting_load_faq'
});

