
var createCourse = function () {

  hide('courselist');
  show('courseedit');

  $('.course-editor input[name="title"]').val('');
  $('.course-editor input[name="capacity"]').val('');
  $('.course-editor textarea').val('');

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
        show('courselist');
        hide('courseedit');
      }
    }).call();

    return false;

  });

  $('.course-editor button#cancel').off('click').click(function () {

    show('courselist');
    hide('courseedit');

  });

  return false;

};

var editCourse = function (c) {

  hide('courseview');
  show('courseedit');

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
        show('courseview');
        hide('courseedit');
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
        show('courselist');
        hide('courseview');
        hide('courseedit');
      }
    }).call();
  });

  $('.course-editor button#cancel').off('click').click(function () {
    show('courseview');
    hide('courseedit');
  });

  return false;

};

var openCourse = function (c) {

  hide('courselist');
  show('courseview');

  $('.course-view').data('id', c.id);
  $('.course-view').data('c', c);

  $('.course-view #edit-course').off('click').click(function () {
    editCourse($('.course-view').data('c'));
  });

  course.view.call(null, c);

};

$('#back-course-list').click(function () {

  show('courselist');
  hide('courseview');

});

var hide = _.extend(function (what) {
  $(hide[what] || what).addClass('hidden');
}, {
  courseview: '.course-view, .registry-list',
  courselist: '.course-list',
  courseedit: '.course-editor',
});

var show = _.extend(function (what) {
  $(show[what] || what).removeClass('hidden');
}, {
  courseview: '.course-view',
  courselist: '.course-list',
  courseedit: '.course-editor',
});

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
            $el.find('.view-applying-count').text('' + _.reduce(y, function (s, y) { return y.deleted ? s : s + 1; }, 0));
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
            $el.find('.view-applying-count').text('' + _.reduce(y, function (s, y) { return y.deleted ? s : s + 1; }, 0));
          }),
          entangle().pick().string('/u/{{creator}}').json('get').pick('data').pick('p')
          .inject(entangle.data({ $el: $el.find('.view-creator') })).pick().$text('{{nickname}}'),
          entangle().pick('created_at').date().transform(function (date) {
            $el.find('.view-created-at').text(date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate());
          }),
          entangle().pick(function (deleted) {
            $el.addClass('hidden');
          })

    ]);

  })($('.course-view')),

  registry: entangle()

  .pick(function (___) {
    if (___.state == 'preparing') {

      show('.registry-list');

      var id = _.pluck(___.y, 'id');

      $('.registry-list .registry-item').each(function (i, el) {
        var $el = $(el);
        if (!~id.indexOf($el.data('id'))) $el.remove();
      });

      this.resolve(___.y);
    }
  })

  .collect(function (x) { return x.id; })
  .each(function () {

    var $el = $($('script#registry-item').text());

    $el.click(setEnrollment);

    var setEnrollment = function () {

      entangle()
      .data('/c/' + $('.course-view').data('id') + '/y/' + $el.data('id'), { accepted: !$el.hasClass('selected') })
      .json('post')
      .pick(function (status, data) {
        course.list.call(null, [ $('.course-view').data('id') ]);
      })
      .call();

    };

    return entangle()
    .pack('item')
    .pick('item')
    .fork([
          entangle().inject(entangle.data({ $el: $el })).pick().$attr('data-id', '{{id}}'),
          entangle().inject(entangle.data({ $el: $el })).pick().$data('y', '{{___}}'),
          entangle().pick(function (___) {
            if (___.accepted) $el.addClass('selected');
            else $el.removeClass('selected');
          }),
          entangle().pick(function (___) {
            if (___.deleted) $el.remove();
            else $el.appendTo('.registry-list .list-content').click(setEnrollment);
          }),
          entangle().pick().string('/u/{{id}}/p').json('get').pick('data').sponge()
          .fork([
                entangle()
                .pick(function (___) {
                  ___.url = 'url(' + ___.photo + ')';
                  this.resolve($el, ___);
                })
                .$css('background-image', '{{url}}'),
                entangle().inject(entangle.data({ $el: $el.find('.view-nickname-link') })).pick().$text('{{nickname}}'),
          ]),
    ]);

  })

});

course.route({
  init: 'list',
  view: 'registry'
});

course.setup();

