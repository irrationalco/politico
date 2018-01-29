import Ember from 'ember';
import SupervisorDashboard from './supervisor-dashboard';
import {
  task
} from 'ember-concurrency';
import config from '../config/environment';
const {
  service
} = Ember.inject;

export default SupervisorDashboard.extend({

  actions: {
    supervisorSelect(selection) {
      this.set('selectedSupervisor', selection);
    },
  },

  //region supervisor

  loadingSupervisors: false,

  supervisors: [],

  selectedSupervisor: null,

  getSupervisors: task(function* (headerName, headerValue) {
    try {
      this.set('loadingSupervisors', true);
      let result = yield this.get('ajax').request(config.localhost + '/api/ine/dashboard', {
        accepts: {
          json: 'application/json'
        },
        headers: {
          [headerName]: headerValue
        },
        data: {
          info: 'supervisors'
        }
      });
      if (result) {
        this.set('supervisors', result);
      }
    } catch (err) {
      console.log(err)
    } finally {
      this.set('loadingSupervisors', false);
    }
  }),

  //endregion


  queryFilters: Ember.computed('{selectedSupervisor,selectedCapturist,selectedState,selectedMunicipality,selectedSection}', function () {
    let supervisor = this.get('selectedSupervisor') || {
      id: ''
    };
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
      supervisor: supervisor.id,
      capturist: capturist.id,
      state: state.id,
      muni: muni.name,
      section: section
    };
  }),
});
