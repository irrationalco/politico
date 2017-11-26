import Ember from 'ember';
import { task, timeout } from 'ember-concurrency';

export default Ember.Component.extend({
	partiesManager: Ember.inject.service("parties"),

	selectedParties: Ember.computed.oneWay('partiesManager.selectedParties'),

	firstParty: { name: null, votes: null, percentage: null, color: null },
	secondParty: { name: null, votes: null, percentage: null, color: null },
	others: { name: "Otros", votes: null, percentage: null, color: null },
	percentageBar: null,

	dataChanged: Ember.observer('sectionData', function() {
		this.get('computeComparisonData').perform(this.get('sectionData'));
	}),

	computeComparisonData: task(function * (section) {
		yield timeout(150);

		let parties = this.get('selectedParties');
		let firstParty = { name: null, votes: null, percentage: null, color: null };
		let secondParty = { name: null, votes: null, percentage: null, color: null };
		let others = { name: "Otros", votes: null, percentage: null,color: null };
		let totalVotes = this.get('sectionData').get('totalVotes');
		let pct, partiesVotes;

		firstParty.name = this.get('partiesManager').getMaxParty(parties, section);
		parties = parties.filter(function(el) { return el !== firstParty.name; });
		firstParty.votes = section.get(firstParty.name);
		partiesVotes += firstParty.votes;
		pct = firstParty.votes / totalVotes * 100;
		firstParty.percentage = Math.round(pct * 10) / 10;
		firstParty.color = this.get('partiesManager').get('colors')[firstParty.name];

		secondParty.name = parties[0];
		secondParty.votes = section.get(secondParty.name);
		partiesVotes += secondParty.votes;
		pct = secondParty.votes / totalVotes * 100;
		secondParty.percentage = Math.round(pct * 10) / 10;
		secondParty.color = this.get('partiesManager').get('colors')[secondParty.name];

		others.votes = totalVotes - partiesVotes;
		pct = others.votes / totalVotes * 100;
		others.percentage = Math.round(pct * 10) / 10;

		this.set('firstParty', firstParty);
		this.set('secondParty', secondParty);
		this.set('others', others);
		this.get('calculateComparisonBar').perform(firstParty, secondParty, others);

	}).restartable(),

	calculateComparisonBar: task(function * (firstParty, secondParty, others) {
		let firstPartyColor = this.get('partiesManager').get('colors')[firstParty.name];
		let secondPartyColor = this.get('partiesManager').get('colors')[secondParty.name];
		let othersColor = "#cacaca";

		let start = 0;
		let stop = firstParty.percentage;
		let barFirstPart = [firstPartyColor + " " + start + "%,", firstPartyColor + " " + stop + "%,"];

		start = stop;
		stop += secondParty.percentage;
		let barSecondPart = [secondPartyColor + " " + start + "%,", secondPartyColor + " " + stop + "%,"];

		start = stop;
		stop = 100;
		let barLastPart = [othersColor + " " + start + "%,", othersColor + " " + stop + "%);"];

		let bar = Ember.String.htmlSafe("background: linear-gradient(to right, " + barFirstPart[0] + barFirstPart[1] + barSecondPart[0] + barSecondPart[1] + barLastPart[0] + barLastPart[1]);
		
		this.set('percentageBar', bar);

	}).restartable()
});
