import Ember from 'ember';
import {
  task,
  waitForQueue
} from 'ember-concurrency';
import config from '../config/environment';
const {
  service
} = Ember.inject;
const Chartkick = window.Chartkick;

export default Ember.Component.extend({

  ajax: service('ajax'),
  session: service('session'),

  actions: {},

  data: null,

  success: false,

  error: false,

  id: null,

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
      if (!result) {
        this.set('error', true)
      } else {
        this.set('success', true);
        if (Object.keys(result).length !== 0 || result.constructor !== Object) {
          this.set('data', result);
        }
        this.get('createChart').perform();
      }
    } catch (err) {
      this.set('error', true);
    }
  }).restartable(),

  createChart: task(function* () {
    if (this.get('error') || !this.get('data')) {
      return;
    }
    yield waitForQueue('afterRender');
    let type = this.get('type');
    if (type === "line") {
      new Chartkick.LineChart(this.get('id'), this.get('data'), this.get('options'));
    } else if (type === "pie") {
      new Chartkick.PieChart(this.get('id'), this.get('data'), Ember.$.extend({
        donut: true
      }, this.get('options') || {}));
    } else if (type === "column") {
      new Chartkick.ColumnChart(this.get('id'), this.get('data'), this.get('options'));
    } else if (type === "bar") {
      new Chartkick.BarChart(this.get('id'), this.get('data'), this.get('options'));
    } else if (type === "area") {
      new Chartkick.AreaChart(this.get('id'), this.get('data'), this.get('options'));
    } else if (type === "scatter") {
      new Chartkick.ScatterChart(this.get('id'), this.get('data'), this.get('options'));
    }
  }).restartable(),

  getData(){
    this.set('id', this.get('query').chart + '-' + Math.floor(Math.random() * 1000));
    this.get('session').authorize('authorizer:oauth2', (headerName, headerValue) => {
      this.get('runQuery').perform(headerName, headerValue);
    });
  },

  init() {
    this._super(...arguments);
    this.getData();
  },

  didUpdateAttrs(info) {
    this._super(...arguments);
    if(info.oldAttrs.query !== info.newAttrs.query){
      this.set('success', false);
      this.set('data', null);
      this.set('error', false);
      this.getData();
    }
  }

});
