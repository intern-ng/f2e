////////////////////
// Navigation Bar //
////////////////////

entangle()
.location()
.fork([
      entangle().pick(function (pathname) {
                  $('.navbar-collapse a[href="' + pathname + '"]').parent('li').addClass('active');
                }),
      entangle().pick( /* 'search' is auto-detected */ ).qs()
                .poll(eukit.io.HttpGet(function (qs) { return '/u/' + qs.u; }), 2000)
                .fork([
                      entangle().radio(['online', 'offline'],
                                       entangle.pick(function (status) {
                                         this.resolve([ status == 200 ? 'online' : 'offline' ]);
                                       }))
                                .class$('.navbar .navbar-control'),
                      entangle().pick('data')
                                .fork([
                                      entangle().invoke$('.navbar .data-holder.data-profile-name', { text: 'name' }),
                                      entangle().radio([ 'admin', 'student', 'teacher' ],
                                                       entangle.pick(function (role) { this.resolve([ role ]); }))
                                                .class$('.navbar .navbar-control')
                                ]),
                ]),
])
.call();

