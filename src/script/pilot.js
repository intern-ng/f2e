////////////////////
// Navigation Bar //
////////////////////

var $content = $('.content-container > .container');

app.extend({

  location: entangle()

  .location(),      // provide window.location

  user_uri: entangle()

  .pick().qs()      // pick `search` and resolve it use `qs`
  .pick(false)      // do not force paremeter `u`
  .string('u/{{u}}'),

  userdata: entangle()

  .sponge(true)     // always trigger
  .json('get')      // get json data from server
  .slot('response')
  .pick('data')     // pick data from response
  .sponge(),        // cache the result & trigger limiter

});

app.dependency({
  user_uri: 'location',
  userdata: 'user_uri',
});

// attach to entry point `main`
app.route({
  init: [ 'location' ]
});

// connect timeout between `userdata response` and `userdata`
app.route({
  userdata: {
    response: entangle().timeout(2000).data().fork(app.userdata)
  }
});

app.route({

  userdata: {

    $: [

      entangle()

      .pick('role')
      .visibic$('.navbar-left [data-visibic]'),

      entangle()

      .inject(
        entangle().string('.navbar .data-holder.data-profile-name').$().pack('$el')
      )
      .pick().$text('{{name}}')

    ],

    response: entangle()

    .pick('status').array()
    .cases({ 200: 'online', ___: 'offline' })
    .visibic$('.navbar-right [data-visibic], .navbar-left')

  },

  location: entangle()

  .pick()
  .string('.navbar-collapse a[href="{{pathname}}"]')
  .$()
  .$parent('li')
  .$addClass('active'),

});

