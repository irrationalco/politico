import DS from 'ember-data';

export default DS.Model.extend({
	sectionCode: 	DS.attr('number'),
	muniCode: 	 	DS.attr('number'),
	stateCode: 	 	DS.attr('number'),
	districtCode: DS.attr('number'),
	year: 				DS.attr('number'),
	electionType: DS.attr('string'),
	totalVotes: 	DS.attr('number'),
	nominalList: 	DS.attr('number'),

	PAN: 	 DS.attr('number'),
	PCONV: DS.attr('number'),
	PES: 	 DS.attr('number'),
	PH: 	 DS.attr('number'),
	PMC: 	 DS.attr('number'),
	PMOR:  DS.attr('number'),
	PNA: 	 DS.attr('number'),
	PPM: 	 DS.attr('number'),
	PRD: 	 DS.attr('number'),
	PRI: 	 DS.attr('number'),
	PSD: 	 DS.attr('number'),
	PSM: 	 DS.attr('number'),
	PT: 	 DS.attr('number'),
	PVEM:  DS.attr('number')
});