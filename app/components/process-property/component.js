import Ember from 'ember';

export default Ember.Component.extend({

  valueIsLoaded: false,
  oldValue: undefined,

  initValue: function () {
    var value = this.get('processPropertyData')[this.id].data.value[ this.get('month') - 1 ]
    this.set('value', value)
    this.set('oldValue', value)
    this.set('valueIsLoaded', true)
  }.observes('processPropertyData'),

  updateValueWithTime: function () {
    if (this.get('valueIsLoaded')) {
      var value = this.get('processPropertyData')[this.id].data.value[ this.get('month') - 1 ]
      this.set('value', value )
    }
  }.observes('month'),

  persistProperty: function () {
    var self = this
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
        }).then(function () {
          self.set('oldValue', value)
        })
      }
    }
  },

  resetValue: function () {
    this.set('value', this.get('oldValue'))
  },

  actions: {
    onEnter: function () {
      this.persistProperty()
    },
    onFocusOut: function () {
      this.resetValue()
    },
  }

});
