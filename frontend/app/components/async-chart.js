import Ember from 'ember';
import {
  task,
  taskGroup
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

  allTasks: taskGroup().enqueue(),

  runQuery: task(function* (headerName, headerValue) {
    try {
      let result = yield this.get('ajax').request(config.localhost + '/api/ine/dashboard', {
        accepts: {
          json: 'application/json'
        },
        headers: {
          [headerName]: headerValue
        },
        data: {
          chart: this.get('query')
        }
      });
      if (!result) {
        this.set('error', true)
      } else {
        this.set('success', true);
        if (Object.keys(result).length !== 0 || result.constructor !== Object) {
          this.set('data', result);
          console.log(this.get('data'))
        } else {
          console.log(this.get('id'), 'empty')
        }
      }
    } catch (err) {
      this.set('error', true);
    }
  }).group('allTasks'),

  createChart: task(function* () {
    if (this.get('error') || !this.get('data')) {
      return;
    }
    console.log(this.get('id'), this.get('data'))
    let type = this.get('type');
    if (type === "line") {
      new Chartkick.LineChart(this.get('id'), this.get('data'));
    } else if (type === "pie") {
      new Chartkick.PieChart(this.get('id'), this.get('data'), {
        doughnut: true
      });
    } else if (type === "column") {
      new Chartkick.ColumnChart(this.get('id'), this.get('data'));
    } else if (type === "bar") {
      new Chartkick.BarChart(this.get('id'), this.get('data'));
    } else if (type === "area") {
      new Chartkick.AreaChart(this.get('id'), this.get('data'));
    } else if (type === "scatter") {
      new Chartkick.ScatterChart(this.get('id'), this.get('data'));
    }
  }).group('allTasks'),

  init() {
    this._super(...arguments);
    this.set('id', this.get('query') + '-' + Math.floor(Math.random() * 1000));
    this.get('session').authorize('authorizer:oauth2', (headerName, headerValue) => {
      this.get('runQuery').perform(headerName, headerValue);
    });
  },

  didUpdate() {
    this._super(...arguments);
    this.get('createChart').perform();
  }

});
