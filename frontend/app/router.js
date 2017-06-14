import Ember from 'ember';
import config from './config/environment';

const Router = Ember.Router.extend({
  location: config.locationType,
  rootURL: config.rootURL
});

Router.map(function() {
  // this.route('predi', function() {
  // 	this.route("map", { path: ':map_id'});
  // });
  this.route('projections', { path: '/projections'});

  this.route('polls,' { path: '/polls'});

  this.route('maps', function() {
      this.route('projections', { path: '/projections'});
      this.route('population', { path: '/population'});
  });
});

export default Router;
