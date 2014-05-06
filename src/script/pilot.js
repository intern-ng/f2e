////////////////////
// Navigation Bar //
////////////////////

app.extend({

  location: entangle().location(),

  user_uri: entangle()

  .pick( /* 'search' is auto-detected */ ).qs()
  .pick(function (u) { this.resolve('/u/' + u); }, false)
  .sponge(),

  userdata: entangle()

  .sponge(true).json('get').slot('raw').pick('data').sponge(),

  userdata_poll: entangle()

  .timeout(2000).data(),

  navbar_set_path: entangle()

  .pick().string('.navbar-collapse a[href="{{pathname}}"]').$().$parent('li').$addClass('active'),

  navbar_set_line: entangle()

  .pick('status').array().cases({ 200: 'online', ___: 'offline' })
  .visibic$('.navbar-right [data-visibic], .navbar-left'),

  $el_navbar_name: entangle().data('.navbar .data-holder.data-profile-name').$().pack('$el'),

  navbar_set_name: entangle().sponge().pick().$text('{{name}}'),

  navbar_set_role: entangle()

  .pick('role')
  .visibic$('.navbar-left [data-visibic]'),

});

app.dependency({
  user_uri: 'location',
  userdata: 'user_uri',
  userdata_poll: 'userdata raw',
  navbar_set_line: 'userdata raw',
  navbar_set_path: 'location',
  navbar_set_name: [ 'userdata', '$el_navbar_name' ],
  navbar_set_role: 'userdata',
});

app.route({
  userdata_poll: 'userdata',
});

// attach to entry point `main`
app.route({
  main: [ 'location', '$el_navbar_name' ]
});

