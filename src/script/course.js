
var createCourse = function () {

  openCourseEditor();

  $('.course-editor .delete-item').addClass('hidden');

  $('form').off('submit').on('submit', function () {

    entangle()
    .data('/c/', [{
      title: $('.course-editor input[name="title"]').val(),
      capacity: parseInt($('.course-editor input[name="capacity"]').val()),
      description: $('.course-editor textarea').val(),
    }])
    .json('post')
    .pick(function (status, data) {
      if (status == 200) {
        course.list.call(null, _(data).filter(function (v, k) { return !v.err; }).pluck('id').value());
        closeCourseEditor();
      }
    }).call();

    return false;

  });

  return false;

};

var editCourse = function () {

  var $el = $(this);

  openCourseEditor();

  var c = $el.data('c');

  $('.course-editor input[name="title"]').val(c.title);
  $('.course-editor input[name="capacity"]').val(c.capacity || '');
  $('.course-editor textarea').val(c.description);

  $('.course-editor .delete-item').removeClass('hidden');

  $('.course-editor form').off('submit').on('submit', function () {

    entangle()
    .data('/c/' + c.id, {
      title: $('.course-editor input[name="title"]').val(),
      capacity: parseInt($('.course-editor input[name="capacity"]').val()),
      description: $('.course-editor textarea').val(),
    })
    .json('post')
    .pick(function (status, data) {
      if (status == 200) {
        course.list.call(null, [ c.id ]);
        closeCourseEditor();
      }
    }).call();

    return false;

  });

  $('.course-editor .delete-item button').off('click').click(function () {
    entangle()
    .data('/c/' + c.id)
    .json('delete')
    .pick(function (status) {
      if (status == 200) {
        course.list.call(null, [ c.id ]);
        closeCourseEditor();
      }
    }).call();
  });

  return false;

};

var openCourseEditor = function () {

  $('.course-list').addClass('hidden');
  $('.course-editor').removeClass('hidden');

  $('.course-editor input[name="title"]').val('');
  $('.course-editor input[name="capacity"]').val('');
  $('.course-editor textarea').val('');

};

var closeCourseEditor = function () {

  $('.course-list').removeClass('hidden');
  $('.course-editor').addClass('hidden');

};

$('.course-editor button#cancel').click(closeCourseEditor);

$('.course-list #create-course').click(createCourse);

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

    $el.click(editCourse);

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
          })

    ]);

  }),

});

course.route({
  init: 'list'
});

course.setup();

