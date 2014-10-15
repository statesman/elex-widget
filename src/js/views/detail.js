define(['backbone', 'jst'], function(Backbone, JST) {

  var Detail = Backbone.View.extend({
    template: JST.detail,

    render: function() {
      this.$el.html(this.template(this.model.toJSON()));
    }
  });

  return Detail;

});
