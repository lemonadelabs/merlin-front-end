import Ember from 'ember';
import processProjects from '../../business-logic/process-timeline-objects'
import DataSet from '../lemonade-chart/dataSet';
import Axes from '../lemonade-chart/axes';
import ChartParameters from '../lemonade-chart/chartParameters';
import truncateBigNumbers from '../../common/truncateBigNumbers';
import convertTime from '../../common/convert-time'


export default Ember.Component.extend({
  processProjects: processProjects,
  timelineGridObjects:undefined,
  graphData:undefined,
  investmentGraph:undefined,
  axes: {},
  axes1Width:undefined,
  axes2Width:undefined,
  init: function () {
    this._super();
    this.buildChart()
  },
  chartInlineStyle:Ember.computed('axes1Width','axes2Width', function () {
    let axes1Width = this.get('axes1Width');
    let axes2Width = this.get('axes2Width');
    let widthOffset = axes1Width + axes2Width
    return Ember.String.htmlSafe(`margin-left:-${axes1Width}px; width:calc(80vw + ${widthOffset}px)`)
  }),
  buildChart: function () {
    let ongoingCostColour = 'rgb(245, 166, 35)';
    let capitalisationColor = 'rgb(60, 255, 122)';
    let totalInvestmentColour = 'rgb(129, 65, 255)';
    let axisColour = 'rgb(255, 255, 255)';
    let graphData = this.processAndSortData();



    let totalInvestment = new DataSet('total investment', graphData.totalInvestment, totalInvestmentColour);
    let capitalisation = new DataSet('capitalisation', graphData.capitalisation, capitalisationColor);
    let ongoingCost = new DataSet('ongoing cost', graphData.ongoingCost, ongoingCostColour);
    let remainingFunds = new DataSet('remaining funds', graphData.remainingFunds, ongoingCostColour);

    capitalisation.setDashType('longDash')
    ongoingCost.setDashType('dotted')

    let xAxes = new Axes('', axisColour);
    xAxes.hideGridLines();
    xAxes.hideTicks();
    let yAxes1 = new Axes('', axisColour);
    yAxes1.prependToTickLabel('$');
    yAxes1.beginAtZero(false);
    yAxes1.customFormatting(truncateBigNumbers)
    let yAxes2 = new Axes('', axisColour);
    yAxes2.prependToTickLabel('$');
    yAxes2.beginAtZero(false);
    yAxes2.setPosition('right');
    yAxes2.hideGridLines();

    this.set('axes',{'xAxes': xAxes, 'yAxes1': yAxes1,'yAxes2': yAxes2})
    // let chartParameters = new ChartParameters( [totalInvestment, ongoingCost, capitalisation], graphData.labels, [xAxes], [yAxes1,yAxes2])
    let chartParameters = new ChartParameters( [totalInvestment, ongoingCost, remainingFunds], graphData.labels, [xAxes], [yAxes1,yAxes2])
    // let chartParameters = new ChartParameters( [totalInvestment, ongoingCost], graphData.labels, [xAxes], [yAxes1,yAxes2])
    this.set('investmentGraph', chartParameters)
  },
  didInsertElement(){
    Ember.run.next(this,function(){
      let axes = this.get('axes');
      this.set('axes1Width', axes.yAxes1.maxWidth);
      this.set('axes2Width', axes.yAxes2.maxWidth);
    })
  },

  processAndSortData(){
    var plan = this.get('plan')
    var processedData = this.processProjects({
      metadata : plan.metadata,
      projects : plan.projects
    })

    var sortedData = {}
    sortedData.labels = []
    var labelsNotMadeYet = true


    _.forEach(processedData, function (dataset, name) {
      sortedData[name] = []
      _.forEach(dataset, function (data, year) {
        _.forEach(data, function (expenditure, month) {
          sortedData[name].push( expenditure )

          if (labelsNotMadeYet) {
            if (month.length === 1) {month = '0' + String(month)}
            sortedData.labels.push( `${year}/${month}` )
          }
        })
      })
      labelsNotMadeYet = false
    })

    sortedData.totalInvestment = []

    _.forEach(sortedData.research, function (datum, i) { // add up total investment
      sortedData.totalInvestment.push(datum)
      sortedData.totalInvestment[i] += sortedData.dev[i]
    })

    _.forEach(sortedData, function (dataset) { // add a value on to the begining of the dataset, for layout reasons
      dataset.unshift(0)
    })
    sortedData.remainingFunds[0] = 50000000

    return sortedData;
  },

  dothings: function () {
    var self = this
    var serviceModels = this.get('serviceModels')
    var serviceModel = serviceModels[0]
    var serviceModelChildren = this.findChildrenForServiceModel({ serviceModel : serviceModel })
    var attributesForChildren = this.findAttributesFromEntities({ entities : serviceModelChildren })

    var testAttribute = attributesForChildren[0]
    var childrenWithAttribute = this.filterEntitiesByAttribute({
      entities : serviceModelChildren,
      attribute : testAttribute
    })

    var testEntity = childrenWithAttribute[0]
    var processProperties = this.processPropertiesFromEntity({ entity : testEntity })

    var quarterFormat = convertTime("2016-01-01").toQuarter()
    console.log(convertTime(quarterFormat).quarterToBackend())


  }.on('init'),


  processPropertiesFromEntity: function (opts) {
    var entity = opts.entity
    var processProperties = _.map(entity.processes, function (process) {
      return process.properties
    })
    processProperties = _.flatten(processProperties)
    return processProperties
  },

  filterEntitiesByAttribute: function (opts) {
    var attribute = opts.attribute
    var entities = opts.entities

    var filteredEntities = _.filter( entities, function (entity) {
      return _.includes(entity.attributes, attribute)
    })
    return filteredEntities
  },

  findAttributesFromEntities: function (opts) {
    var entities = opts.entities
    var attributes = []
    _.forEach(entities, function (entity) {
      attributes.push(entity.attributes)
    })
    attributes = _.uniq( ( _.flatten( attributes ) ) )
    return attributes
  },


  findChildrenForServiceModel: function (opts) {
    var serviceModel = opts.serviceModel
    var childrenUrls = serviceModel.children
    var ids = _.map(childrenUrls, this.getIdFromUrl)
    var simulation = this.get('simulation')
    var childEntities = _.filter(simulation.entities, function (entity) {
      return _.includes(ids, String(entity.id))
    })
    return childEntities
  },

  getIdFromUrl: function (url) {
    var slashless = url.slice(0, -1)
    var id = slashless.substring(slashless.lastIndexOf('/') + 1, slashless.length)
    return id
  },

  setParentEntity: function () {
    var simulation = this.get('simulation')
    var parentEntity = _.find(simulation.entities, function (entity) {
      return entity.parent === null
    })
    this.set('parentEntity', parentEntity)
  }.on('init'),


  setServiceModels: function () {
    var self = this
    var serviceModels = []
    var simulation = this.get('simulation')
    var parentEntity = this.get('parentEntity')
    _.forEach(parentEntity.children, function (childUrl) {
      var childId = self.getIdFromUrl(childUrl)
      var serviceModel = _.find(simulation.entities, function (entity) {
        return entity.id == childId
      })
      serviceModels.push(serviceModel)
    })
    this.set('serviceModels', serviceModels)
  }.observes('parentEntity'),




  actions:{
    recalculateInvestments:function(){
      let processedData = this.processAndSortData(),
          investmentGraph = this.get('investmentGraph'),
          dataSetIndex = {
            'totalInvestment' : 0,
            'ongoingCost' : 1,
            // 'capitalisation' : 2
            'remainingFunds' : 2
          }
      _.forEach(processedData, function(value, key){
        let index = dataSetIndex[key];
        if(index !== undefined){
          Ember.set(investmentGraph.data.datasets, `${index}.data`, value);
        }
      });

    }
  }
});
