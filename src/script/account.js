
var createAccount = function () {

  $('.account-list').addClass('hidden');
  $('.account-editor').removeClass('hidden');

  $('.delete-item').addClass('hidden');
  $('#dropdown-role').removeClass('disabled');

  $('input[name="username"]').val('');
  $('input[name="password"]').val('');
  $('input[name="email"]').val('');
  $('input[name="nickname"]').val('');
  $('#dropdown-role .selected').text('学员');

  $('form').off('submit').on('submit', function () {

    entangle()
    .data('/u/', [{
      username: $('input[name="username"]').val(),
      password: $('input[name="password"]').val() || '111111',
      email: $('input[name="email"]').val(),
      role: $('#dropdown-role .selected').text() == '学员' ? 'student': 'teacher',
      p: {
        nickname: $('input[name="nickname"]').val(),
        photo: '//en.gravatar.com/avatar/' + md5($('input[name="email"]').val()) + '?d=identicon&s=200'
      }
    }])
    .json('post')
    .pick(function (status, data) {
      if (status == 200) {
        account.list.call(null, _(data).filter(function (v, k) { return !v.err; }).pluck('id').value());
        closeEditor();
      }
    }).call();

    return false;

  });

  return false;

};

$('#create-account').click(createAccount);

$('#dropdown-role li a').click(function () {
  if (!$('#dropdown-role').hasClass('disabled')) {
    $('#dropdown-role .selected').text($(this).text());
  }
  return false;
});

var closeEditor = function () {
  $('input[name="username"]').removeAttr('disabled');
  $('.account-editor').addClass('hidden');
  $('.account-list').removeClass('hidden');
  return false;
};

$('button#cancel').click(closeEditor);

var editAccount = function () {

  var $el = $(this);

  var u = $el.data('u');

  $('input[name="username"]').attr('disabled', 'disabled');

  $('.account-list').addClass('hidden');
  $('.account-editor').removeClass('hidden');

  $('.delete-item').addClass('hidden');
  $('#dropdown-role').removeClass('disabled');

  $('input[name="username"]').val(u.username);
  $('input[name="password"]').val('');
  $('input[name="email"]').val(u.email);
  $('input[name="nickname"]').val(u.p.nickname);
  $('#dropdown-role .selected').text({ admin: '管理员', student: '学员', teacher: '导师' }[u.role]);

  if (u.role == 'admin') $('#dropdown-role').addClass('disabled');
  if (u.role != 'admin') $('.delete-item').removeClass('hidden');

  $('.delete-item button').off('click').click(function () {
    entangle()
    .data('/u/' + u.id)
    .json('delete')
    .pick(function (status) {
      if (status == 200) {
        account.list.call(null, [ u.id ]);
        closeEditor();
      }
    }).call();
  });

  $('form').off('submit').submit(function () {

    entangle()
    .data('/u/' + u.id, _.transform({
      username: $('input[name="username"]').val(),
      password: $('input[name="password"]').val(),
      email: $('input[name="email"]').val(),
      role: { '学员': 'student', '导师': 'teacher', '管理员': 'admin' }[$('#dropdown-role .selected').text()],
      p: _.transform({
        nickname: $('input[name="nickname"]').val()
      }, function (r, v, k) { if (v) r[k] = v; })
    }, function (r, v, k) { if (v) r[k] = v; }))
    .json('post')
    .pick(function (status, data) {
      if (status == 200) {
        account.list.call(null, [ u.id ]);
        closeEditor();
      }
    }).call();

    return false;

  });

};

var account = new entangle.Application();

account.extend({

  init: entangle()

  .data('/u/')
  .json('get')
  .pick('data')
  .slot(),

  list: entangle()

  .collect(_.identity)
  .each(function () {

    var $el = $($('script#account-item').text()).appendTo('.account-list');

    $el.click(editAccount);

    return entangle()

    .pack('id')
    .pick().string('/u/{{id}}')
    .json('get')
    .pick('data')
    .fork([

          entangle().inject(entangle.data({ $el: $el })).pick().$attr('data-id', '{{id}}'),
          entangle().inject(entangle.data({ $el: $el })).pick().$data('u', '{{___}}'),
          entangle().pick('p').inject(entangle.data({ $el: $el.find('.view-photo-img') })).pick().$attr('src', '{{photo}}'),
          entangle().pick('p').inject(entangle.data({ $el: $el.find('.view-nickname-text') })).pick().$text('{{nickname}}'),
          entangle().inject(entangle.data({ $el: $el.find('.view-username-text') })).pick().$text('{{username}}'),
          entangle().inject(entangle.data({ $el: $el.find('.view-email-text') })).pick().$text('{{email}}'),
          entangle().pick(function (deleted) {
            $el.remove();
          })

    ]);

  }),

});

account.route({
  init: 'list'
});

account.setup();

