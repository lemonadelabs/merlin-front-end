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
  },
  initCharts(){
    this.generateGraphData();
    this.createCards();
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
    let revenueHaircut = this.get('graphData.revenueHaircut');

    let expencesBudgeted = this.get('graphData.expencesBudgeted');
    let expencesPlanned = this.get('graphData.expencesPlanned');
    let expencesHaircut = this.get('graphData.expencesHaircut');

    let surplusBudgeted = this.get('graphData.surplusBudgeted');
    let surplusPlanned = this.get('graphData.surplusPlanned');
    let surplusHaircut = this.get('graphData.surplusHaircut');

    let financeCard = {};
    financeCard.name = "Finance";
    financeCard.graphs = {};
    financeCard.graphs["Revenue"] = this.newGraph(
      [
        'rgb(126, 211, 33)',
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
        },
        {
          name: 'Revenue Haircut',
          data: revenueHaircut
        }
      ],
      [
        'solid',
        'dotted',
        'longDash',
      ]);

    financeCard.graphs["Expences"] = this.newGraph(
      [
        'rgb(126, 211, 33)',
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
        },
        {
          name: 'Expences Haircut',
          data: expencesHaircut
        }
      ],
      [
        'solid',
        'dotted',
        'longDash',
      ]);

    financeCard.graphs["Surplus"] = this.newGraph(
      [
        'rgb(126, 211, 33)',
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
        },
        {
          name: 'Surplus Haircut',
          data: surplusHaircut
        }
      ],
      [
        'solid',
        'dotted',
        'longDash',
      ]);
    financeCard.filterCategories = [
      {
        label:'Revenue',
        selected:true
      },
      {
        label:'Expences',
        selected:false
      },
      {
        label:'Surplus',
        selected:false
      }
    ]
    this.get('cards').push(financeCard)
  },
  createStaffCard(){
    //Utilisation needs to be on another axis
    let staffCard = {};
    let lineStaffBudgeted = this.get('graphData.lineStaffBudgeted');
    let OhStaffBudgeted = this.get('graphData.OhStaffBudgeted');

    let lineStaffPlanned = this.get('graphData.lineStaffPlanned');
    let OhStaffPlanned = this.get('graphData.OhStaffPlanned');

    let lineStaffHaircut = this.get('graphData.lineStaffHaircut');
    let OhStaffHaircut = this.get('graphData.OhStaffHaircut');

    let staffUtilisationBudgeted = this.get('graphData.staffUtilisationBudgeted');
    let staffUtilisationPlanned = this.get('graphData.staffUtilisationPlanned');
    let staffUtilisationHaircut = this.get('graphData.staffUtilisationHaircut');


    staffCard.name = "Staff";
    staffCard.graphs = {};
    staffCard.graphs["Staff Numbers"] = this.newGraph(
      [
        'rgb(74, 144, 226)',
        'rgb(74, 217, 226)',
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
        {name: 'Line Staff Haircut', data:lineStaffHaircut},
        {name: 'Overhead Staff Haircut', data:OhStaffHaircut},
      ],
      [
        'solid',
        'solid',
        'dotted',
        'dotted',
        'longDash',
        'longDash'
      ]
    );

    staffCard.graphs["Utilisation"] = this.newGraph(
      [
        'rgb(74, 144, 226)',
        'rgb(74, 144, 226)',
        'rgb(74, 144, 226)',
      ],
      [
        {name: 'Utilisation Budgeted', data:staffUtilisationBudgeted},
        {name: 'Utilisation Planned', data:staffUtilisationPlanned},
        {name: 'Utilisation Haircut', data:staffUtilisationHaircut}

      ],
      [
        'solid',
        'dotted',
        'longDash',
      ]
    );

    staffCard.filterCategories = [
      {
        label:'Utilisation',
        selected:true
      },
      {
        label:'Staff Numbers',
        selected:false
      }
    ]

    this.get('cards').push(staffCard)
  },
  createOutputCard(){
    let outputCard = {};
    let outputsPlanned = this.get('graphData.outputsPlanned');
    let outputsBudgeted = this.get('graphData.outputsBudgeted');
    let outputsHaircut = this.get('graphData.outputsHaircut');

    let outputsSlaPlanned = this.get('graphData.outputsSlaPlanned');
    let outputsSlaBudgeted = this.get('graphData.outputsSlaBudgeted');
    let outputsSlaHaircut = this.get('graphData.outputsSlaHaircut');

    outputCard.name = "Outputs";
    outputCard.graphs = {};
    outputCard.graphs["Indexed Outputs"] = this.newGraph(
      [
        'rgb(245, 166, 35)',
        'rgb(245, 166, 35)',
        'rgb(245, 166, 35)'
      ],
      [
        {name: 'Outputs Planned', data:outputsPlanned},
        {name: 'Outputs Budgeted', data:outputsBudgeted},
        {name: 'Outputs Haircut', data:outputsHaircut}
      ],
      [
        'solid',
        'dotted',
        'longDash'
      ]
    );
    outputCard.graphs["Service Level"] = this.newGraph(
      [
        'rgb(245, 166, 35)',
        'rgb(245, 166, 35)',
        'rgb(245, 166, 35)'
      ],
      [
        {name: 'Service Level Planned', data:outputsSlaPlanned},
        {name: 'Service Level Budgeted', data:outputsSlaBudgeted},
        {name: 'Service Level Haircut', data:outputsSlaHaircut}
      ],
      [
        'solid',
        'dotted',
        'longDash'
      ]
    );
    outputCard.filterCategories = [
      {
        label:'Indexed Outputs',
        selected:true
      },
      {
        label:'Service Level',
        selected:false
      }
    ]
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
    this.set('graphData.outputsSlaPlanned',[])
    for (let i = 0; i < 10; i++) {
      let rando = Math.random()*100;
      this.get('graphData.outputsSlaPlanned').push(rando);
    }

    //Budgeted (from the 'baseline' senarios)
    this.set('graphData.outputsBudgeted',[])
    for (let i = 0; i < 10; i++) {
      let rando = Math.random()*100;
      this.get('graphData.outputsBudgeted').push(rando);
    }
    this.set('graphData.outputsSlaBudgeted',[])
    for (let i = 0; i < 10; i++) {
      let rando = Math.random()*100;
      this.get('graphData.outputsSlaBudgeted').push(rando);
    }

    //Haircut (from the 'haircut' senarios)
    this.set('graphData.outputsHaircut',[])
    for (let i = 0; i < 10; i++) {
      let rando = Math.random()*100;
      this.get('graphData.outputsHaircut').push(rando);
    }
    this.set('graphData.outputsSlaHaircut',[])
    for (let i = 0; i < 10; i++) {
      let rando = Math.random()*100;
      this.get('graphData.outputsSlaHaircut').push(rando);
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

    //Haircut (from the 'haircut' senarios)
    this.set('graphData.lineStaffHaircut',[])
    for (let i = 0; i < 10; i++) {
      let rando = Math.random()*10;
      this.get('graphData.lineStaffHaircut').push(rando);
    }
    this.set('graphData.OhStaffHaircut',[])
    for (let i = 0; i < 10; i++) {
      let rando = Math.random()*5;
      this.get('graphData.OhStaffHaircut').push(rando);
    }

    this.set('graphData.staffUtilisationHaircut',[])
    for (let i = 0; i < 10; i++) {
      let rando = Math.random()*10;
      this.get('graphData.staffUtilisationHaircut').push(rando);
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

    //Haircut (from the 'haircut' senarios)
    this.set('graphData.revenueHaircut',[])
    for (let i = 0; i < 10; i++) {
      let rando = Math.random()*100;
      this.get('graphData.revenueHaircut').push(rando);
    }

    this.set('graphData.expencesHaircut',[])
    for (let i = 0; i < 10; i++) {
      let rando = Math.random()*100;
      this.get('graphData.expencesHaircut').push(rando);
    }

    this.set('graphData.surplusHaircut',[])
    for (let i = 0; i < 10; i++) {
      let rando = Math.random()*100;
      this.get('graphData.surplusHaircut').push(rando);
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
