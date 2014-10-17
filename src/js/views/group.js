define(['backbone', 'views/detail', 'jst'], function(Backbone, Detail, JST) {

  var Group = Backbone.View.extend({
    initialize: function(options) {
      this.race = options.race;
      this.group = options.group;

      this.collection.on('change', this.render, this);
    },

    close: function() {
      this.remove();
      this.off();
      this.collection.off('change', this.render, this);
    },

    template: JST.group,

    render: function() {
      var links = [];
      var active;
      if(this.race !== null) {
        active = this.collection.get(this.race);
      }
      this.collection.each(function(race) {
        if(race.get('group') === this.group) {
          if(typeof active === "undefined") {
            active = this.collection.get(race);
          }
          links.push({
            active: race.get('sheet') === this.race || race.get('sheet') === active.get('sheet'),
            url: '#/group/' + this.group + '/' + race.get('sheet'),
            race: race.get('race'),
            subtitle: race.get('subtitle')
          });
        }
      }, this);
      var data = {
        active: active.attributes,
        links: links
      };
      this.$el.html(this.template(data));
      active.unset('active', {silent: true});
      return this;
    }

  });

  return Group;

});
