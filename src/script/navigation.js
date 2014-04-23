////////////////////
// Navigation Bar //
////////////////////

var app = {

  navbar: entangle()

  .location().slot('location')
  .pick( /* 'search' is auto-detected */ ).qs()
  .pick(function (u) { this.resolve('/u/' + u); })
  .poll(eukit.io.HttpGet(), 2000).slot('raw_data')
  .pick('data'),

  set_path: entangle()

  .pick(function (pathname) { $('.navbar-collapse a[href="' + pathname + '"]').parent('li').addClass('active'); }),

  set_line: entangle()

  .pick('status').array().cases({ 200: 'online', ___: 'offline' })
  .radio(['online', 'offline']).class$('.navbar .navbar-control'),

  set_name: entangle()

  .invoke$('.navbar .data-holder.data-profile-name', { text: 'name' }),

  set_role: entangle()

  .pick('role').array()
  .radio([ 'admin', 'student', 'teacher' ]).class$('.navbar .navbar-control'),

};

app.navbar.fork({ location: app.set_path, raw_data: app.set_line, ___: [ app.set_name, app.set_role ] });

app.navbar.call();

