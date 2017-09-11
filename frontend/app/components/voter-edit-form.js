import Ember from 'ember';
import config from '../config/environment';
import { task, timeout } from 'ember-concurrency';

const { isEmpty } = Ember;
const { service } = Ember.inject;

export default Ember.Component.extend({
    ajax: service('ajax'),
    notify: service('notify'),
    store: service('store'),

    actions: {
        create(voter) {
            this.get('ajax').post(config.localhost + '/api/voters', {
                data: {
                    voter: {
                        electoral_code: voter.get('electoral_code'),
                        name: voter.get('name'),
                        first_last_name: voter.get('first_last_name'),
                        second_last_name: voter.get('second_last_name'),
                        date_of_birth: voter.get('date_of_birth'),
                        street: voter.get('street'),
                        outside_number: voter.get('outside_number'),
                        inside_number: voter.get('inside_number'),
                        suburb: voter.get('suburb'),
                        postal_code: voter.get('postal_code'),
                        TIMERES: voter.get('TIMERES'),
                        occupation: voter.get('occupation'),
                        FOL_NAC: voter.get('FOL_NAC'),
                        EN_LN: voter.get('EN_LN'),
                        municipality_name: voter.get('municipality_name'),
                        state: voter.get('state'),
                        district: voter.get('district'),
                        municipality: voter.get('municipality'),
                        section: voter.get('section'),
                        locality: voter.get('locality'),
                        apple: voter.get('apple'),
                        CONS_LC: voter.get('CONS_LC'),
                        EMISIONCRE: voter.get('EMISIONCRE')
                    }
                }
            })
                .then(res => {
                    voter.deleteRecord();
                    this.sendAction('transitionToVoters');
                })
                .catch(err => {
                    this.get('notify').alert("Make sure all fields are filled correctly.")
                });
        },

        update(voter) {
            this.get('ajax').put(config.localhost + '/api/voters/' + voter.get('id'), {
                data: {
                    voter: {
                        electoral_code: voter.get('electoral_code'),
                        name: voter.get('name'),
                        first_last_name: voter.get('first_last_name'),
                        second_last_name: voter.get('second_last_name'),
                        date_of_birth: voter.get('date_of_birth'),
                        street: voter.get('street'),
                        outside_number: voter.get('outside_number'),
                        inside_number: voter.get('inside_number'),
                        suburb: voter.get('suburb'),
                        postal_code: voter.get('postal_code'),
                        TIMERES: voter.get('TIMERES'),
                        occupation: voter.get('occupation'),
                        FOL_NAC: voter.get('FOL_NAC'),
                        EN_LN: voter.get('EN_LN'),
                        municipality_name: voter.get('municipality_name'),
                        state: voter.get('state'),
                        district: voter.get('district'),
                        municipality: voter.get('municipality'),
                        section: voter.get('section'),
                        locality: voter.get('locality'),
                        apple: voter.get('apple'),
                        CONS_LC: voter.get('CONS_LC'),
                        EMISIONCRE: voter.get('EMISIONCRE')
                    }
                }
            })
                .then(res => {
                    voter.deleteRecord();
                    this.sendAction('transitionToVoters');
                })
                .catch(err => {
                    this.get('notify').alert("Make sure all fields are filled correctly.")
                });
        }
    }
});