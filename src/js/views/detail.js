define(['backbone', 'jst', 'modules/window'], function(Backbone, JST, win) {

  var Detail = Backbone.View.extend({
    initialize: function() {
      this.model.on('change', this.render, this);
    },

    template: JST.detail,

    render: function() {
      this.$el.html(this.template(this.model.toJSON()));
      win.sendHeight();
    }
  });

  return Detail;

});
