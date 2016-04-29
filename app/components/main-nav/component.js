import Ember from 'ember';

export default Ember.Component.extend({
  // activeRoute:{
  //   'plan':false,
  //   'services':false
  // },
  // activeRouteKey:undefined,
  classNames:['main-nav'],
  // observeCurrentRoute: function(){
  //   let previousRoute = this.get('activeRouteKey');
  //   let currentRoute = this.get('router.currentRouteName')
  //   if(previousRoute){
  //     this.set(`activeRoute.${previousRoute}`, false)
  //   }
  //   this.set(`activeRoute.${currentRoute}`, true)
  //   this.set('activeRouteKey', currentRoute)
  // }.observes('router.currentRouteName')
});
