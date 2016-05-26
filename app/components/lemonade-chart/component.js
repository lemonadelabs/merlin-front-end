import Ember from 'ember';

export default Ember.Component.extend({
  classNames : ['lemonade-chart'],
  chart : undefined,
  currentChartId : undefined,
  attributeBindings: ['style'],
  didInsertElement(){
    Ember.run.next(this,function(){
      if(this.get('data') && this.get('options')){
          this.setUpDefaultValues();
          this.buildChart();
        }
    })
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
    globalChartOptions.maintainAspectRatio = false;
    globalChartOptions.responsive = true
  },
  buildChart(){
    if(!this.get('data') && !this.get('options')){
      console.warn('no options or data on start up');
      return;
    }
    var ctx = this.element.getElementsByTagName("canvas")[0];
    var type = this.get('type');
    var data = this.get('data');
    var options = this.get('options');
    var oldChart = this.get('chart')

    if(oldChart){
      oldChart.destroy()
      let chart = new Chart(ctx, {type, data, options});
      this.set('chart', chart)
      this.get('chart').render(300, true);
    }else{
      let chart = new Chart(ctx, {type, data, options});
      this.set('chart', chart)
    }
  },
  observeDataChange: function(){
    var datasets = this.get('data.datasets');
    if(datasets === undefined){
      console.warn('datasets undefined')
      return;
    }

    var datasetsLastIndex = datasets.length - 1;
    var chart = this.get('chart');
    if (this.get('data.labels') && this.get(`data.datasets.${datasetsLastIndex}.data`)) {
      let datasets = this.get('data.datasets');
      let currentDataSetLabels = []
      _.forEach(datasets,function(v){
        currentDataSetLabels.push(v.label);
      })
      let previousDataSetLabels = this.get('previousDataSetLabels') || currentDataSetLabels
      let sameDatasetCollection = _.isEqual(currentDataSetLabels, previousDataSetLabels)
      if(!sameDatasetCollection){
        this.buildChart()
      }
      this.set('previousDataSetLabels',currentDataSetLabels)

      if(!chart){
        this.setUpDefaultValues();
        this.buildChart()
      }
      else if (sameDatasetCollection){
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
