
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

