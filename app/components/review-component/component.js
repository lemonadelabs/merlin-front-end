import Ember from 'ember';
import DataSet from '../lemonade-chart/dataSet';
import Axes from '../lemonade-chart/axes';
import ChartParameters from '../lemonade-chart/chartParameters';

export default Ember.Component.extend({
  classNames : ['review-component'],
  graphData : {},
  graphs : [],
  cards : [],
  init(){
    this._super();
    this.initCharts();
    this.createCards();
  },
  initCharts(){
    this.generateGraphData();
  },
  newGraph(graphColours, GraphData, lineTypes, yAxesName){
    let axisColour = 'rgb(255, 255, 255)',
        labels = this.generateYearLabels(GraphData[0].length),
        dataSets = []

    _.forEach(GraphData, function(value, i) {
      let data = value.data;
      let dataSet = new DataSet(value.name, data, graphColours[i]);
      if (lineTypes && lineTypes[i] !== 'solid') {
        dataSet.setDashType(lineTypes[i])
      }
      dataSets.push(dataSet);
    })
    let xAxes = new Axes('Years', axisColour);
    let yAxes = new Axes(yAxesName, axisColour);
    let chartParameters = new ChartParameters( dataSets, labels, [xAxes], [yAxes])
    // chartParameters.name = value.name

    return chartParameters;
  },
  createCards(){
    this.set('cards', []);
    this.createFinanceCard();
    this.createStaffCard();
    this.createOutputCard();
  },
  createFinanceCard(){
    let expences = this.get('graphData.expences');
    let revenue = this.get('graphData.revenue');
    let surplus = this.get('graphData.surplus');

    let financeCard = {};
    financeCard.name = "Finance";
    financeCard.graph = this.newGraph(
      [
        'rgb(126, 211, 33)',
        'rgb(126, 211, 33)',
        'rgb(126, 211, 33)'
      ],
      [
        {
          name: 'Expences',
          data: expences
        },
        {
          name: 'Revenue',
          data: revenue
        },
        {
          name: 'Surplus',
          data: surplus
        }
      ],
      [
        'shortDash',
        'solid',
        'dotted',
      ]);
    financeCard.filterCategories = ['Revenue', 'Expences', 'Surplus']
    this.get('cards').push(financeCard)
  },
  createStaffCard(){
    //Utilisation needs to be on another axis
    let staffCard = {};
    let lineStaffData = this.get('graphData.lineStaff');
    let OhStaffData = this.get('graphData.OhStaff');
    let staffUtilisationData = this.get('graphData.staffUtilisation');

    staffCard.name = "Staff";
    staffCard.graph = this.newGraph(
      [
        'rgb(74, 144, 226)',
        'rgb(74, 144, 226)',
        'rgb(74, 144, 226)'
      ],
      [
        {name: 'Line Staff', data:lineStaffData},
        {name: 'Overhead Staff', data:OhStaffData},
        {name: 'Utilisation', data:staffUtilisationData}
      ],
      [
        'solid',
        'longDash',
        'dotted'
      ]
    );
    staffCard.filterCategories = ['Staff Numbers', 'Utilisation']

    this.get('cards').push(staffCard)
  },
  createOutputCard(){
    let outputCard = {};
    let graphData = this.get('graphData.outputs');
    outputCard.name = "Outputs";
    outputCard.graph = this.newGraph(['rgb(245, 166, 35)'], [{name: 'Outputs', data:graphData}]);
    outputCard.filterCategories = ['Indexed Outputs','Service Level']
    this.get('cards').push(outputCard)
  },
  generateGraphData(){
    // console.log('yo');
    this.set('graphData.outputs',[])
    for (let i = 0; i < 10; i++) {
      let rando = Math.random()*100;
      this.get('graphData.outputs').push(rando);
    }
    this.set('graphData.revenue',[])
    for (let i = 0; i < 10; i++) {
      let rando = Math.random()*100;
      this.get('graphData.revenue').push(rando);
    }
    this.set('graphData.expences',[])
    for (let i = 0; i < 10; i++) {
      let rando = Math.random()*100;
      this.get('graphData.expences').push(rando);
    }
    this.set('graphData.surplus',[])
    for (let i = 0; i < 10; i++) {
      let rando = Math.random()*100;
      this.get('graphData.surplus').push(rando);
    }
    this.set('graphData.lineStaff',[])
    for (let i = 0; i < 10; i++) {
      let rando = Math.random()*10;
      this.get('graphData.lineStaff').push(rando);
    }
    this.set('graphData.OhStaff',[])
    for (let i = 0; i < 10; i++) {
      let rando = Math.random()*5;
      this.get('graphData.OhStaff').push(rando);
    }

    this.set('graphData.staffUtilisation',[])
    for (let i = 0; i < 10; i++) {
      let rando = Math.random()*10;
      this.get('graphData.staffUtilisation').push(rando);
    }
  },
  generateYearLabels:function(){
    let resultLabels = [];
    const startYear = 2016;
    for (let i = 0; i < 10; i++) {
      let year = startYear + i;
      let fYear = year - 1999;
      let label = `${year}/${fYear}`;

      resultLabels.push(label)
    }
    return resultLabels
  }
});
