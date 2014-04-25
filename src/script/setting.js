/////////////
// Setting //
/////////////

var setting = new entangle.Application({

  urlhash: entangle()

  .pick(function (hash) {
    this.resolve(hash[0] == '#' ? hash.slice(1) : hash);
  }),

  setting_set_path: entangle()

  .pick(function (hash) {
    $('.navlist a').removeClass('active');
    $('.navlist a[href="' + hash + '"]').addClass('active');
  }),

  setting_set_section: entangle()

  .pick(function (___) {
    this.resolve('section-' + ___);
  })
  .array()
  .radio([ 'section-account', 'section-profile', 'section-message', 'section-privacy', 'section-help', 'section-feedback' ])
  .class$('.section-control')

});

app.extend(setting);

app.dependency({
  setting_set_section: 'urlhash',
  setting_set_path: 'location',
  urlhash: 'location'
});

