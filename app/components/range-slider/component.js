import Ember from 'ember';

export default Ember.Component.extend({
  propertyBindings: ['value > element.value'],
  // attributeBindings: ['min', 'max', 'step', 'type', 'name', 'list'],
  input: function() {
    let componentElement = this.get('element')
    let rangeElement = componentElement.querySelectorAll("input[type=range]")[0]
    this.set('value', Number(rangeElement.value).valueOf());
  }
});
