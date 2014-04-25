/**
 * Entangle - I/O Toolkit
 */

entangle.extend({

  /**
   * @name data
   * @desc resolves static data
   */
  data: function () { // {{{
    var data = array(arguments);
    return function () {
      fapply(this.resolve, this, data);
    };
  }, // }}} data

});

