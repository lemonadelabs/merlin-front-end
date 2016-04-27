import Ember from 'ember';

export default Ember.Component.extend({
  classNames : ['lemonade-chart-container'],
  chart : undefined,
  attributeBindings: ['style'],
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
    //Built in legend sucks so lets hide it and build it in the template
    globalChartOptions.legend.display = false
    //disable line tension because it causes issues with readability
    globalChartOptions.elements.line.tension = 0.01
    //Tooltip settings
    //globalChartOptions.tooltips
  },
  buildChart(){
    var ctx = this.element.getElementsByTagName("canvas")[0];
    var type = this.get('type');
    var data = this.get('data');

    var options = this.get('options');
    var chart = new Chart(ctx, {type, data, options});
    this.set('chart', chart)
  },
  observeDataChange: function(){
    var datasets = this.get('data.datasets');
    var datasetsLastIndex = datasets.length - 1;
    var chart = this.get('chart');
    chart.update()
    if (this.get('data.labels') && this.get(`data.datasets.${datasetsLastIndex}.data`)) {
      if(!chart){
        this.buildChart()
      }
      else{
        chart.update()
      }
    }
  }.observes('data.labels','data.datasets','data.datasets.@each.data'),
  actions:{
    toggleDataSet: function(dataset){
      var hide = Ember.get(dataset, 'hidden') ? false : true
      Ember.set(dataset, 'hidden', hide)
      this.get('chart').update()
    }
  }
});
