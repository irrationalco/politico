import Ember from 'ember';
import {
  task
} from 'ember-concurrency';

export default Ember.Component.extend({

  actions: {},

  optionNoLegend: {
    legend: {
      display: false
    }
  }
});
