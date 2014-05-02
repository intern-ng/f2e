
app.extend({

  home_set_profile: entangle()
  .pick(function (name, photo, cover) {
    $('.view-profile-summary .view-photo-img').attr('src', photo);
    $('.view-cover').css({
      background: 'url("' + cover + '") no-repeat center'
    });
    $('.view-nickname').text(name);
  }),

  home_set_dashboard: entangle()

  .pick('role')
  .visibic$('.dashboard[data-visibic]')

});

app.dependency({
  home_set_profile: 'userdata',
  home_set_dashboard: 'userdata'
});

