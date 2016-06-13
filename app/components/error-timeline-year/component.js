import Ember from 'ember';
import commaSeperate from '../../common/commaSeperateNumber';
import toTwoDP from '../../common/toTwoDP';

export default Ember.Component.extend({
  classNames:['error-timeline-year'],
  popper:undefined,
  mouseEnter(){
    let errorMessages = this.get('year.errorsMessages')
    var formattedMessage = this.constructErrorMessage(errorMessages)
    this.addPopper(formattedMessage)

  },
  addPopper(content){
    if(!content){
      return
    }

    var reference = this.get('element');
    var popper = new Popper(
        reference,
        {
            content: content,
            contentType: 'html'
        },
        {
             placement: 'top',
             removeOnDestroy: true,
             offset: 6
        }
    );
    this.set('popper',popper)
  },
  mouseLeave(){
    var popper = this.get('popper')
    if(popper){
      popper.destroy()
    }
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
      combinedMessage += "<p>"+messagWithformatedNumbers+"</p>"
    })
    console.log(combinedMessage);
    return combinedMessage
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
