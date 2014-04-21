////////////////////
// Navigation Bar //
////////////////////

entangle().location().fork({

  capture: entangle().capture(function (pathname) {
    $('.navbar-collapse a[href="' + pathname + '"]').parent().addClass('active');
  }),

  user: entangle()
  .capture().qs() // capture `search` parameter and pass to qs
  .poll(eukit.io.HttpGet(function (qs) {
    return '/u/' + qs.u;
  }), 2000)
  .fork({

    data: entangle.capture('data'),

    // set online status
    online: entangle().capture(function (status) {
      if (status == 200) {
        return this.resolve({ set: 'online', reset: 'offline' });
      } else {
        return this.resolve({ set: 'offline', reset: 'online' });
      }
    })
    .$apply('.navbar .navbar-control', {
      addClass: 'set', removeClass: 'reset'
    })

  }).capture('data')

}).capture('user').fork({

  set_name: entangle()
  .$apply('.navbar .text-profile-name', { text: 'name' }),

  set_role: entangle()
  .capture(function (role) {
    return this.resolve({
      set: role,
      reset: _.without(['admin', 'teacher', 'student'], role).join(' ')
    });
  })
  .$apply('.navbar .navbar-control', {
      addClass: 'set', removeClass: 'reset'
  })

}).call();

