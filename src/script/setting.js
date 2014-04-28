/////////////
// Setting //
/////////////

app.extend({

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

  .visibic$('.panel-control > [data-visibic]'),

});

app.dependency({
  setting_set_section: 'urlhash',
  setting_set_path: 'location',
  urlhash: 'location'
});

