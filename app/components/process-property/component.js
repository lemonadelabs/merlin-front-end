import Ember from 'ember';
import postJSON from '../../common/post-json'
import putJSON from '../../common/put-json'

export default Ember.Component.extend({

  oldValue: undefined,
  valueIsLoaded: false,

  setValue: function () {
    var value = this.processPropertyData[this.id].data.value[ this.month - 1 ]
    this.set('value', value)
    this.set('oldValue', value)
    this.set('valueIsLoaded', true)
  }.observes('processPropertyData'),

  updateProperty: function () {
    if (this.valueIsLoaded) { // this may be superfelous now

      var value = this.get('value')
      var entityId = this.get('entityId')
      var id = this.get('id')
      var month = this.get('month')

      if (value && (value != this.get('oldValue') ) ) {
        this.updateBaseline({
          propertyId : id,
          entityId : entityId,
          value : value,
          month : month
        })
        this.set('oldValue', value)
      }

    }
  }.observes('value'),

});
