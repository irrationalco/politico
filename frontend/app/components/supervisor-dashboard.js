import Ember from 'ember';
import FollowerDashboard from './follower-dashboard';
import {
  task
} from 'ember-concurrency';
import config from '../config/environment';

export default FollowerDashboard.extend({

  activeCapturists: [],

  activeStates: [],

  loadingCapturists: false,

  capturists: [],

  selectedCapturist: null,

  parentFilter: null,

  filterOptions: Object.freeze({
    PEOPLE: Symbol('people'),
    GEO: Symbol('geo')
  }),

  setFirstStates: Ember.observer('loadingGeoData', function () {
    this.set('activeStates', this.get('states').slice());
  }),

  parentFilterHandler: Ember.observer('parentFilter', function () {
    Ember.run.once(this, this.refreshFilters);
  }),

  queryFilters: Ember.computed('{selectedCapturist,selectedState,selectedMunicipality,selectedSection}', function () {
    let capturist = this.get('selectedCapturist') || {
      id: ''
    };
    let state = this.get('selectedState') || {
      id: ''
    };
    let muni = this.get('selectedMunicipality') || {
      name: ''
    };
    let section = this.get('selectedSection') || '';
    return {
      capturist: capturist.id,
      state: state.id,
      muni: muni.name,
      section: section
    };
  }),

  queryCapturists: Ember.computed('queryFilters', function () {
    let filters = this.get('queryFilters');
    return Object.assign({
      chart: 'capturists'
    }, filters);
  }),

  init() {
    this._super(...arguments);
    this.get('session').authorize('authorizer:oauth2', (headerName, headerValue) => {
      this.get('getCapturists').perform(headerName, headerValue);
    });
  },

  getCapturists: task(function* (headerName, headerValue) {
    try {
      this.set('loadingCapturists', true);
      let result = yield this.get('ajax').request(config.localhost + '/api/ine/dashboard', {
        accepts: {
          json: 'application/json'
        },
        headers: {
          [headerName]: headerValue
        },
        data: {
          info: 'capturists'
        }
      });
      if (result) {
        this.set('capturists', result);
        this.set('activeCapturists', result);
      }
    } catch (err) {
      console.log(err)
    } finally {
      this.set('loadingCapturists', false);
    }
  }),

  refreshFilters() {
    const pf = this.get('parentFilter');
    const fOpt = this.get('filterOptions');
    if (pf === fOpt.PEOPLE) {
      this.filterGeoByPeople();
    } else if (pf === fOpt.GEO) {
      this.filterPeopleByGeo();
    } else {
      this.set('activeCapturists', this.get('capturists').slice());
      this.set('activeStates', this.get('states').slice());
    }
  },

  filterPeopleByGeo() {
    const state = this.get('selectedState');
    const muni = this.get('selectedMunicipality');
    const sect = this.get('selectedSection');
    var res = this.get('capturists').filter((capt) => state.id in capt.activeStates);
    if (muni) {
      res = res.filter((capt) => muni.name in capt.activeStates[state.id].activeMunis);
    }
    if (sect) {
      res = res.filter((capt) => sect in capt.activeStates[state.id].activeMunis[muni.name].activeSections);
    }
    this.set('activeCapturists', res);
  },

  filterGeoByPeople() {
    const capt = this.get('selectedCapturist');
    this.set('activeStates', this.get('states').filter((state) => state.id in capt.activeStates));
  },

  actions: {
    capturistSelect(selection) {
      this.set('selectedCapturist', selection);
      const fOpt = this.get('filterOptions');
      if (selection) {
        if (!this.get('parentFilter')) {
          this.set('parentFilter', fOpt.PEOPLE);
        } else if (this.get('parentFilter') === fOpt.PEOPLE) {
          this.refreshFilters();
        }
      } else {
        if (this.get('parentFilter') === fOpt.PEOPLE) {
          this.set('parentFilter', this.get('selectedState') ? fOpt.GEO : null);
        }
      }
    },
    stateSelect(selection) {
      this._super(selection);
      const fOpt = this.get('filterOptions')
      if (selection) {
        if (!this.get('parentFilter')) {
          this.set('parentFilter', fOpt.GEO);
        } else if (this.get('parentFilter') === fOpt.GEO) {
          this.refreshFilters();
        }
      } else {
        if (this.get('parentFilter') === fOpt.GEO) {
          this.set('parentFilter', this.get('selectedCapturist') ? fOpt.PEOPLE : null);
        }
      }
    }
  },
});
