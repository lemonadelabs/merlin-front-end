import Ember from 'ember';
import DataSet from '../lemonade-chart/dataSet';
import Axes from '../lemonade-chart/axes';
import ChartParameters from '../lemonade-chart/chartParameters';
import * as simTraverse from '../../common/simulation-traversal';

export default Ember.Component.extend({
  classNames : ['review-component'],
  services : undefined,
  senarios: {},
  simulationData: {},
  graphData : {},
  graphs : [],
  cards : [],
  init(){
    this._super();
    this.initCharts();
  },
  initCharts(){
    var self = this
    var baselineSimRun
    var baselineSenarioLoad = this.loadSenario('baseline')
   baselineSenarioLoad.then(function(){
        baselineSimRun = self.runSimulationWithSenario('baseline')
        baselineSimRun.done(
          function(){
            console.log(self.get('simulationData.baseline'));
            self.generateGraphData()
            self.createCards()
          })
    })
  },
  didInsertElement(){
    Ember.run.next(this,this.setupServicesFilter);
  },
  loadSenario: function (senarioName) {
    var self = this
    var id = this.model.simulation.id
    var simSubstring = `api/simulations/${id}/`
    return Ember.$.getJSON("api/scenarios/").then(function (scenarios) {

      var senario = _.find(scenarios, function (scenario) {
        return  ( _.includes(scenario.sim, simSubstring) && scenario.name === senarioName)
      })

      if (senario) {
        self.set(`senarios.${senarioName}`, senario)
      } else {
        var postData = {
          "name": senarioName,
          "sim": "http://127.0.0.1:8000/api/simulations/" + id + '/',
          "start_offset": 0
        }
        postJSON({
          data : postData,
          url : "api/scenarios/"
        }).then(function (baseline) {
          self.set(`senarios.${senarioName}`, senario)
        })
      }
    })
  },
  runSimulationWithSenario(senario){
    var self = this
    let senarioData = this.get(`senarios.${senario}`)
    let simulation_id = this.get(`model.simulation.id`)
    return Ember.$.getJSON(`api/simulation-run/${simulation_id}/?steps=120&s0=${senarioData.id}/`).then(
      function(simData){
        self.set(`simulationData.${senario}`,simData)
      }
    )
  },
  setupServicesFilter(){
    var simulation = this.get('model.simulation')
    var serviceModels = simTraverse.getServiceModelsFromSimulation({simulation : simulation})
    this.set('services', serviceModels)
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

    let surplusOpertationalBudgeted = this.get('graphData.surplusOpertationalBudgeted');
    let surplusOpertationalPlanned = this.get('graphData.surplusOpertationalPlanned');
    let surplusOpertationalHaircut = this.get('graphData.surplusOpertationalHaircut');


    let surplusBudgetaryBudgeted = this.get('graphData.surplusBudgetaryBudgeted');
    let surplusBudgetaryPlanned = this.get('graphData.surplusBudgetaryPlanned');
    let surplusBudgetaryHaircut = this.get('graphData.surplusBudgetaryHaircut');

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

    financeCard.graphs["Operational Surplus"] = this.newGraph(
      [
        'rgb(126, 211, 33)',
        'rgb(126, 211, 33)',
        'rgb(126, 211, 33)',
      ],
      [
        {
          name: 'Operational Surplus Budgeted',
          data: surplusOpertationalBudgeted
        },
        {
          name: 'Operational Surplus Planned',
          data: surplusOpertationalPlanned
        },
        {
          name: 'Operational Surplus Haircut',
          data: surplusOpertationalHaircut
        }
      ],
      [
        'solid',
        'dotted',
        'longDash',
      ]);

    financeCard.graphs["Budgetary Surplus"] = this.newGraph(
      [
        'rgb(126, 211, 33)',
        'rgb(126, 211, 33)',
        'rgb(126, 211, 33)',
      ],
      [
        {
          name: 'Budgetary Surplus Budgeted',
          data: surplusBudgetaryBudgeted
        },
        {
          name: 'Budgetary Surplus Planned',
          data: surplusBudgetaryPlanned
        },
        {
          name: 'Budgetary Surplus Haircut',
          data: surplusBudgetaryHaircut
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
        label:'Operational Surplus',
        selected:false
      },
      {
        label:'Budgetary Surplus',
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
        'rgb(74, 144, 226)',
        'rgb(74, 144, 226)',
        'rgb(74, 217, 226)',
        'rgb(74, 217, 226)',
        'rgb(74, 217, 226)',

      ],
      [
        {name: 'Line Staff Budgeted', data:lineStaffBudgeted},
        {name: 'Line Staff Planned', data:lineStaffPlanned},
        {name: 'Line Staff Haircut', data:lineStaffHaircut},
        {name: 'Overhead Staff Budgeted', data:OhStaffBudgeted},
        {name: 'Overhead Staff Planned', data:OhStaffPlanned},
        {name: 'Overhead Staff Haircut', data:OhStaffHaircut},
      ],
      [
        'solid',
        'dotted',
        'longDash',
        'solid',
        'dotted',
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
      // {
      //   label:'Utilisation',
      //   selected:true
      // },
      {
        label:'Staff Numbers',
        selected:true
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
        'rgb(245, 166, 35)'
      ],
      [
        {name: 'Indexed Outputs Planned', data:outputsPlanned},
        {name: 'Indexed Outputs Haircut', data:outputsHaircut}
      ],
      [
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
        label:'Service Level',
        selected:true
      },
      {
        label:'Indexed Outputs',
        selected:false
      }
    ]
    this.get('cards').push(outputCard)
  },
  generateGraphData(){
    let baseline = this.get('simulationData.baseline');
    console.log(baseline);
    this.generateOutputData(baseline)
    this.generateStaffData(baseline)
    this.generateFinancialData(baseline);

  },
  generateOutputData(baseline){
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
  generateStaffData(baseline){
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

    let lineStaffBudgeted = this.findDataSetForGraphData(baseline,'line staff #','ProcessProperty')
    _.forEach(lineStaffBudgeted,function(v,i){
      lineStaffBudgeted[i] = v / 12;
    })
    this.set('graphData.lineStaffBudgeted',lineStaffBudgeted)


    // "overhead staff #" |ProcessProperty
    let OhStaffBudgeted = this.findDataSetForGraphData(baseline,'overhead staff #','ProcessProperty')
    this.set('graphData.OhStaffBudgeted',OhStaffBudgeted)

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
  generateFinancialData(baseline){
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

    this.set('graphData.surplusOpertationalPlanned',[])
    for (let i = 0; i < 10; i++) {
      let rando = Math.random()*100;
      this.get('graphData.surplusOpertationalPlanned').push(rando);
    }

    this.set('graphData.surplusBudgetaryPlanned',[])
    for (let i = 0; i < 10; i++) {
      let rando = Math.random()*100;
      this.get('graphData.surplusBudgetaryPlanned').push(rando);
    }
    //Budgeted (from the 'baseline' senarios)
    this.set('graphData.revenueBudgeted',[])
    for (let i = 0; i < 10; i++) {
      let rando = Math.random()*100;
      this.get('graphData.revenueBudgeted').push(rando);
    }
    let revenueBudgetedData = this.findDataSetForGraphData(baseline,'Service Revenue','Output')
    this.set('graphData.revenueBudgeted',revenueBudgetedData)

    let baselineOperationalSurplusData = this.findDataSetForGraphData(baseline,'Operational Surplus','Output')
    this.set('graphData.surplusOpertationalBudgeted',baselineOperationalSurplusData)


    let expencesBudgetedData = []
    _.forEach(revenueBudgetedData,function(revData,i){
      expencesBudgetedData[i] = revData - baselineOperationalSurplusData[i]
    })
    this.set('graphData.expencesBudgeted',expencesBudgetedData)

    let baselineBudgetarySurplusData = this.findDataSetForGraphData(baseline,'Budgetary Surplus','Output')
    this.set('graphData.surplusBudgetaryBudgeted',baselineBudgetarySurplusData)

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

    this.set('graphData.surplusOpertationalHaircut',[])
    for (let i = 0; i < 10; i++) {
      let rando = Math.random()*100;
      this.get('graphData.surplusOpertationalHaircut').push(rando);
    }
    this.set('graphData.surplusBudgetaryHaircut',[])
    for (let i = 0; i < 10; i++) {
      let rando = Math.random()*100;
      this.get('graphData.surplusBudgetaryPlanned').push(rando);
    }
  },
  findDataSetForGraphData(Senario,DataSetName,DataSetType){
    let telemetartyForSenario = _.filter(Senario, { 'name': DataSetName, 'type': DataSetType });
    let dataSet = []
    _.forEach(telemetartyForSenario,function(surplus,k){
      _.forEach(surplus.data.value,function(data,i){
        let month = i
        let year = Math.floor(month/12)
        if(dataSet[year] === undefined ){
          dataSet[year] = 0
        }
        dataSet[year] += data
      })
    })
    return dataSet
  },
  generateYearLabels:function(baseline){
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
