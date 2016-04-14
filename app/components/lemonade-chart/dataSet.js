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
  setAxisId(Id){
    this.yAxisID = Id;
  }
  setDashType(type, customArray){
    if(type === 'dotted'){
      //first 2 0's are for chrome to make the dots start at the start of the circle
      this.borderDash = [0,0,0,10];
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
    else if (type === 'custom') {
      this.borderDash = customArray || console.warn('DataSet: Custom dash type selected but no dash array passed.');
      if (customArray.length === 0) {
         console.warn('DataSet: Custom dash passed but array is empty.');
      }
    }
  }
}
