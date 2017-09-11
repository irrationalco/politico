import DS from 'ember-data';

export default DS.Model.extend({
    electoral_code: DS.attr('string'),
    name: DS.attr('string'),
    first_last_name: DS.attr('string'),
    second_last_name: DS.attr('string'),
    date_of_birth: DS.attr('string'),
    street: DS.attr('string'),
    outside_number: DS.attr('string'),
    inside_number: DS.attr('string'),
    suburb: DS.attr('string'),
    postal_code: DS.attr('number'),
    TIMERES: DS.attr('number'),
    occupation: DS.attr('string'),
    FOL_NAC: DS.attr('number'),
    EN_LN: DS.attr('boolean'),
    municipality_name: DS.attr('string'),
    state: DS.attr('number'),
    district: DS.attr('number'),
    municipality: DS.attr('number'),
    section: DS.attr('number'),
    locality: DS.attr('number'),
    apple: DS.attr('number'),
    CONS_LC: DS.attr('number'),
    EMISIONCRE: DS.attr('number')
});