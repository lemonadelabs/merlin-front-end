import Ember from 'ember';
import mockData from './mock-data'

export default Ember.Route.extend({
  model: function () {
    return mockData()
  }
});
