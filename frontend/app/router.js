import Ember from 'ember';
import config from './config/environment';

const Router = Ember.Router.extend({
  location: config.locationType,
  rootURL: config.rootURL
});

Router.map(function () {
  this.route('login', { path: '/login' });

  this.route('polls', { path: 'polls/:poll_id' }, function () {
    this.route('sections', { path: 'sections/:section_id' }, function () {
      this.route('approval');
      this.route('vote');
    });
  });

  this.route('admin', function () {
    this.route('dashboard');
    this.route('users');
    this.route('user-edit', { path: '/user/:user_id/edit' });
    this.route('user-new', { path: "/user/new" });
    this.route('organizations');
    this.route('organization-edit', { path: '/organization/:organization_id/edit' });
    this.route('organization-new', { path: "/organization/new" });
    this.route('suborganizations');
    this.route('suborganization-edit', { path: '/suborganization/:suborganization_id/edit' });
    this.route('suborganization-new', { path: "/suborganization/new" });
  });

  this.route('maps', function () {
    this.route('projections');
    this.route('population');
  });

  this.route('ine', function () {
    this.route('voters');
    this.route('voter-edit', { path: 'voter/:voter_id/edit' });
    this.route('new-voter', { path: '/new' });
    this.route('voters3');
    this.route('dashboard');
  });

});

export default Router;
