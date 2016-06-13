import Ember from 'ember';
import commaSeperate from '../../common/commaSeperateNumber';
import toTwoDP from '../../common/toTwoDP';

export default Ember.Component.extend({
  mouseEnter(){
    let errorMessages = this.get('year.errorsMessages')
    this.constructErrorMessage(errorMessages)
  },
  constructErrorMessage(errorMessages){
    let combinedMessage = ""
    var self = this
    _.forEach(errorMessages,function(error){
      let messageFindReplace = self.findAndReplaceTemplate(error.message,{
                            'staff$':'"Staff Budget"',
                            'desktop#':'"Desktop Computers"',
                            'LS_work_hr':'"Line Staff Work Hours"'
                          })
      let messagWithformatedNumbers = self.findAndFormatNumbers(messageFindReplace)
      combinedMessage += messagWithformatedNumbers+"\n"
    })
    console.log(combinedMessage);
  },
  findAndReplaceTemplate(message,lookup){
    var firstSplit = message.split("{{")
    if(firstSplit.length <= 1){
      return message
    }
    var secondSplit = firstSplit[1].split("}}")
    var keyword = secondSplit[0]
    var replacedWord = lookup[keyword];
    return(firstSplit[0]+(replacedWord||keyword)+secondSplit[1])
  },
  findAndFormatNumbers(message){
    var removedSpaces = message.split(" ")
    var returnString = ""
    _.forEach(removedSpaces,function(word, i){
      var potentialNumber = parseFloat(word)
      if(!isNaN(potentialNumber)){
        let NumberTwoDP = toTwoDP(potentialNumber)
        word = commaSeperate(NumberTwoDP);
      }
      returnString += word+" "
    })
    return(returnString);
  }
});
