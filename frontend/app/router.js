import Ember from 'ember';
import config from './config/environment';

const Router = Ember.Router.extend({
  location: config.locationType,
  rootURL: config.rootURL
});

Router.map(function() {

  this.route('projections', { path: '/projections'});

  this.route('poll', { path: 'poll/:poll_id' }, function() {
    this.route('section', { path: 'section/:section_id' });
  });

  this.route('maps', function() {
      this.route('projections', { path: '/projections'});
      this.route('population', { path: '/population'});
  });
});

export default Router;
