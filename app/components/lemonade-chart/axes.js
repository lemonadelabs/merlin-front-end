export default class Axes {
  constructor(LabelString, GridColour, Id) {
    let gridColour = GridColour || new Color('rgb(255, 255, 255)')
    let fontColour = gridColour.alpha(1).rgbaString();
    let gridlineColor = gridColour.alpha(0.2).rgbaString()
    let firstGridlineColor = gridColour.alpha(0.6).rgbaString()
    this.scaleLabel = {}
    this.gridLines = {}
    this.ticks = {}
    this.id = Id;

    if(LabelString){
      this.scaleLabel.display = true;
      this.scaleLabel.fontStyle = 'bold';
      this.scaleLabel.labelString = LabelString;
    }

    this.gridLines.color = gridlineColor;
    this.gridLines.zeroLineColor = firstGridlineColor;
    //Ticks Settings
    this.ticks.beginAtZero = true;
    this.ticks.fontColor = fontColour;
  }
  hideGridLines(){
    this.gridLines.display = false;
  }
  hideTicks(){
    this.ticks.display = false;
  }
  setPosition(Position){
    this.position = Position;
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
  return (this.valueToPrepend || "") + value + (this.valueToApend || "")
}
