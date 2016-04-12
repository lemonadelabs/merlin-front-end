export default class DataSet {
  constructor(Label, Data, Color) {
    let borderColor = Color.rgbString();
    let bgColour = Color.alpha(0.2).rgbaString()
    this.label = Label;
    this.data = Data;
    this.borderColor = borderColor;
    this.backgroundColor = bgColour;
  }
}
