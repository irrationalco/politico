import Ember from 'ember';

export function readableDate(date) {
    return (date[0].getDate() + 1) + '/' + (date[0].getMonth() + 1) + '/' + date[0].getFullYear();
};

export default Ember.Helper.helper(readableDate);