export default class DataSet {
  constructor(Label, Data, Color) {
    let borderColor = Color;
    let bgColour = chroma(Color).alpha(0.2).css()
    this.label = Label;
    this.data = Data;
    this.borderColor = borderColor;
    this.backgroundColor = bgColour;
    this.pointBackgroundColor = borderColor
    this.hidden = false;
    this.borderCapStyle = 'round';
  }
  setBorderColor(Color){
    this.borderColor = Color;
    this.pointBackgroundColor = Color
    this.backgroundColor = 'rgba(0,0,0,0)'
    // console.log(Color);
  }
  setAxisId(Id){
    this.yAxisID = Id;
  }
  setDashType(type, customArray){
    switch (type) {
      case 'dotted':
        //first 2 0's in the are for chrome to make the dots start at the start of the circle in chrome
        this.borderDash = [0,0,0,10];
        break;
      case 'longDash':
        this.borderDash = [20,10];
        break;
      case 'shortDash':
        this.borderDash = [0,0,5,10];
        break;
      case 'dashDot':
        this.borderDash = [10,10,0,10];
        break;
      case 'custom':
        this.borderDash = customArray || console.warn('DataSet: Custom dash type selected but no dash array passed.');
        if (customArray.length === 0) {
           console.warn('DataSet: Custom dash passed but array is empty.');
        }
        break;
      default:
        console.warn('DataSet:Tried to set DashType but no dash type defined')
    }
  }
}
