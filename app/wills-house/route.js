import mockData from './mock-data'
import Ember from 'ember';

export default Ember.Route.extend({
  model: function () {
    return mockData()
  }
});
