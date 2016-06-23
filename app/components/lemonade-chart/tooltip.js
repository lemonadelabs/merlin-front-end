export default class Tooltip{
  constructor(){
    this.callbacks = {
      label: prependAppendCallback
    }
  }
  formatTooltipLabelValue(Callback){
    this.callbacks.beforeLabel = Callback
  }
  prependToTooltipLabel(ValueToPrepend){
    this.valueToPrepend = ValueToPrepend
    // console.log(valueToPrepend);
  }
  appendToTooltipLabel(ValueToApend){
    this.valueToApend = ValueToApend
  }
}

function prependAppendCallback(tooltipItem, data){
  console.log();
  let valueToPrepend = this._options.tooltips.valueToPrepend || ""
  let valueToApend = this._options.tooltips.valueToApend || ""
  let datasetIndex = tooltipItem.datasetIndex
  let datasetLabel = data.datasets[datasetIndex].label || ""
  return datasetLabel+": "+(valueToPrepend) + tooltipItem.yLabel + (valueToApend)
}
