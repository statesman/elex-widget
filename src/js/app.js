require(['backbone', 'jst'], function(Backbone, JST) {
  var results = [
    {
      'race': 'Governor',
      'reporting': 32,
      'candidates': [
        {
          'name': 'Greg Abbott',
          'shortName': 'Abbott',
          'count': 854341,
          'party': 'rep',
          'percent': 60
        },
        {
          'name': 'Wendy Davis',
          'shortName': 'Davis',
          'count': 253521,
          'party': 'dem',
          'percent': 40
        }
      ]
    },
    {
      'race': 'Lt. Gov',
      'reporting': 32,
      'candidates': [
        {
          'name': 'Dan Patrick',
          'shortName': 'Patrick',
          'count': 531413,
          'party': 'rep',
          'percent': 55
        },
        {
          'name': 'Leticia Van de Putte',
          'shortName': 'Van de Putte',
          'count': 253521,
          'party': 'dem',
          'percent': 45
        }
      ]
    },
    {
      'race': 'Rail bond',
      'reporting': 41,
      'type': 'yesno',
      'candidates': [
        {
          'name': 'Yes',
          'shortName': 'Yes',
          'count': 531413,
          'percent': 55
        },
        {
          'name': 'No',
          'shortName': 'No',
          'count': 253521,
          'percent': 45
        }
      ]
    },
    {
      'race': 'Mayor',
      'reporting': 54,
      'candidates': [
        {
          'name': 'Dan Patrick',
          'shortName': 'Patrick',
          'count': 843286,
          'percent': 51
        },
        {
          'name': 'Dan Patrick',
          'shortName': 'Patrick',
          'count': 243286,
          'percent': 49
        }
      ]
    },
    {
      'race': 'City council',
      'reporting': 12,
      'type': 'grid',
      'candidates': [
        {
          'name': '1',
          'shortName': '1',
          'count': 843286,
          'percent': 51
        },
        {
          'name': '2',
          'shortName': '2',
          'count': 843286,
          'percent': 51
        },
        {
          'name': '3',
          'shortName': '3',
          'count': 843286,
          'percent': 51
        },
        {
          'name': '4',
          'shortName': '4',
          'count': 843286,
          'percent': 51
        },
        {
          'name': '5',
          'shortName': '5',
          'count': 843286,
          'percent': 51
        },
        {
          'name': '6',
          'shortName': '6',
          'count': 843286,
          'percent': 51
        },
        {
          'name': '7',
          'shortName': '7',
          'count': 843286,
          'percent': 51
        },
        {
          'name': '8',
          'shortName': '8',
          'count': 843286,
          'percent': 51
        },
        {
          'name': '9',
          'shortName': '9',
          'count': 843286,
          'percent': 51
        },
        {
          'name': '10',
          'shortName': '10',
          'count': 843286,
          'percent': 51
        },
        {
          'name': '11',
          'shortName': '11',
          'count': 843286,
          'percent': 51
        }
      ]
    }
  ];

  var Race = Backbone.Model.extend({
    initialize: function() {
      console.log('initializing model');
    },

    defaults: {
      'type': 'bars'
    }
  });

  var Election = Backbone.Collection.extend({
    initialize: function() {
      console.log('initializing collection');
    },

    model: Race
  });

  var RaceView = Backbone.View.extend({
    template: function(data) {
      return JST[this.model.get('type')](data);
    },

    render: function() {
      this.el = this.template(this.model.toJSON());
      return this;
    }
  });

  var ElectionView = Backbone.View.extend({
    renderSingle: function(model) {
      var raceview = new RaceView({model: model});
      this.$el.append(raceview.render().el);
    },

    render: function() {
      _.each(this.collection.models, this.renderSingle, this);
      return this;
    }
  });

  $(function() {

    var election = new Election();
    election.reset(results);

    var electionview = new ElectionView({collection: election, el: '#elex-widget'});
    electionview.render();

  });

});
