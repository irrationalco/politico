import Ember from 'ember';
import { task, timeout } from 'ember-concurrency';
const { isEmpty } = Ember;

export default Ember.Component.extend({
	partiesManager: Ember.inject.service("parties"),

	firstParty:  null,
	secondParty: null,
	thirdParty:  null,
	others: 	 null,

	sectionData: Ember.computed('hoveredSection', function() {
		if (this.get('hoveredSection') !== null) {
			let section = this.get('sectionsData').findBy('sectionCode', this.get('hoveredSection').section_code);
			this.get('computeTopParties').perform(section);
			return section;
		} else {
			return null;
		}
	}),

	firstPartyColor: Ember.computed('firstParty', function() {
		return Ember.String.htmlSafe("background-color: " + 
			this.get('partiesManager').get('colors')[this.get('firstParty.name')] + ";");
	}),

	secondPartyColor: Ember.computed('secondParty', function() {
		return Ember.String.htmlSafe("background-color: " + 
			this.get('partiesManager').get('colors')[this.get('secondParty.name')] + ";");
	}),

	computeTopParties: task(function * (section) {
		yield timeout(150);

		let word = yield this.get('waitShit').perform();

		let totalVotesParties = 0;
		let currParties = this.get('partiesManager').get('parties');
		let totalVotes = section.get('totalVotes');

		let firstParty = { name: null, votes: null, percentage: null };
		let secondParty = { name: null, votes: null, percentage: null };
		let thirdParty = { name: null, votes: null, percentage: null };
		let others = { name: "Otros", votes: null, percentage: null };

		// Getting top party
		let firstName = this.get('partiesManager').getMaxParty(currParties, section);
		currParties = currParties.filter(function(el) {
			return el !== firstName;
		});
		firstParty.name = firstName;
		firstParty.votes = section.get(firstName);
		totalVotesParties += firstParty.votes
		firstParty.percentage = Math.round(firstParty.votes / totalVotes * 100);

		// Getting second place party
		let secondName = this.get('partiesManager').getMaxParty(currParties, section);
		currParties = currParties.filter(function(el) {
			return el !== secondName;
		});
		secondParty.name = secondName;
		secondParty.votes = section.get(secondName);
		totalVotesParties += secondParty.votes
		secondParty.percentage = Math.round(secondParty.votes / totalVotes * 100);

		// Getting third place party
		let thirdName = this.get('partiesManager').getMaxParty(currParties, section);
		currParties = currParties.filter(function(el) {
			return el !== thirdName;
		});
		thirdParty.name = thirdName;
		thirdParty.votes = section.get(thirdName);
		totalVotesParties += thirdParty.votes
		thirdParty.percentage = Math.round(thirdParty.votes / totalVotes * 100);

		// Calculating other parties votes and percent
		others.votes = totalVotes - totalVotesParties;
		others.percentage = Math.round(others.votes / totalVotes * 100);

		// Setting computed vars
		this.set('firstParty', firstParty);
		this.set('secondParty', secondParty);
		this.set('thirdParty', thirdParty);
		this.set('others', others);
	
	}).restartable(),

	waitShit: task(function * () {
		yield timeout(1000);
		return "MY SHIT";
	})
});