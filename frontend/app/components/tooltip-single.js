import Ember from 'ember';
import { task, timeout } from 'ember-concurrency';


export default Ember.Component.extend({
	partiesManager: Ember.inject.service("parties"),

	selectedParties: Ember.computed.oneWay('partiesManager.selectedParties'),

	party: { name: null, votes: null, percentage: null, color: null },
	others: { name: 'Otros', votes: null, percentage: null, color: null },
	percentageBar: null,

	dataChanged: Ember.observer('sectionData', function() {
		this.get('computePartyData').perform(this.get('sectionData'));
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
		party.color = this.get('partiesManager').get('colors')[party.name];

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
	}).restartable()

});
