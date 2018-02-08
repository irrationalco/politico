import Ember from 'ember';
import {
  task
} from 'ember-concurrency';
import config from '../config/environment';
const {
  service
} = Ember.inject;

export default Ember.Component.extend({

  ajax: service('ajax'),
  session: service('session'),

  actions: {},

  data: null,

  success: false,

  error: false,

  runQuery: task(function* (headerName, headerValue) {
    try {
      let result = yield this.get('ajax').request(config.localhost + '/api/ine/dashboard', {
        accepts: {
          json: 'application/json'
        },
        headers: {
          [headerName]: headerValue
        },
        data: this.get('query')
      });
      if (!result && result !== 0) {
        this.set('error', true)
      } else {
        this.set('success', true);
        this.set('data', result);
      }
    } catch (err) {
      this.set('error', true);
    }
  }),

  didUpdateAttrs(info) {
    this._super(...arguments);
    if(info.oldAttrs.query !== info.newAttrs.query){
      this.set('success', false);
      this.set('data', null);
      this.set('error', false);
      this.getData();
    }
  },

  getData(){
    this.get('session').authorize('authorizer:oauth2', (headerName, headerValue) => {
      this.get('runQuery').perform(headerName, headerValue);
    });
  },

  init() {
    this._super(...arguments);
    this.getData();
  }

});
