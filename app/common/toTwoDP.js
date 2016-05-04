export default function toTwoDP(value) {
  if(value.toString().indexOf(".")>0){
    return value.toFixed(2)
  }
  else{
    return value
  }
}
