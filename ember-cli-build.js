/*jshint node:true*/
/* global require, module */
var EmberApp = require('ember-cli/lib/broccoli/ember-app');
var cssImport = require("postcss-import");
var cssnext = require('postcss-cssnext')
var simpleVars = require('postcss-simple-vars')
var cssNested = require('postcss-nested')
var cssMixins = require('postcss-mixins')

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
          module:cssNested
        },
        {
          module: simpleVars,
          options: {}
        },
        {
          module: cssImport,
          options: {
            path: ["app/styles"]
          }
        },
        {
          module: cssnext,
          options: {}
        },
        {
          module: cssMixins,
          options: {}
        },
      ]
    }
  });

  app.import('bower_components/svg.js/dist/svg.js')
  app.import('bower_components/lodash/lodash.js')
  app.import('bower_components/chartjs/dist/Chart.js')
  app.import('bower_components/chroma-js/chroma.min.js')

  return app.toTree();
};
