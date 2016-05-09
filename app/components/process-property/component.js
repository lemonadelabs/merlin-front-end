import Ember from 'ember';

export default Ember.Component.extend({

  valueIsLoaded: false,

  initValue: function () {
    var value = this.get('processPropertyData')[this.id].data.value[ this.get('month') - 1 ]
    this.set('value', value)
    this.set('valueIsLoaded', true)
  }.observes('processPropertyData'),

  updateValueWithTime: function () {
    if (this.get('valueIsLoaded')) {
      var value = this.get('processPropertyData')[this.id].data.value[ this.get('month') - 1 ]
      this.set('value', value )
    }
  }.observes('month'),

  updateProperty: function () {
    if (this.valueIsLoaded) {
      var value = this.get('value')
      var valueFromData = this.get('processPropertyData')[this.id].data.value[ this.get('month') - 1 ]
      if ( value != "" && value != valueFromData ) {

        var entityId = this.get('entityId')
        var id = this.get('id')
        var month = this.get('month')

        this.updateBaseline({
          propertyId : id,
          entityId : entityId,
          value : value,
          month : month
        })
      }
    }
  }.observes('value'),

});
