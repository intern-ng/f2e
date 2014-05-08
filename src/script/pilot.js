////////////////////
// Navigation Bar //
////////////////////

var $content = $('.content-container > .container');

app.extend({

  location: entangle()

  .location(),      // provide window.location

  userdata: entangle()

  .sponge(true)     // always trigger
  .data('/u')
  .json('get')      // get json data from server
  .slot('response')
  .pick('data')     // pick data from response
  .sponge(),        // cache the result & trigger limiter

  profile: entangle()

  .pick('p')

});

app.dependency({
  profile : 'userdata',
});

// attach to entry point `main`
app.route({
  init: [ 'location', 'userdata' ]
});

// connect timeout between `userdata response` and `userdata`
app.route({
  userdata: {
    response: entangle().timeout(2000).data().fork(app.userdata)
  }
});

app.route({

  userdata: {

    $: entangle()

    .pick('role')
    .visibic$('.navbar-left [data-visibic]'),


    response: entangle()

    .pick('status').array()
    .cases({ 200: 'online', ___: 'offline' })
    .visibic$('.navbar-right [data-visibic], .navbar-left')

  },

  profile: entangle()

  .inject(
    entangle().$('.navbar .data-holder.data-profile-name').pack('$el')
  )
  .pick().$text('{{nickname}}'),

  location: entangle()

  .pick()
  .string('.navbar-collapse a[href="{{pathname}}"]')
  .$()
  .$parent('li')
  .$addClass('active'),

});

