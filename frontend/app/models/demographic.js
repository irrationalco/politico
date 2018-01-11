import DS from 'ember-data';

export default DS.Model.extend({
	sectionCode: 	DS.attr('number'),
	muniCode: 	 	DS.attr('number'),
	stateCode: 	 	DS.attr('number'),
	districtCode: 	DS.attr('number'),
	year: 			DS.attr('number'),
	hombres:        DS.attr('number'),
	hijos: 			DS.attr('number'),
	entidad_nac:    DS.attr('number'),
	entidad_ant:    DS.attr('number'),
	limitacion:     DS.attr('number'),
	analfabetismo:  DS.attr('number'),
	educacion_av:   DS.attr('number'),
	pea:            DS.attr('number'),
	no_serv_salud:  DS.attr('number'),
	matrimonios:    DS.attr('number'),
	hogares:        DS.attr('number'),
	hogares_jefa:   DS.attr('number'),
	hogares_pob:    DS.attr('number'),
	auto:           DS.attr('number')
});
