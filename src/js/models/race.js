define(['backbone'], function(Backbone) {

  var Race = Backbone.Model.extend({
    idAttribute: 'sheet',

    defaults: {
      'type': 'bars'
    }
  });

  return Race;

});
