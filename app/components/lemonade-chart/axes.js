export default class Axes {
  constructor(LabelString, GridColour, Id) {
    let gridColour = GridColour || 'rgb(255, 255, 255)'
    let fontColour = gridColour;
    let gridlineColor = chroma(gridColour).alpha(0.2).css()
    let firstGridlineColor = chroma(gridColour).alpha(0.8).css()
    this.afterSetDimensions = afterSetDimensions.bind(this);
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
  getAxesWidth(){
    return this.maxWidth;
  }
  beginAtZero(bool){
    this.ticks.beginAtZero = bool;
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
  customFormatting(Function){
    this.ticks.customFormattingFunction = Function
  }
}

function formattingCallback(value){
  console.log(this);
  var returnString = this.customFormattingFunction ? this.customFormattingFunction(value) : value;
  console.log(this.customFormattingFunction);
  if(this.customFormattingFunction){console.log(this.customFormattingFunction(returnString))};
  return (this.valueToPrepend || "") + returnString + (this.valueToApend || "")
}

function afterSetDimensions(scale){
  this.maxWidth = scale.maxWidth;
}
