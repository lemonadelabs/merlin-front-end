import Ember from 'ember';

export default Ember.Controller.extend({
  queryParams: ['branch','service'],
  branch: null,
  service: null,
});
