import Ember from 'ember';
import { task, timeout } from 'ember-concurrency';

const { isEmpty } = Ember;

export default Ember.Component.extend({
	partiesManager: Ember.inject.service("parties"),

	selectedParties: Ember.computed.oneWay('partiesManager.selectedParties'),
	sectionData: null,

	party: { name: null, votes: null, percentage: null },
	others: { name: 'Otros', votes: null, percentage: null },
	percentageBar: null,

	dataChanged: Ember.observer('hoveredSection', function() {
		if (!isEmpty(this.get('hoveredSection')) && !isEmpty(this.get('sectionsData'))) {
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
		let party = { name: null, votes: null, percentage: null };
		let others = { name: null, votes: null, percentage: null };
		let totalVotes = section.get('totalVotes');
		let pct;
		
		party.name = this.get('selectedParties')[0];
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

	calculateSingleBar: task(function * (party, others) {
		let partyColor = this.get('partiesManager').get('colors')[party.name];
		let othersColor = this.get('partiesManager').get('colors')["others"];

		let barFirstPart = [partyColor + " " + 0 + "%,", partyColor + " " + party.percentage + "%,"];
		let barSecondPart = [othersColor + " " + party.percentage + "%,", othersColor + " " + 100 + "%);"];

		let bar = Ember.String.htmlSafe("background: linear-gradient(to right, " + barFirstPart[0] + barFirstPart[1] 
																	+ barSecondPart[0] + barSecondPart[1]);

		this.set('percentageBar', bar);
	}).restartable(),

});
