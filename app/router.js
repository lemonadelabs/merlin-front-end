import Ember from 'ember';
import config from './config/environment';

const Router = Ember.Router.extend({
  location: config.locationType
});

Router.map(function() {
  this.route('wills-house');
  this.route('calebs-house');
  this.route('plan', { path: '/plan/:simulation_id' });
  this.route('services', { path: '/services/:service_id' });
});

export default Router;
