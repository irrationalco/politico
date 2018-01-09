import Ember from 'ember';
import {
  task
} from 'ember-concurrency';

export default Ember.Component.extend({

  actions: {},

  data: null,

  error: false,

  runQuery: task(function* () {
    let result = yield this.get('store').queryRecord('dashboardInfo', {
      chart: this.get('query')
    });
    if (!result) {
      this.set('error', true);
    } else {
      this.set('data', result.get('info'));
      console.log(this.get('data'))
    }
  }),

  init() {
    this._super(...arguments);
    this.get('runQuery').perform();
  }

});
