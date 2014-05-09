
var help = new entangle.Application();

help.extend({

  init: entangle()

  .data('/faq')
  .http('get')
  .pick(function (status, data) {
    if (status == 200) $('.editor').html(data);
  })

});

help.setup();

entangle()
.$('#save')
.$on('click', { preventDefault: true })
.spec('object', 'object')
.data({ url: '/faq' })
.inject(entangle().$('.editor').$html().$pack('html'))
.pick('url', 'html')
.http('post')
.pick(function (status) {
  if (status == 200) alert('保存成功');
  else alert('保存失败');
})
.call();

// config
var options = {
  editor: document.querySelector('[data-toggle="pen"]'),
  debug: true
};

var pen = new Pen(options);


// toggle editor mode
document.querySelector('#mode').addEventListener('click', function() {
  var text = this.textContent;

  if(this.classList.contains('off')) {
    this.classList.remove('off');
    pen.rebuild();
  } else {
    this.classList.add('off');
    pen.destroy();
  }
});

// toggle editor mode
document.querySelector('#hinted').addEventListener('click', function() {
  var pen = document.querySelector('.pen');

  if(pen.classList.contains('hinted')) {
    pen.classList.remove('hinted');
    this.classList.add('off');
  } else {
    pen.classList.add('hinted');
    this.classList.remove('off');
  }
});

