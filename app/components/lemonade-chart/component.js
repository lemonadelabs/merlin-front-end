import Ember from 'ember';


export default Ember.Component.extend({
  classNames : ['lemonade-chart'],
  chart : undefined,
  currentChartId : undefined,
  attributeBindings: ['style'],
  init(){
    this._super()
    this.setUpDefaultValues();
  },
  didInsertElement(){
    if(this.get('data') && this.get('options')){
        Ember.run.next(this, this.buildChart)
    }
  },
  didUpdateAttrs(){
    var chart = this.get('chart'),
        datasets = this.get('data.datasets'),
        previousDatasetLabels =this.get('previousDataSetLabels'),
        datasetStatus = this.checkForNewDataset(datasets, previousDatasetLabels);

    if(!chart){
      this.buildChart()
      return
    }

    if(!datasetStatus.dataSetSame){
      this.rebuildChart()
      this.set('previousDataSetLabels', datasetStatus.currentDataSetLabels)
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
    //Resize settings
    globalChartOptions.maintainAspectRatio = false;
    globalChartOptions.responsive = true
    //Tooltips
  },
  buildChart(){
    if(!this.get('data') && !this.get('options')){
      console.warn('no options or data on start up');
      return;
    }
    var canvasElement = this.element.getElementsByTagName("canvas")[0],
        type = this.get('type'),
        data = _.cloneDeep(this.get('data')),
        options = _.cloneDeep(this.get('options'));


    this.set('localData', data)
    this.set('localOptions', options)
    this.set('canvasElement', canvasElement)

    let chart = new Chart(canvasElement, {type, data, options});
    this.set('chart', chart)
  },
  rebuildChart(){
    var canvasElement = this.get('canvasElement') || this.element.getElementsByTagName("canvas")[0],
        type = this.get('type'),
        data = _.cloneDeep(this.get('data')),
        options = _.cloneDeep(this.get('options')),
        oldChart = this.get('chart')

    this.set('localData', data)
    this.set('localOptions', options)

    oldChart.destroy()
    let chart = new Chart(canvasElement, {type, data, options});
    this.set('chart', chart)
  },
  observeDataChange: function(){
    var chart = this.get('chart'),
        datasets = this.get('data.datasets'),
        previousDatasetLabels =this.get('previousDataSetLabels'),
        datasetStatus = this.checkForNewDataset(datasets, previousDatasetLabels);

    if(chart && datasetStatus.dataSetSame){
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
  checkForNewDataset(datasets, previousDatasetLabels){
    let currentDataSetLabels = []
    _.forEach(datasets,function(v){
      currentDataSetLabels.push(v.label);
    })
    let previousDataSetLabels = previousDatasetLabels || []
    return {
            'dataSetSame':_.isEqual(currentDataSetLabels, previousDataSetLabels),
            'currentDataSetLabels':currentDataSetLabels
    }
  },
  actions:{
    toggleDataSet: function(dataset){
      var hide = Ember.get(dataset, 'hidden') ? false : true
      Ember.set(dataset, 'hidden', hide)
      this.get('chart').update()
    }
  }
});
