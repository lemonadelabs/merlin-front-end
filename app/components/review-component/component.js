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
    let revenueBudgeted = this.get('graphData.revenueBudgeted');
    let revenuePlanned = this.get('graphData.revenuePlanned');

    let expencesBudgeted = this.get('graphData.expencesBudgeted');
    let expencesPlanned = this.get('graphData.expencesPlanned');

    let surplusBudgeted = this.get('graphData.surplusBudgeted');
    let surplusPlanned = this.get('graphData.surplusPlanned');

    let financeCard = {};
    financeCard.name = "Finance";
    financeCard.graphs = {};
    financeCard.graphs["Revenue"] = this.newGraph(
      [
        'rgb(126, 211, 33)',
        'rgb(126, 211, 33)',
      ],
      [
        {
          name: 'Revenue Budgeted',
          data: revenueBudgeted
        },
        {
          name: 'Revenue Planned',
          data: revenuePlanned
        }
      ],
      [
        'solid',
        'dotted',
      ]);

    financeCard.graphs["Expences"] = this.newGraph(
      [
        'rgb(126, 211, 33)',
        'rgb(126, 211, 33)',
      ],
      [
        {
          name: 'Expences Budgeted',
          data: expencesBudgeted
        },
        {
          name: 'Expences Planned',
          data: expencesPlanned
        }
      ],
      [
        'solid',
        'dotted',
      ]);

    financeCard.graphs["Surplus"] = this.newGraph(
      [
        'rgb(126, 211, 33)',
        'rgb(126, 211, 33)',
      ],
      [
        {
          name: 'Surplus Budgeted',
          data: surplusBudgeted
        },
        {
          name: 'Surplus Planned',
          data: surplusPlanned
        }
      ],
      [
        'solid',
        'dotted',
      ]);
    financeCard.filterCategories = ['Revenue', 'Expences', 'Surplus']
    this.get('cards').push(financeCard)
  },
  createStaffCard(){
    //Utilisation needs to be on another axis
    let staffCard = {};
    let lineStaffBudgeted = this.get('graphData.lineStaffBudgeted');
    let OhStaffBudgeted = this.get('graphData.OhStaffBudgeted');

    let lineStaffPlanned = this.get('graphData.lineStaffPlanned');
    let OhStaffPlanned = this.get('graphData.OhStaffPlanned');

    let staffUtilisationBudgeted = this.get('graphData.staffUtilisationBudgeted');
    let staffUtilisationPlanned = this.get('graphData.staffUtilisationPlanned');


    staffCard.name = "Staff";
    staffCard.graphs = {};
    staffCard.graphs["Staff Numbers"] = this.newGraph(
      [
        'rgb(74, 144, 226)',
        'rgb(74, 217, 226)',
        'rgb(74, 144, 226)',
        'rgb(74, 217, 226)',

      ],
      [
        {name: 'Line Staff Budgeted', data:lineStaffBudgeted},
        {name: 'Overhead Staff Budgeted', data:OhStaffBudgeted},
        {name: 'Line Staff Planned', data:lineStaffPlanned},
        {name: 'Overhead Staff Planned', data:OhStaffPlanned},
      ],
      [
        'solid',
        'solid',
        'dotted',
        'dotted'
      ]
    );

    staffCard.graphs["Utilisation"] = this.newGraph(
      [
        'rgb(74, 144, 226)',
        'rgb(74, 144, 226)',
      ],
      [
        {name: 'Utilisation Budgeted', data:staffUtilisationBudgeted},
        {name: 'Utilisation Planned', data:staffUtilisationPlanned}

      ],
      [
        'solid',
        'dotted'
      ]
    );

    staffCard.filterCategories = ['Staff Numbers', 'Utilisation']

    this.get('cards').push(staffCard)
  },
  createOutputCard(){
    let outputCard = {};
    let outputsPlanned = this.get('graphData.outputsPlanned');
    let outputsBudgeted = this.get('graphData.outputsBudgeted');

    outputCard.name = "Outputs";
    outputCard.graphs = {};
    outputCard.graphs["Indexed Outputs"] = this.newGraph(
      [
        'rgb(245, 166, 35)',
        'rgb(245, 166, 35)'
      ],
      [
        {name: 'Outputs', data:outputsPlanned},
        {name: 'Outputs', data:outputsBudgeted}
      ],
      [
        'solid',
        'dotted'
      ]
    );
    outputCard.filterCategories = ['Indexed Outputs','Service Level']
    this.get('cards').push(outputCard)
  },
  generateGraphData(){
    this.generateOutputData()
    this.generateStaffData()
    this.generateFinancialData();

  },
  generateOutputData(){
    //Planned (from the projects senarios)
    this.set('graphData.outputsPlanned',[])
    for (let i = 0; i < 10; i++) {
      let rando = Math.random()*100;
      this.get('graphData.outputsPlanned').push(rando);
    }

    //Budgeted (from the 'baseline' senarios)
    this.set('graphData.outputsBudgeted',[])
    for (let i = 0; i < 10; i++) {
      let rando = Math.random()*100;
      this.get('graphData.outputsBudgeted').push(rando);
    }
  },
  generateStaffData(){
    //Planned (from the projects senarios)
    this.set('graphData.lineStaffPlanned',[])
    for (let i = 0; i < 10; i++) {
      let rando = Math.random()*10;
      this.get('graphData.lineStaffPlanned').push(rando);
    }
    this.set('graphData.OhStaffPlanned',[])
    for (let i = 0; i < 10; i++) {
      let rando = Math.random()*5;
      this.get('graphData.OhStaffPlanned').push(rando);
    }

    this.set('graphData.staffUtilisationPlanned',[])
    for (let i = 0; i < 10; i++) {
      let rando = Math.random()*10;
      this.get('graphData.staffUtilisationPlanned').push(rando);
    }

    //Budgeted (from the 'baseline' senarios)
    this.set('graphData.lineStaffBudgeted',[])
    for (let i = 0; i < 10; i++) {
      let rando = Math.random()*10;
      this.get('graphData.lineStaffBudgeted').push(rando);
    }
    this.set('graphData.OhStaffBudgeted',[])
    for (let i = 0; i < 10; i++) {
      let rando = Math.random()*5;
      this.get('graphData.OhStaffBudgeted').push(rando);
    }

    this.set('graphData.staffUtilisationBudgeted',[])
    for (let i = 0; i < 10; i++) {
      let rando = Math.random()*10;
      this.get('graphData.staffUtilisationBudgeted').push(rando);
    }
  },
  generateFinancialData(){
    //Planned (from the projects senarios)
    this.set('graphData.revenuePlanned',[])
    for (let i = 0; i < 10; i++) {
      let rando = Math.random()*100;
      this.get('graphData.revenuePlanned').push(rando);
    }

    this.set('graphData.expencesPlanned',[])
    for (let i = 0; i < 10; i++) {
      let rando = Math.random()*100;
      this.get('graphData.expencesPlanned').push(rando);
    }

    this.set('graphData.surplusPlanned',[])
    for (let i = 0; i < 10; i++) {
      let rando = Math.random()*100;
      this.get('graphData.surplusPlanned').push(rando);
    }

    //Budgeted (from the 'baseline' senarios)
    this.set('graphData.revenueBudgeted',[])
    for (let i = 0; i < 10; i++) {
      let rando = Math.random()*100;
      this.get('graphData.revenueBudgeted').push(rando);
    }

    this.set('graphData.expencesBudgeted',[])
    for (let i = 0; i < 10; i++) {
      let rando = Math.random()*100;
      this.get('graphData.expencesBudgeted').push(rando);
    }

    this.set('graphData.surplusBudgeted',[])
    for (let i = 0; i < 10; i++) {
      let rando = Math.random()*100;
      this.get('graphData.surplusBudgeted').push(rando);
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
