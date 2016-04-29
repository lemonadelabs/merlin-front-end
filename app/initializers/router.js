//taken from http://stackoverflow.com/a/36850218
export function initialize(application) {
  application.inject('route', 'router', 'router:main');
  application.inject('component', 'router', 'router:main');
}

export default {
  name: 'router',
  initialize
};
