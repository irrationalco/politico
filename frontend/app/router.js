import Ember from 'ember';
import config from './config/environment';

const Router = Ember.Router.extend({
  location: config.locationType,
  rootURL: config.rootURL
});

Router.map(function() {
  this.route('login', { path: '/login'});
    
  this.route('polls', { path: 'polls/:poll_id' }, function() {
    this.route('sections', { path: 'sections/:section_id' }, function() {
      this.route('approval');
      this.route('vote');
    });
  });

  this.route('admin', function() {
    this.route('users');
    this.route('new-user', { path: "/new" });
  });

  this.route('maps', function() {
    this.route('projections');
    this.route('population');
  });
  
});

export default Router;
