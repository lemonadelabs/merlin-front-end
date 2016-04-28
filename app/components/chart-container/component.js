import Ember from 'ember';

export default Ember.Component.extend({

  didDestroyElement: function () {
    var graphs = this.get('graphs')
    delete graphs['investmentGraph']
    this.set('graphs', graphs)
  },

  setThings: function () {
    this.set('data', this.get('graphs')['investmentGraph'].data)
    this.set('options', this.get('graphs')['investmentGraph'].options)
  }.on('init')

});

