define(['backbone', 'jst'], function(Backbone, JST) {

  var Detail = Backbone.View.extend({
    initialize: function() {
      this.model.on('change', this.render, this);
    },

    close: function(e) {
      this.remove();
      this.off();
      this.model.off('change', this.render, this);
    },

    template: JST.detail,

    render: function() {
      this.$el.html(this.template(this.model.toJSON()));
      return this;
    }
  });

  return Detail;

});
