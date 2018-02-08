import Ember from 'ember';
import {
  task
} from 'ember-concurrency';
import config from '../config/environment';
const {
  service
} = Ember.inject;

export default Ember.Component.extend({

  loadingGeoData: false,

  states: [],

  selectedState: null,

  municipalities: [],

  selectedMunicipality: null,

  sections: [],

  selectedSection: null,

  timeGraphOptions: {
    points: false,
    curve: false,
    library: {
      xAxes: [{
        ticks: {
          source: 'auto'
        },
        bounds: 'ticks'
      }]
    }
  },

  ajax: service('ajax'),

  session: service('session'),

  queryFilters: Ember.computed('{selectedState,selectedMunicipality,selectedSection}', function () {
    let state = this.get('selectedState') || {
      id: ''
    };
    let muni = this.get('selectedMunicipality') || {
      name: ''
    };
    let section = this.get('selectedSection') || '';
    return {
      state: state.id,
      muni: muni.name,
      section: section
    };
  }),

  genderQuery: Ember.computed('queryFilters', function () {
    return this.getFilterObject('chart', 'gender');
  }),

  dateOfBirthQuery: Ember.computed('queryFilters', function () {
    return this.getFilterObject('chart', 'date_of_birth');
  }),

  edLevelQuery: Ember.computed('queryFilters', function () {
    return this.getFilterObject('chart', 'ed_level');
  }),

  addedMonthQuery: Ember.computed('queryFilters', function () {
    return this.getFilterObject('chart', 'added_month');
  }),

  addedWeekQuery: Ember.computed('queryFilters', function () {
    return this.getFilterObject('chart', 'added_week');
  }),

  addedDayQuery: Ember.computed('queryFilters', function () {
    return this.getFilterObject('chart', 'added_day');
  }),

  ocupationQuery: Ember.computed('queryFilters', function () {
    return this.getFilterObject('chart', 'ocupation');
  }),

  partyQuery: Ember.computed('queryFilters', function () {
    return this.getFilterObject('chart', 'party');
  }),

  emailQuery: Ember.computed('queryFilters', function () {
    return this.getFilterObject('chart', 'email');
  }),

  phoneQuery: Ember.computed('queryFilters', function () {
    return this.getFilterObject('chart', 'phone');
  }),

  facebookQuery: Ember.computed('queryFilters', function () {
    return this.getFilterObject('chart', 'facebook');
  }),

  stateQuery: Ember.computed('queryFilters', function () {
    return this.getFilterObject('chart', 'state');
  }),

  municipalityQuery: Ember.computed('queryFilters', function () {
    return this.getFilterObject('chart', 'municipality');
  }),

  sectionQuery: Ember.computed('queryFilters', function () {
    return this.getFilterObject('chart', 'section');
  }),

  totalQuery: Ember.computed('queryFilters', function () {
    return this.getFilterObject('info', 'total');
  }),

  init() {
    this._super(...arguments);
    this.get('session').authorize('authorizer:oauth2', (headerName, headerValue) => {
      this.get('getGeoData').perform(headerName, headerValue);
    });
  },

  getGeoData: task(function* (headerName, headerValue) {
    try {
      this.set('loadingGeoData', true);
      let result = yield this.get('ajax').request(config.localhost + '/api/ine/dashboard', {
        accepts: {
          json: 'application/json'
        },
        headers: {
          [headerName]: headerValue
        },
        data: {
          info: 'geo_data'
        }
      });
      if (result) {
        this.set('states', result);
        if (result.length === 1) {
          this.send('stateSelect', this.get('states')[0]);
        }
      }
    } catch (err) {
      console.log(err)
    } finally {
      this.set('loadingGeoData', false);
    }
  }),

  getFilterObject(key, value) {
    let filters = this.get('queryFilters');
    return Object.assign({
      [key]: value
    }, filters);
  },

  actions: {
    stateSelect(selection) {
      this.set('selectedState', selection);
      this.set('selectedMunicipality', null);
      this.set('selectedSection', null);
      if (selection && selection.id) {
        this.set('municipalities', selection.activeMunis);
        if (selection.activeMunis.length === 1) {
          this.send('municipalitySelect', selection.activeMunis[0]);
        }
      } else {
        this.set('municipalities', []);
      }
    },
    municipalitySelect(selection) {
      this.set('selectedMunicipality', selection);
      this.set('selectedSection', null);
      if (selection) {
        this.set('sections', selection.activeSections);
        if (selection.activeSections.length === 1) {
          this.send('sectionSelect', selection.activeSections[0]);
        }
      } else {
        this.set('sections', []);
      }
    },
    sectionSelect(selection) {
      this.set('selectedSection', selection);
    }
  },
});
