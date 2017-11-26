import Ember from 'ember';

export function readableDate(date) {
    if(!date[0]) {
        return null;
    }
    return (date[0].getDate() + '/' + (date[0].getMonth() + 1) + '/' + date[0].getFullYear());
}

export default Ember.Helper.helper(readableDate);