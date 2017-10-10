import Ember from 'ember';
import config from '../config/environment';
import { task, timeout } from 'ember-concurrency';

const { isEmpty } = Ember;
const { service } = Ember.inject;

export default Ember.Component.extend({
    ajax: service('ajax'),
    notify: service('notify'),
    store: service('store'),
    session: service('session'),

    voterObject(voter, headerName, headerValue) {
        var tmp = this.get('session.currentUser');
        debugger;
        return {
            headers: {
                [headerName]: headerValue
            },
            data: {
                voter: {
                    user_id: this.get('session.currentUser').id,

                    electoral_id_number: voter.get('electoral_id_number'),
                    expiration_date: voter.get('expiration_date'),

                    first_name: voter.get('first_name'),
                    second_name: voter.get('second_name'),
                    first_last_name: voter.get('first_last_name'),
                    second_last_name: voter.get('second_last_name'),
                    gender: voter.get('gender') || "H",
                    date_of_birth: voter.get('date_of_birth'),
                    electoral_code: voter.get('electoral_code'),
                    CURP: voter.get('CURP'),

                    section: voter.get('section'),
                    street: voter.get('street'),
                    outside_number: voter.get('outside_number'),
                    inside_number: voter.get('inside_number'),
                    suburb: voter.get('suburb'),
                    locality_code: voter.get('locality_code'),
                    locality: voter.get('locality'),
                    municipality_code: voter.get('municipality_code'),
                    municipality: voter.get('municipality'),
                    state_code: voter.get('state_code'),
                    state: voter.get('state'),
                    postal_code: voter.get('postal_code'),

                    home_phone: voter.get('home_phone'),
                    mobile_phone: voter.get('mobile_phone'),
                    email: voter.get('email'),
                    alternative_email: voter.get('alternative_email'),
                    facebook_account: voter.get('facebook_account'),

                    highest_educational_level: voter.get('highest_educational_level') || "PRIMARIA",
                    current_ocupation: voter.get('current_ocupation') || "SECTOR PUBLICO",

                    organization: voter.get('organization') || "JOVENES",
                    party_positions_held: voter.get('party_positions_held'),
                    is_part_of_party: voter.get('is_part_of_party'),
                    has_been_candidate: voter.get('has_been_candidate'),
                    popular_election_position: voter.get('popular_election_position'),
                    election_year: voter.get('election_year'),
                    won_election: voter.get('won_election'),
                    election_route: voter.get('election_route') || "MAYORIA RELATIVA",
                    notes: voter.get('notes')
                }
            }
        }
    },

    getYears(ammount) {
        var from = (new Date()).getFullYear()
        var years = [from]
        for (var i = 1; i <= ammount; i++) {
            years.push(from + i);
        }
        return years;
    },

    init() {
        this._super(...arguments);
        this.set('years', this.getYears(10));
    },

    years: [],

    actions: {
        create(voter) {
            this.get('session').authorize('authorizer:oauth2', (headerName, headerValue) => {
                this.get('ajax').post(config.localhost + '/api/voters', this.voterObject(voter, headerName, headerValue))
                    .then(res => {
                        voter.deleteRecord();
                        this.sendAction('transitionToVoters');
                    })
                    .catch(err => {
                        this.get('notify').alert("Make sure all fields are filled correctly.")
                    });
            });
        },

        update(voter) {
            this.get('session').authorize('authorizer:oauth2', (headerName, headerValue) => {
                this.get('ajax').put(config.localhost + '/api/voters/' + voter.get('id'), this.voterObject(voter, headerName, headerValue))
                    .then(res => {
                        voter.deleteRecord();
                        this.sendAction('transitionToVoters');
                    })
                    .catch(err => {
                        this.get('notify').alert("Make sure all fields are filled correctly.")
                    });
            });
        },

        updateGender(voter, value) {
            voter.set('gender', value);
        },

        updateEducation(voter, value) {
            voter.set('highest_educational_level', value);
        },

        updateOcupation(voter, value) {
            voter.set('current_ocupation', value);
        },

        updateOrganization(voter, value) {
            voter.set('organization', value);
        },

        updateElectionRoute(voter, value) {
            voter.set('election_route', value);
        },

        updateExpirationDate(voter, value) {
            voter.set('expiration_date', value);
        }
    }
});