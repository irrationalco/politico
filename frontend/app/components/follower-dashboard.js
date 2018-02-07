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

  //region geoData

  loadingGeoData: false,

  states: [],

  selectedState: null,

  municipalities: [],

  selectedMunicipality: null,

  sections: [],

  selectedSection: null,

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

  //endregion

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

  //region querys

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
    let filters = this.get('queryFilters');
    return Object.assign({
      chart: 'gender'
    }, filters);
  }),

  dateOfBirthQuery: Ember.computed('queryFilters', function () {
    let filters = this.get('queryFilters');
    return Object.assign({
      chart: 'date_of_birth'
    }, filters);
  }),

  edLevelQuery: Ember.computed('queryFilters', function () {
    let filters = this.get('queryFilters');
    return Object.assign({
      chart: 'ed_level'
    }, filters);
  }),

  addedMonthQuery: Ember.computed('queryFilters', function () {
    let filters = this.get('queryFilters');
    return Object.assign({
      chart: 'added_month'
    }, filters);
  }),

  addedWeekQuery: Ember.computed('queryFilters', function () {
    let filters = this.get('queryFilters');
    return Object.assign({
      chart: 'added_week'
    }, filters);
  }),

  addedDayQuery: Ember.computed('queryFilters', function () {
    let filters = this.get('queryFilters');
    return Object.assign({
      chart: 'added_day'
    }, filters);
  }),

  ocupationQuery: Ember.computed('queryFilters', function () {
    let filters = this.get('queryFilters');
    return Object.assign({
      chart: 'ocupation'
    }, filters);
  }),

  partyQuery: Ember.computed('queryFilters', function () {
    let filters = this.get('queryFilters');
    return Object.assign({
      chart: 'party'
    }, filters);
  }),

  emailQuery: Ember.computed('queryFilters', function () {
    let filters = this.get('queryFilters');
    return Object.assign({
      chart: 'email'
    }, filters);
  }),

  phoneQuery: Ember.computed('queryFilters', function () {
    let filters = this.get('queryFilters');
    return Object.assign({
      chart: 'phone'
    }, filters);
  }),

  facebookQuery: Ember.computed('queryFilters', function () {
    let filters = this.get('queryFilters');
    return Object.assign({
      chart: 'facebook'
    }, filters);
  }),

  stateQuery: Ember.computed('queryFilters', function () {
    let filters = this.get('queryFilters');
    return Object.assign({
      chart: 'state'
    }, filters);
  }),

  municipalityQuery: Ember.computed('queryFilters', function () {
    let filters = this.get('queryFilters');
    return Object.assign({
      chart: 'municipality'
    }, filters);
  }),

  sectionQuery: Ember.computed('queryFilters', function () {
    let filters = this.get('queryFilters');
    return Object.assign({
      chart: 'section'
    }, filters);
  }),

  totalQuery: Ember.computed('queryFilters', function () {
    let filters = this.get('queryFilters');
    return Object.assign({
      info: 'total'
    }, filters);
  }),

  //endregion

  init() {
    this._super(...arguments);
    this.get('session').authorize('authorizer:oauth2', (headerName, headerValue) => {
      this.get('getGeoData').perform(headerName, headerValue);
    });
  }
});
