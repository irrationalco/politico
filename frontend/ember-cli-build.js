/*jshint node:true*/
/* global require, module */
var EmberApp = require('ember-cli/lib/broccoli/ember-app');
var Funnel = require('broccoli-funnel');

module.exports = function(defaults) {
  var app = new EmberApp(defaults, {
    // Add options here
  });

  // Bootstrap
  app.import(app.bowerDirectory + '/bootstrap/dist/css/bootstrap.css');
  app.import(app.bowerDirectory + '/bootstrap/dist/js/bootstrap.js');
  app.import(app.bowerDirectory + '/bootstrap/dist/fonts/glyphicons-halflings-regular.woff', {
    destDir: 'fonts'
  });

  // FontAwesome
  app.import('bower_components/font-awesome/css/font-awesome.css');
  app.import('bower_components/font-awesome/css/font-awesome.css.map');

  var fontawesome = new Funnel('bower_components/font-awesome/fonts', {
    srcDir: '/',
    destDir: 'fonts'
  });

  // Datamaps & D3
  app.import('bower_components/d3/d3.min.js');
  app.import('bower_components/topojson/topojson.min.js');
  app.import('bower_components/datamaps/dist/datamaps.world.min.js');

  // Vendor
  app.import('vendor/mx_states.json', {
    destDir: 'assets'
  });

  app.import('vendor/customAfghanMap.topo.json', {
    destDir: 'assets'
  });

  app.import('vendor/mx_tj.json', {
    destDir: 'assets'
  });

  app.import('vendor/nuevoleon_secciones.json', {
    destDir: 'assets'
  });

  app.import('vendor/nuevoLeonData.json', {
    destDir: 'assets'
  });
  
  return app.toTree([fontawesome]);
};