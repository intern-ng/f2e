
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
  .visibic$('.dashboard[data-visibic]')

});

app.dependency({
  home_set_profile: 'profile',
  home_set_dashboard: 'userdata'
});

