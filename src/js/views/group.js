define(['backbone', 'views/detail', 'jst'], function(Backbone, Detail, JST) {

  var Group = Backbone.View.extend({
    initialize: function(options) {
      this.active = options.active;

      this.collection.on('change', this.render, this);
    },

    close: function() {
      this.remove();
      this.off();
      this.collection.off('change', this.render, this);
    },

    template: JST.group,

    render: function() {
      var active;
      if(this.active === null) {
        active = this.collection.at(0);
      }
      else {
        active = this.collection.get(this.active);
      }
      active.set('active', true, {silent: true});
      var data = {
        races: this.collection.models,
        active: active.attributes
      };
      this.el = this.template(data);
      active.unset('active', {silent: true});
      return this.el;
    }

  });

  return Group;

});
