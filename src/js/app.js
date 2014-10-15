require(['collections/election', 'views/overview', 'jquery', 'pym'], function(Election, Overview, $, pym) {

  var pymChild = new pym.Child();

  $(function() {

    var election = new Election();
    var overview = new Overview({collection: election, el: '#elex-widget'});

    election.fetch({
      success: function() {
        overview.render();
        pymChild.sendHeight();
      }
    });

    setInterval(function() {
      election.fetch();
    }, 5000);


  });

});
