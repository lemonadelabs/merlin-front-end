import Ember from 'ember';
import config from './config/environment';

const Router = Ember.Router.extend({
  location: config.locationType
});

Router.map(function() {
  this.route('wills-house');
  this.route('calebs-house');
  this.route('plan');
  this.route('services',{ path: '/services/:service_id' });
  this.route('review');
});

export default Router;
