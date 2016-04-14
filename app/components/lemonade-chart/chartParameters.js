export default class ChartParameters {
  constructor(DataSets, Labels, xAxes, yAxes){
    this.options = {
      scales:{
        xAxes:[xAxes],
        yAxes:[yAxes]
      }
    }
    this.data.labels = Labels;
    this.data.datasets.pushObjects(DataSets);
  }
}
