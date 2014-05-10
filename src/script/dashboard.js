
app.extend({

  home_set_profile: entangle()

  .slot()
  .fork([
        entangle().inject(entangle().$('.view-profile-summary .view-photo-img').$pack()).pick().$attr('src', '{{photo}}'),
        entangle().pick().string('url("{{cover}}") no-repeat center').pack('css').inject(entangle().$('.view-cover').$pack()).pick().$css('background', '{{css}}'),
        entangle().inject(entangle().$('.view-nickname').$pack()).pick().$text('{{nickname}}'),

  ]),

  home_set_dashboard: entangle()

  .pick('role')
  .visibic$('.dashboard[data-visibic], .edit-announcement')

});

app.dependency({
  home_set_profile: 'profile',
  home_set_dashboard: 'userdata'
});

$('.edit-announcement').click(function () {
  var $el = $(this);

  if ($el.hasClass('editing')) {

    $el.removeClass('editing');
    $el.text('编辑');

    $('.announcement-editor').addClass('hidden');
    $('.announcement-text').removeClass('invisible');

    $('.announcement-text').text($('.announcement-editor').val());

    localStorage.setItem('announcement', $('.announcement-editor').val());

  } else {

    $el.addClass('editing');
    $el.text('保存');

    $('.announcement-editor').removeClass('hidden');
    $('.announcement-text').addClass('invisible');

    $('.announcement-editor').val($('.announcement-text').text());

  }
});

$('.announcement-text').text(localStorage.getItem('announcement') || '暂无公告');

