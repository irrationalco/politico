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
        this.get('session').authorize('authorizer:oauth2', (headerName, headerValue) => {
          this.get('getMunicipalities').perform(headerName, headerValue);
        });
      } else {
        if(!this.get('municipalities').length){
          return;
        }
        this.set('municipalities', []);
      }
    },
    municipalitySelect(selection) {
      this.set('selectedMunicipality', selection);
      this.set('selectedSection', null);
      if (selection){
        this.get('session').authorize('authorizer:oauth2', (headerName, headerValue) => {
          this.get('getSections').perform(headerName, headerValue);
        });
      }else{
        if(!this.get('sections').length){
          return;
        }
        this.set('sections', []);
      }
    },
    sectionSelect(selection){
      this.set('selectedSection', selection);
    }
  },

  states: [],

  selectedState: null,

  getStates: task(function* (headerName, headerValue) {
    try {
      let result = yield this.get('ajax').request(config.localhost + '/api/ine/dashboard', {
        accepts: {
          json: 'application/json'
        },
        headers: {
          [headerName]: headerValue
        },
        data: {
          info: 'states'
        }
      });
      if (result) {
        this.set('states', result);
      }
    } catch (err) {
      console.log(err)
    }
  }),

  municipalities: [],

  selectedMunicipality: null,

  getMunicipalities: task(function* (headerName, headerValue) {
    try {
      let state = this.get('selectedState');
      let result = yield this.get('ajax').request(config.localhost + '/api/ine/dashboard', {
        accepts: {
          json: 'application/json'
        },
        headers: {
          [headerName]: headerValue
        },
        data: {
          info: `municipalities.${state.id}`
        }
      });
      if (result) {
        this.set('municipalities', result);
      }
    } catch (err) {
      console.log(err)
    }
  }),

  sections: [],

  selectedSection: null,

  getSections: task(function* (headerName, headerValue) {
    try {
      let state = this.get('selectedState');
      let municipality = this.get('selectedMunicipality');
      let result = yield this.get('ajax').request(config.localhost + '/api/ine/dashboard', {
        accepts: {
          json: 'application/json'
        },
        headers: {
          [headerName]: headerValue
        },
        data: {
          info: `sections.${state.id}.${municipality}`
        }
      });
      if (result) {
        this.set('sections', result);
      }
    } catch (err) {
      console.log(err)
    }
  }),

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

  queryFilters: Ember.computed('{selectedState,selectedMunicipality,selectedSection}', function(){
    let state = this.get('selectedState') || {id: ''};
    let muni = this.get('selectedMunicipality') || '';
    let section = this.get('selectedSection') || '';
    return {state: state.id, muni:muni, section: section};
  }),

  genderQuery: Ember.computed('queryFilters', function(){
    let filters = this.get('queryFilters');
    return Object.assign({chart: 'gender'}, filters);
  }),

  dateOfBirthQuery: Ember.computed('queryFilters', function(){
    let filters = this.get('queryFilters');
    return Object.assign({chart: 'date_of_birth'}, filters);
  }),

  edLevelQuery: Ember.computed('queryFilters', function(){
    let filters = this.get('queryFilters');
    return Object.assign({chart: 'ed_level'}, filters);
  }),

  addedMonthQuery: Ember.computed('queryFilters', function(){
    let filters = this.get('queryFilters');
    return Object.assign({chart: 'added_month'}, filters);
  }),

  addedWeekQuery: Ember.computed('queryFilters', function(){
    let filters = this.get('queryFilters');
    return Object.assign({chart: 'added_week'}, filters);
  }),

  addedDayQuery: Ember.computed('queryFilters', function(){
    let filters = this.get('queryFilters');
    return Object.assign({chart: 'added_day'}, filters);
  }),

  ocupationQuery: Ember.computed('queryFilters', function(){
    let filters = this.get('queryFilters');
    return Object.assign({chart: 'ocupation'}, filters);
  }),

  partyQuery: Ember.computed('queryFilters', function(){
    let filters = this.get('queryFilters');
    return Object.assign({chart: 'party'}, filters);
  }),

  emailQuery: Ember.computed('queryFilters', function(){
    let filters = this.get('queryFilters');
    return Object.assign({chart: 'email'}, filters);
  }),

  phoneQuery: Ember.computed('queryFilters', function(){
    let filters = this.get('queryFilters');
    return Object.assign({chart: 'phone'}, filters);
  }),

  facebookQuery: Ember.computed('queryFilters', function(){
    let filters = this.get('queryFilters');
    return Object.assign({chart: 'facebook'}, filters);
  }),

  stateQuery: {chart: 'state'},

  municipalityQuery: Ember.computed('selectedState', function(){
    let state = this.get('selectedState') || {id: null};
    return {chart: 'municipality', state: state.id};
  }),
  
  sectionQuery: Ember.computed('selectedMunicipality', function(){
    let state = this.get('selectedState') || {id: null};
    let muni = this.get('selectedMunicipality') || '';
    return {chart: 'section', state: state.id, municipality: muni};
  }),

  totalQuery: Ember.computed('queryFilters', function(){
    let filters = this.get('queryFilters');
    return Object.assign({info: 'total'}, filters);
  }),

  init() {
    this._super(...arguments);
    this.get('session').authorize('authorizer:oauth2', (headerName, headerValue) => {
      this.get('getStates').perform(headerName, headerValue);
    });
  }
});
