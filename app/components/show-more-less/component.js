import Ember from 'ember';

export default Ember.Component.extend({
  classNames: ['show-hide'],
  click(){
    this.toggleBool("expanded")
  },
  toggleBool: function (variablepath){
    let toggleBool = this.get(variablepath) ? false : true;
    this.set(variablepath, toggleBool);
  }
});
