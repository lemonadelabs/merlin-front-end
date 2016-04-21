import Ember from 'ember';

export default Ember.Component.extend({
  classNames: ['toggle-switch'],
  switchStatus:Ember.computed('enabled',function(){
    let label = this.get('enabled') ? 'On' : 'Off'
    return label
  }),
  click(){
    let inverseEnabled = this.get('enabled') ? false : true;
    this.set('enabled', inverseEnabled);
  }
});
