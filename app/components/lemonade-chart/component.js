import Ember from 'ember';

export default Ember.Component.extend({
  classNames : ['lemonade-chart'],
  chart : undefined,
  currentChartId : undefined,
  attributeBindings: ['style'],
  willInsertElement(){
    this.setUpDefaultValues();

  },
  didInsertElement(){
    if(this.get('data') && this.get('options')){
        this.buildChart();
    }
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
    var ctx = this.element.getElementsByTagName("canvas")[0],
        type = this.get('type'),
        data = _.cloneDeep(this.get('data')),
        options = _.cloneDeep(this.get('options'));


    this.set('localData', data)
    this.set('localOptions', options)

    let chart = new Chart(ctx, {type, data, options});
    this.set('chart', chart)
  },
  rebuildChart(){
    var ctx = this.element.getElementsByTagName("canvas")[0],
    type = this.get('type'),
    data = _.cloneDeep(this.get('data')),
    options = _.cloneDeep(this.get('options')),
    oldChart = this.get('chart')

    oldChart.destroy()
    let chart = new Chart(ctx, {type, data, options});
    chart.render(300, true);
    this.set('chart', chart)
  },
  observeDatasetChange: function(){
    var datasets = this.get('data.datasets');

    if(datasets === undefined){
      console.warn('datasets undefined')
      return;
    }
    this.handleDatasetChange(datasets)
  }.observes('data.datasets'),
  observeDataChange: function(){
    var chart = this.get('chart'),
        datasets = this.get('data.datasets'),
        sameDatasetCollection = this.checkForNewDataset(datasets);

    if(sameDatasetCollection && chart && datasets){
      this.handleDataUpdate(chart, datasets)
    }
  }.observes('data.datasets.@each.data'),
  handleDataUpdate(chart, datasets){
    var localDatasets = this.get('localData.datasets');

    _.forEach(localDatasets,function(v,i){
      v.data = datasets[i].data
    })
    chart.update()
  },
  handleDatasetChange(datasets){
    var datasetsLastIndex = datasets.length - 1;
    if (this.get('data.labels') && this.get(`data.datasets.${datasetsLastIndex}.data`)) {
      let sameDatasetCollection = this.checkForNewDataset(datasets),
          chart = this.get('chart');

      if(!chart){
        this.setUpDefaultValues();
        this.buildChart()
        return
      }

      if(!sameDatasetCollection){
        this.rebuildChart()
      }
      else{
        this.handleDataUpdate(chart, datasets)
      }
    }
  },
  checkForNewDataset(datasets){
    let currentDataSetLabels = []
    _.forEach(datasets,function(v){
      currentDataSetLabels.push(v.label);
    })

    let previousDataSetLabels = this.get('previousDataSetLabels') || currentDataSetLabels
    this.set('previousDataSetLabels',currentDataSetLabels)

    return _.isEqual(currentDataSetLabels, previousDataSetLabels)
  },
  actions:{
    toggleDataSet: function(dataset){
      var hide = Ember.get(dataset, 'hidden') ? false : true
      Ember.set(dataset, 'hidden', hide)
      this.get('chart').update()
    }
  }
});
