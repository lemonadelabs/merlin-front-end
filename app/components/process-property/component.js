import Ember from 'ember'

export default Ember.Component.extend({

  valueIsLoaded: false,
  numberValue: undefined,

  didInsertElement: function () {
    if ( this.get('processPropertyData') ) { this.initValue() }
  },

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

  addComma: function () {
    var numberValue = Number( this.get( 'value' ).toString().replace( /,/g, '' ) )
    if( !isNaN( numberValue ) ){
        this.set( 'value', numberValue.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") )
        this.set( 'numberValue', numberValue )
    }
    else{
      console.warn('in the else!!!! Number is NaN')
      this.initValue()
    }
  }.observes('value'),

  valueHasChanged: function () {
    var numberValue = this.get('numberValue')
    var valueFromData = this.get('processPropertyData')[this.id].data.value[ this.get('month') - 1 ]
    return numberValue !== valueFromData
  },

  persistProperty: function () {
    if (this.valueIsLoaded && this.valueHasChanged()) {
      var numberValue = this.get('numberValue')
      var entityId = this.get('entityId')
      var id = this.get('id')
      var month = this.get('month')

      this.updateBaseline({
        propertyId : id,
        entityId : entityId,
        value : numberValue,
        month : month
      })
    }
  },

  actions: {
    onEnter: function () {
      this.persistProperty()
    },
    onFocusOut: function () {
      this.initValue()
    },
  }

})
