/*jshint node:true*/
/* global require, module */
var EmberApp = require('ember-cli/lib/broccoli/ember-app');
var Funnel = require('broccoli-funnel');

module.exports = function (defaults) {
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
  app.import(app.bowerDirectory + '/font-awesome/css/font-awesome.css');
  app.import(app.bowerDirectory + '/font-awesome/css/font-awesome.css.map');

  var fontawesome = new Funnel(app.bowerDirectory + '/font-awesome/fonts', {
    srcDir: '/',
    destDir: 'fonts'
  });

  // API Logo
  app.import('vendor/API_logo.svg', { destDir: 'assets' });
  app.import('vendor/apilogo.png', { destDir: 'assets' });

  // Topojson FILES VENDOR 
  app.import('vendor/mx_states.json', {
    destDir: 'assets'
  });

  app.import('vendor/us.json', {
    destDir: 'assets'
  });

  app.import('vendor/US-full.json', {
    destDir: 'assets'
  });

  app.import('vendor/US-counties-cities-states.json', {
    destDir: 'assets'
  });

  app.import('vendor/customAfghanMap.topo.json', {
    destDir: 'assets'
  });

  app.import('vendor/mx_tj.json', { destDir: 'assets' });
  app.import('vendor/secciones.json', { destDir: 'assets' });

  app.import('vendor/MX_NL.json', { destDir: 'assets' });
  app.import('vendor/MX_NLe5.json', { destDir: 'assets' });
  app.import('vendor/distritos.json', { destDir: 'assets' });

  app.import('vendor/nuevoleon_secciones.json', {
    destDir: 'assets'
  });

  app.import('vendor/nuevoLeonData.json', {
    destDir: 'assets'
  });

  // Datamaps & D3
  // app.import('bower_components/d3/d3.min.js');
  // app.import('bower_components/topojson/topojson.min.js');
  // app.import('bower_components/datamaps/dist/datamaps.world.min.js');

  app.import(app.bowerDirectory + '/bootstrap-datepicker/dist/locales/bootstrap-datepicker.es.min.js');

  return app.toTree([fontawesome]);
};
