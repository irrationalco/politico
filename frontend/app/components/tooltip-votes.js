import Ember from 'ember';
import { task, timeout } from 'ember-concurrency';
const { isEmpty } = Ember;

export default Ember.Component.extend({
	parties: Ember.inject.service(),

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
			this.get('parties').get('colors')[this.get('firstParty.name')] + ";");
	}),

	secondPartyColor: Ember.computed('secondParty', function() {
		return Ember.String.htmlSafe("background-color: " + 
			this.get('parties').get('colors')[this.get('secondParty.name')] + ";");
	}),

	computeTopParties: task(function * (section) {

		yield timeout(150);

		let currParties = this.get('parties').get('partiesNames');
		let totalVotes = section.get('totalVotes');

		let firstParty = { name: null, votes: null, percentage: null };
		let secondParty = { name: null, votes: null, percentage: null };
		let thirdParty = { name: null, votes: null, percentage: null };
		let others = { name: "Otros", votes: null, percentage: null };

		// Getting top party
		let firstName = this.get('parties').getMaxParty(currParties, section);
		currParties = currParties.filter(function(el) {
			return el !== firstName;
		});
		firstParty.name = firstName;
		firstParty.votes = section.get(firstName);
		firstParty.percentage = Math.round(firstParty.votes / totalVotes * 100);

		// Getting second place party
		let secondName = this.get('parties').getMaxParty(currParties, section);
		currParties = currParties.filter(function(el) {
			return el !== secondName;
		});
		secondParty.name = secondName;
		secondParty.votes = section.get(secondName);
		secondParty.percentage = Math.round(secondParty.votes / totalVotes * 100);

		// Getting third place party
		let thirdName = this.get('parties').getMaxParty(currParties, section);
		currParties = currParties.filter(function(el) {
			return el !== thirdName;
		});
		thirdParty.name = thirdName;
		thirdParty.votes = section.get(thirdName);
		thirdParty.percentage = Math.round(thirdParty.votes / totalVotes * 100);

		// Calculating other parties votes and percent
		others.votes = this.calculateOthersTotalVotes(currParties, section);
		others.percentage = Math.round(others.votes / totalVotes * 100);

		// Setting computed vars
		this.set('firstParty', firstParty);
		this.set('secondParty', secondParty);
		this.set('thirdParty', thirdParty);
		this.set('others', others);
	
	}).restartable(),

	
	calculateOthersTotalVotes(parties, section) {
		let total = 0;
		parties.forEach(party => {
			total = total + section.get(party);
		});
		return total;
	}
});