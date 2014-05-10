
var openCourse = function (c) {

  $('.course-list').addClass('hidden');
  $('.course-view').removeClass('hidden');

  $('.course-view').data('id', c.id);
  $('.course-view').data('c', c);

  $('.course-view #edit-course').off('click').click(function () {
    editCourse($('.course-view').data('c'));
  });

  course.view.call(null, c);

};

$('#back-course-list').click(function () {

  $('.course-list').removeClass('hidden');
  $('.course-view').addClass('hidden');

});

var course = new entangle.Application();

course.extend({

  init: entangle()

  .data('/c/')
  .json('get')
  .pick('data')
  .slot(),

  list: entangle()

  .collect(_.identity)
  .each(function () {

    var $el = $($('script#course-item').text()).appendTo('.course-list .list-content');

    $el.click(function () {
      return openCourse($(this).data('c'));
    });

    return entangle()

    .pack('id')
    .pick().string('/c/{{id}}')
    .json('get')
    .pick('data')
    .fork([

          entangle().inject(entangle.data({ $el: $el })).pick().$attr('data-id', '{{id}}'),
          entangle().inject(entangle.data({ $el: $el })).pick().$data('c', '{{___}}'),
          entangle().inject(entangle.data({ $el: $el.find('.view-title-text') })).pick().$text('{{title}}'),
          entangle().pick(function (t) {
            $el.find('.view-task-count').text('' + t.length);
          }),
          entangle().pick(function (capacity) {
            if (!capacity || Number.isNaN(capacity)) {
              $el.find('.view-capacity').addClass('hidden');
            } else {
              $el.find('.view-capacity').removeClass('hidden');
            }
            $el.find('.view-capacity-count').text('' + capacity);
          }),
          entangle().pick(function (y) {
            $el.find('.view-enrolled-count').text('' + _.reduce(y, function (s, y) { return y.accepted ? s + 1 : s; }, 0));
            $el.find('.view-applying-count').text('' + y.length);
          }),
          entangle().pick().string('/u/{{creator}}').json('get').pick('data').pick('p')
          .inject(entangle.data({ $el: $el.find('.view-creator') })).pick().$text('{{nickname}}'),
          entangle().pick('created_at').date().transform(function (date) {
            $el.find('.view-created-at').text(date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate());
          }),
          entangle().pick(function (deleted) {
            $el.remove();
          }),
          course.view,

    ]);

  }),

  view: (function ($el) {

    return entangle()

    .sponge()
    .pick(function (___) { if ('' + ___.id == $el.data('id')) this.resolve(___); })
    .fork([

          entangle().inject(entangle.data({ $el: $el })).pick().$data('c', '{{___}}'),
          entangle().inject(entangle.data({ $el: $el.find('.view-title-text') })).pick().$text('{{title}}'),
          entangle().inject(entangle.data({ $el: $el.find('.view-description') })).pick().$text('{{description}}'),
          entangle().pick(function (t) {
            $el.find('.view-task-count').text('' + t.length);
          }),
          entangle().pick(function (capacity) {
            if (!capacity || Number.isNaN(capacity)) {
              $el.find('.view-capacity').addClass('hidden');
            } else {
              $el.find('.view-capacity').removeClass('hidden');
            }
            $el.find('.view-capacity-count').text('' + capacity);
          }),
          entangle().pick(function (y) {
            $el.find('.view-enrolled-count').text('' + _.reduce(y, function (s, y) { return y.accepted ? s + 1 : s; }, 0));
            $el.find('.view-applying-count').text('' + y.length);
          }),
          entangle().pick().string('/u/{{creator}}').json('get').pick('data').pick('p')
          .inject(entangle.data({ $el: $el.find('.view-creator') })).pick().$text('{{nickname}}'),
          entangle().pick('created_at').date().transform(function (date) {
            $el.find('.view-created-at').text(date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate());
          }),
          entangle().pick(function (deleted) {
            $el.addClass('hidden');
          })

    ])
    .fork([

          entangle()
          .pick(function (y, uid) {
            y = _.find(y, function (y) { return y.u == uid; });
            $el.find('button.btn.btn-lg').addClass('hidden');
            $el.find('box-colorful').removeClass('box-color-blue box-color-green');
            if (!y) {
              $el.find('#apply').removeClass('hidden');
            } else if (y.accepted) {
              $el.find('box-colorful').addClass('box-color-green');
              $el.find('#accepted').removeClass('hidden');
            } else {
              $el.find('box-colorful').addClass('box-color-blue');
              $el.find('#cancel').removeClass('hidden');
            }
          })

    ]);

  })($('.course-view')),

});

app.route({
  userdata: entangle().pick('id').pack('uid').fork(course.view),
});

course.route({
  init: 'list'
});

course.setup();


