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
                      entangle().pick('status')
                                .array().cases({ 200: 'online', ___: 'offline' })
                                .radio(['online', 'offline'])
                                .class$('.navbar .navbar-control'),
                      entangle().pick('data')
                                .fork([
                                      entangle().invoke$('.navbar .data-holder.data-profile-name', { text: 'name' }),
                                      entangle().pick('role').array()
                                                .radio([ 'admin', 'student', 'teacher' ])
                                                .class$('.navbar .navbar-control')
                                ]),
                ]),
])
.call();

