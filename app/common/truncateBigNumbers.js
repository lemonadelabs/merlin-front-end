export default function truncateBigNumbers(value){
  if(value >= 1000000 || value <= -1000000){
    return (value / 1000000) + " M"
  }
  else if(value >= 1000 || value <= -1000){
    return (value / 1000) + " T"
  }
  return value;
}
