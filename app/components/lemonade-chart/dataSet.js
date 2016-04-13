export default class DataSet {
  constructor(Label, Data, Color) {
    let borderColor = Color.rgbString();
    let bgColour = Color.alpha(0.2).rgbaString()
    this.label = Label;
    this.data = Data;
    this.borderColor = borderColor;
    this.backgroundColor = bgColour;
    this.pointBackgroundColor = borderColor
    this.hidden = false;
    this.borderCapStyle = 'round';
  }
  setDashType(type){
    if(type === 'dotted'){
      this.borderDash = [0,0,0,5];
    }
    else if (type === 'longDash') {
      this.borderDash = [20,10];
    }
    else if (type === 'shortDash') {
      this.borderDash = [0,0,5,10];
    }
    else if (type === 'dashDot') {
      this.borderDash = [10,10,0,10];
    }
  }
}
