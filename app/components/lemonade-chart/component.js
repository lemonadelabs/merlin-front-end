import Ember from 'ember';

export default Ember.Component.extend({
  chart:undefined,
  didInsertElement(){
    this.setUpDefaultValues();
    this.buildChart();
  },
  setUpDefaultValues(){
    //Get the font properties of body so that we can apply it to our chart
    var body = document.body;
    var fontFamily = window.getComputedStyle(body, null).getPropertyValue('font-family');

    var globalChartOptions = Chart.defaults.global;
    globalChartOptions.defaultFontFamily = fontFamily;
    globalChartOptions.defaultFontColor = 'white';
    globalChartOptions.defaultColor = 'rgba(255,255,255,0.1)'
    //Built in legend sucks so lets hide it
    globalChartOptions.legend.display = false
  },
  buildChart(){
    var ctx = document.getElementsByTagName("canvas")[0];
    var type = this.get('type');
    var data = this.get('data');
    var options = this.get('options');
    var chart = new Chart(ctx, {type, data, options});
    this.set('chart', chart)
  }
});
