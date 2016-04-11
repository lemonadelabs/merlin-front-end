import Ember from 'ember';

export default Ember.Component.extend({
  type: 'bar',
  data: {
    labels: ["Red", "Blue", "Yellow", "Green", "Purple", "Orange"],
    datasets: [{
        label: '# of Votes',
        data: [12, 19, 3, 5, 2, 3]
    }]
  },
  options: {
      scales: {
          yAxes: [{
              ticks: {
                  beginAtZero:true
              }
          }]
      }
  },
  chart:undefined,
  didInsertElement:function(){
    var ctx = document.getElementById("myChart");
    console.log('inserting graph');
    var type = this.get('type');
    var data = this.get('data');
    var options = this.get('options');
    this.set('chart', new Chart(ctx, {type, data, options}))
  }
});
