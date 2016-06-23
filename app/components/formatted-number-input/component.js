import Ember from 'ember';

export default Ember.Component.extend({
  formattedValue: undefined,
  originalValue: undefined,

  didReceiveAttrs: function () {
    if(!this.get('formattedValue') && !this.get('originalValue')){
      this.initValues()
    }
  },

  initValues: function () {
    this.set('formattedValue', this.get('value'))
    this.set('originalValue', this.get('value'))
  },

  formatValue: function () {
    var numberValue = Number( this.get( 'formattedValue' ).toString().replace( /,/g, '' ) )
    if( !isNaN( numberValue ) ) {
      this.set( 'formattedValue', numberValue.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") )
      this.set( 'value', numberValue );
    }
    else{
      console.warn('number is NaN')
      this.initValues()
    }
  }.observes('formattedValue')
});
