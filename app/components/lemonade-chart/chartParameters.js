export default class ChartParameters {
  constructor(DataSets, Labels, xAxes, yAxes) {
    this.options = {}
    this.options.scales = {}
    this.options.scales.xAxes = xAxes
    this.options.scales.yAxes = yAxes
    this.data = {}
    this.data.labels = Labels
    this.data.datasets = DataSets
  }
}
