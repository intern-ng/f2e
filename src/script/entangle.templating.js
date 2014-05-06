/**
 * Entangle - Templating Toolkit
 */

entangle.extend({

  /**
   * @name string
   * @desc simple string templating
   */
  string: function (text) {
    var options = { interpolate: /{{([\s\S]+?)}}/g };
    var capture = [], match;
    while (!!(match = options.interpolate.exec(text))) {
      capture.push(match[1]);
    }
    if (capture.length) {
      var converter = entangle.template(text, options);
      converter.capture = converter.capture.concat(capture);
      return converter;
    } else {
      return entangle.data(text);
    }
  },

  /**
   * @name template
   * @desc lodash templating
   */
  template: function (text, options) {
    var compiled = text && _.template(text, null, options);
    return _.extend(function (text, data) {
      return this.resolve(
        compiled ?
        compiled(data) :
        _.template(text, data, options)
      );
    }, {
      capture: compiled ? [ '___', '___' ] : [ 'text', '___' ]
    });
  },

});

