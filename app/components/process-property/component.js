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

  persistProperty: function () {
    if (this.valueIsLoaded) {
      var value = this.get('value')
      var valueFromData = this.get('processPropertyData')[this.id].data.value[ this.get('month') - 1 ]
      if ( value != "" && value != valueFromData ) {

        var entityId = this.get('entityId')
        var id = this.get('id')
        var month = this.get('month')


        this.updateBaselineDebounced({
          propertyId : id,
          entityId : entityId,
          value : value,
          month : month
        })
      }
    }
  }.observes('value'),

  updateBaselineDebounced: function (opts) {
    var self = this
    var interval = 500
    var timeout = this.get('timeout')

    if (timeout) {
      clearTimeout(timeout)
    }

    timeout = setTimeout(function () {
      self.updateBaseline(opts)
    }, interval)
    this.set('timeout', timeout)
  }

});
