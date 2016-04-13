export default class Axes {
  constructor(LabelString, GridColour) {
    let gridColour = GridColour || new Color('rgb(255, 255, 255)')
    let gridlineColor = gridColour.alpha(0.2).rgbaString()
    let firstGridlineColor = gridColour.alpha(0.6).rgbaString()
    this.scaleLabel = {}
    this.gridLines = {}
    this.ticks = {}

    if(LabelString){
      this.scaleLabel.display = true;
      this.scaleLabel.fontStyle = 'bold';
      this.scaleLabel.labelString = LabelString;
    }
    this.gridLines.color = gridlineColor;
    this.gridLines.zeroLineColor = firstGridlineColor;
    this.ticks.beginAtZero = true;
  }
  hideGridLines(){
    this.gridLines.display = false;
  }
  hideTicks(){
    this.ticks.display = false;
  }
  prependToTickLabel(String){
    this.ticks.valueToPrepend = String;
    this.ticks.callback = formattingCallback
  }
  appendToTickLabel(String){
    this.ticks.valueToApend = String;
    this.ticks.callback = formattingCallback
  }
  addCallbackToTick(Callback){
    this.ticks.callback = Callback
  }
}

function formattingCallback(value){
  return this.valueToPrepend + value + this.valueToApend
}
