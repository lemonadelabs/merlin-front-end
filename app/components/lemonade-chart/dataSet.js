export default class DataSet {
  constructor(Label, Data, Color, DashArray) {
    let borderColor = Color.rgbString();
    let bgColour = Color.alpha(0.2).rgbaString()
    this.label = Label;
    this.data = Data;
    this.borderColor = borderColor;
    this.backgroundColor = bgColour;
    this.pointBackgroundColor = borderColor
    this.hidden = false;
    this.borderCapStyle = 'round';
    this.borderDash = DashArray;
  }
}
