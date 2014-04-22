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
                  .fork({
                    data: entangle().pick('data'),
                  }, [
                    entangle()
                    .fork({
                      _states: entangle.data([ 'online', 'offline' ]),
                      current: entangle.pick(function (status) { this.resolve([status == 200 ? 'online' : 'offline']); })
                    })
                    .sponge()
                    .fork({
                      set: entangle().pick('current'),
                      rem: entangle().pick('_states', 'current').difference()
                    })
                    .hash(entangle.classname)
                    .sponge()
                    .invoke$('.navbar .navbar-control', {
                      addClass: 'set', removeClass: 'rem'
                    })
                  ])
                  .pick('data')
})
.pick('user')
.fork([
      entangle().invoke$('.navbar .text-profile-name', { text: 'name' }),
      entangle()
      .fork({
        _states: entangle.data([ 'admin', 'student', 'teacher' ]),
        current: entangle.pick(function (role) { this.resolve([ role ]); })
      })
      .sponge()
      .fork({
        set: entangle().pick('current').classname(),
        rem: entangle().pick('_states', 'current').difference().classname()
      })
      .sponge()
      .invoke$('.navbar .navbar-control', {
        addClass: 'set', removeClass: 'rem'
      })
])
.call();

