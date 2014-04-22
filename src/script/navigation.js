////////////////////
// Navigation Bar //
////////////////////

// jshint -W085: don't use 'with'

entangle()
.location()
.fork([
      entangle().pick(function (pathname) {
                  $('.navbar-collapse a[href="' + pathname + '"]').parent('li').addClass('active');
                }),
], {
  user: entangle().pick( /* 'search' is auto-detected */ ).qs()
                  .poll(eukit.io.HttpGet(function (qs) { return '/u/' + qs.u; }), 2000)
                  .fork([
                    entangle().radio(['online', 'offline'],
                                     entangle.pick(function (status) {
                                       this.resolve([ status == 200 ? 'online' : 'offline' ]);
                                     }))
                    .class$('.navbar .navbar-control')
                  ], {
                    data: entangle().pick('data'),
                  })
                  .pick('data')
})
.pick('user')
.fork([
      entangle().invoke$('.navbar .text-profile-name', { text: 'name' }),
      entangle()
      .radio([ 'admin', 'student', 'teacher' ],
             entangle.pick(function (role) { this.resolve([ role ]); }))
      .class$('.navbar .navbar-control')
])
.call();

