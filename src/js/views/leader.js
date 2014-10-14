define(['backbone', 'jst'], function(Backbone, JST) {

  var Leader = Backbone.View.extend({
    template: function(data) {
      return JST[this.model.get('type')](data);
    },

    render: function() {
      this.el = this.template(this.model.toJSON());
      return this;
    }
  });

  return Leader;

});
