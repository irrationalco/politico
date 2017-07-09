import Ember from 'ember';
import { task, timeout } from 'ember-concurrency';

export default Ember.Component.extend({
	partiesManager: Ember.inject.service("parties"),

	selectedParties: Ember.computed.oneWay('partiesManager.selectedParties'),
	sectionData: null,

	party: { name: null, votes: null, percentage: null },
	others: { name: 'Otros', votes: null, percentage: null },

	dataChanged: Ember.observer('hoveredSection', function() {
		if (this.get('hoveredSection') !== null) {
			let section = this.get('sectionsData').findBy('sectionCode', this.get('hoveredSection').section_code);
			this.set('sectionData', section);
			this.get('computePartyData').perform(section);
		}
	}),

	totalVotes: Ember.computed('sectionData', function() {
		if (!isEmpty(this.get('sectionData'))) {
			return this.get('sectionData').get('totalVotes');
		}
	}),

	computePartyData: task(function * (section) {
		yield timeout(150);
		let party = this.get('party');
		let others = this.get('others');
		let totalVotes = section.get('totalVotes');
		let pct;

		party.name = this.get('selectedParties.firstObject').get('firstObject');
		party.votes = section.get(party.name);
		pct = party.votes / totalVotes * 100;
		party.percentage = Math.round(pct * 10) / 10;

		others.votes = totalVotes - party.votes;
		pct = others.votes / totalVotes * 100;
		others.percentage = Math.round(pct * 10) / 10;

		this.set('party', party);
		this.set('others', others);
		this.get('calculateSingleBar').perform(party, others);

	}).restartable(),

	calculateSingleBar: task(function * () {
		// Code to calculate single bar;
	}).restartable(),

});
