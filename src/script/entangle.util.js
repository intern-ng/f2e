//////////////////////////
// Entangle Utility Kit //
//////////////////////////

var eukit = {};

_.extend(eukit, {

  io: {}

});

_.extend(eukit, {

  cache: function (cache, data) {
    if (data instanceof Object) {
      return {
        changed: _.any(data, function (v, k) {
          return !(cache && cache.hasOwnProperty(k) && _.isEqual(cache[k], v));
        }),
        data: _.extend(cache || data, data)
      };
    } else if (data) {
      return { changed: cache != data, data: data };
    } else {
      return { changed: false, data: cache };
    }
  },

});

////////
// IO //
////////

_.extend(eukit.io, {


});


