
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
  courseview: '.course-view, .registry-list, .task-list, .task-editor, #review-view',
  courselist: '.course-list',
  'taskview': '.task-list, .task-editor',
});

var show = _.extend(function (what) {
  $(show[what] || what).removeClass('hidden');
}, {
  courseview: '.course-view',
  courselist: '.course-list',
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
            var ac = _.reduce(y, function (s, y) { return y.accepted ? s + 1 : s; }, 0),
            rc = _.reduce(y, function (s, y) { return y.deleted ? s : s + 1; }, 0);
            $el.find('.view-enrolled-count').text(ac);
            $el.find('.view-applying-count').text(rc - ac);
            if (rc - ac <= 0) {
              $el.find('.view-registry').addClass('hidden');
            } else {
              $el.find('.view-registry').removeClass('hidden');
            }
          }),
          entangle().pick().string('/u/{{creator}}').json('get').pick('data').pick('p')
          .inject(entangle.data({ $el: $el.find('.view-creator') })).pick().$text('{{nickname}}'),
          entangle().pick('created_at').date().transform(function (date) {
            $el.find('.view-created-at').text(date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate());
          }),
          entangle().pick(function (deleted) {
            $el.remove();
          }),
          entangle().timeout(1).pick(function (y) {
            y = _.find(y, function (y) { return y.id == window.user.id; });
            if (!(y && y.accepted)) $el.remove();
          }),
          entangle().sponge().pick(function (state) {
            $el.find('.box-colorful')
            .removeClass('box-color-blue box-color-green')
            .addClass({ preparing: 'box-color-blue', opened: 'box-color-green'}[state]);
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
            var ac = _.reduce(y, function (s, y) { return y.accepted ? s + 1 : s; }, 0),
            rc = _.reduce(y, function (s, y) { return y.deleted ? s : s + 1; }, 0);
            $el.find('.view-enrolled-count').text(ac);
            $el.find('.view-applying-count').text(rc - ac);
            if (rc - ac <= 0) {
              $el.find('.view-registry').addClass('hidden');
            } else {
              $el.find('.view-registry').removeClass('hidden');
            }
          }),
          entangle().pick(function (y) {
            y = _.find(y, function (y) { return y.id == window.user.id; });
            if (y && y.review) {
              $('#review-view').removeClass('hidden');
              $('#review-view .view-review').text(y.review);
            } else {
              $('#review-view').addClass('hidden');
            }
          }),
          entangle().pick().string('/u/{{creator}}').json('get').pick('data').pick('p')
          .inject(entangle.data({ $el: $el.find('.view-creator') })).pick().$text('{{nickname}}'),
          entangle().pick('created_at').date().transform(function (date) {
            $el.find('.view-created-at').text(date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate());
          }),
          entangle().sponge().pick(function (state) {
            $el.find('.box-colorful')
            .removeClass('box-color-blue box-color-green')
            .addClass({ preparing: 'box-color-blue', opened: 'box-color-green'}[state]);
          }),
          entangle().pick(function (deleted) {
            $el.addClass('hidden');
          })

    ]);

  })($('.course-view')),

});

var task = new entangle.Application();

task.extend({

  init: entangle()

  .pick(function (___) {
    if (___.state != 'preparing') {

      show('.task-list');

      $('.task-list .task-item').each(function (i, el) {
        var $el = $(el);
        if (!~___.t.indexOf($el.data('id'))) $el.remove();
      });

      this.resolve(___.t);

    } else {

      hide('taskview');

    }
  }),

  list: entangle()

  .collect(_.identity)
  .each(function () {

    var $el = $($('script#task-item').text()).appendTo('.task-list .list-content');

    $el.find('input[name="answer"]').off('change').on('change', function (e) {

      var t = $el.data('t');
      var file = e.target.files[0];
      var reader = new FileReader();

      if (file.size > 10 * 1024 * 1024) {
        alert('请选择小于 10MB 的文件');
        return false;
      }

      reader.onload = function (e) {
        var extname = file.name.split('.').slice(-1)[0];
        var datauri = e.target.result;

        var a = _.find(t.a, function (x) { return x.id == window.user.id; });
        if (!a) t.a.push(a = { id: window.user.id });

        if (a.location) localStorage.removeItem(a.location);

        var keyname = 'ls:///answer/answer-' + t.id + '-' + a.id + '.' + extname;

        _.extend(a, {
          location: keyname
        });

        entangle()
        .data('/t/' + t.id, {
          a: t.a
        })
        .json('post')
        .pick(function (status, data) {
          localStorage.setItem(keyname, datauri);
          task.list.call(null, [ t.id ]);
        })
        .call();
      };

      reader.readAsDataURL(file);

      $(this).replaceWith($(this).clone(true));

      return false;
    });

    return entangle()

    .pack('id')
    .pick().string('/t/{{id}}')
    .json('get')
    .pick('data')
    .fork([

          entangle().pick(function (id) { $el.attr('data-id', id); }),
          entangle().pick(function (___) {
            $el.data('t', ___);
          }),
          entangle().inject(entangle.data({ $el: $el.find('.view-title-text') })).pick().$text('{{title}}'),
          entangle().inject(entangle.data({ $el: $el.find('.view-description') })).pick().$text('{{description}}'),
          entangle().pick(function (___) {
            $el.find('.box-colorful').removeClass('box-color-blue box-color-green');
            $el.find('.view-answer .btn-group').addClass('hidden');
            $el.find('.view-review').text('');
            var a = _.find(___.a, function (a) { return a.id == window.user.id; });
            if (a) this.resolve(___, a);
          })
          .transform(function (t, a) {
            if (a.location) {
              $el.find('.view-answer .btn-group').removeClass('hidden');
              $el.find('.view-answer .btn-download').attr({
                href: localStorage.getItem(a.location),
                download: a.location.split('/').slice(-1)[0]
              });
              $el.find('.view-answer .btn-remove').off('click').click(function () {
                var t = $el.data('t');
                _.remove(t.a, function (x) { return x.id == a.id; });
                entangle()
                .data('/t/' + t.id, {
                  a: t.a
                })
                .json('post')
                .pick(function (status, data) {
                  localStorage.removeItem(a.location);
                  task.list.call(null, [ t.id ]);
                })
                .call();
              });
              $el.find('.box-colorful').addClass('box-color-blue');
            }
            if (a.review) {
              $el.find('.view-review').text(a.review);
              $el.find('.view-answer').addClass('hidden');
              $el.find('.box-colorful').removeClass('box-color-blue').addClass('box-color-green');
            } else {
              $el.find('.view-answer').removeClass('hidden');
            }
          }),
          entangle().pick(function (___) {
            if (!$('#review-view').hasClass('hidden')) {
              $el.find('.view-answer').addClass('hidden');
            }
          }),
          entangle().pick('created_at').date().transform(function (date) {
            $el.find('.view-created-at').text(date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate());
          }),
          entangle().pick(function (deleted) {
            $el.remove();
          }),

    ]);

  }),

});

task.route({
  init: 'list',
});

course.route({
  init: 'list',
  view: task.init,
});

course.setup();

