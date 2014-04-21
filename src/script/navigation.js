////////////////
// Navigation //
////////////////

entangle().location().capture(function (pathname) {
  $('.navbar-collapse a[href="' + pathname + '"]').parent().addClass('active');
}).call();

