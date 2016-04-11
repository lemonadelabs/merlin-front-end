/*jshint node:true*/
/* global require, module */
var EmberApp = require('ember-cli/lib/broccoli/ember-app');
var cssImport = require("postcss-import");
var cssnext = require('postcss-cssnext')

module.exports = function(defaults) {
  var app = new EmberApp(defaults, {
    // minifyJS: { // all of these settings are copied from pulse
    //   enabled: false
    // },
    minifyCSS: {
      enabled: false
    },
    postcssOptions: {
      plugins: [
        {
          module: cssImport,
          options: {
            path: ["app/styles"]
          }
        },
        {
          module: cssnext,
          options: {}
        }
      ]
    }
  });

  app.import('bower_components/svg.js/dist/svg.js')
  app.import('bower_components/svg.foreignobject.js/svg.foreignobject.js')
  app.import('bower_components/svg.draggable.js/dist/svg.draggable.js')
  app.import('bower_components/lodash/lodash.js')
  app.import('bower_components/chartjs/dist/Chart.js')

  return app.toTree();
};
