////////////////////
// Navigation Bar //
////////////////////

var navbar = new entangle.Application({

  navbar: entangle()

  .location().slot('location')
  .pick( /* 'search' is auto-detected */ ).qs()
  .pick(function (u) { this.resolve('/u/' + u); })
  .poll(eukit.io.HttpGet(), 2000).slot('raw_data')
  .pick('data'),

  navbar_set_path: entangle()

  .pick(function (pathname) { $('.navbar-collapse a[href="' + pathname + '"]').parent('li').addClass('active'); }),

  navbar_set_line: entangle()

  .pick('status').array().cases({ 200: 'online', ___: 'offline' })
  .radio(['online', 'offline']).class$('.navbar .navbar-control'),

  navbar_set_name: entangle()

  .invoke$('.navbar .data-holder.data-profile-name', { text: 'name' }),

  navbar_set_role: entangle()

  .pick('role').array()
  .radio([ 'admin', 'student', 'teacher' ]).class$('.navbar .navbar-control'),

});

navbar.dependency({
  navbar_set_line: 'navbar raw_data',
  navbar_set_path: 'navbar location',
  navbar_set_name: 'navbar',
  navbar_set_role: 'navbar',
});

app.extend(navbar);

app.dependency({

  navbar: 'main'

});

