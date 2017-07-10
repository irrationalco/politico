import Ember from 'ember';
import { task, timeout } from 'ember-concurrency';

const { isEmpty } = Ember;

export default Ember.Component.extend({
	partiesManager: Ember.inject.service("parties"),

	firstParty:  null,
	secondParty: null,
	thirdParty:  null,
	others: 	 null,

	isSingle: Ember.computed('visualization', function() {
		return this.get('visualization') === 'single';
	}),

	isComparison: Ember.computed('visualization', function() {
		return this.get('visualization') === "comparison";
	}),

	isNormal: Ember.computed('visualization', function() {
		return this.get('visualization') === "normal";
	}),

	sectionData: Ember.computed('hoveredSection', function() {
		if (!isEmpty(this.get('hoveredSection')) && !isEmpty(this.get('sectionsData'))) {
			let section = this.get('sectionsData').findBy('sectionCode', this.get('hoveredSection').section_code);
			this.get('computeTopParties').perform(section);
			return section;
		}
	}),

	totalVotes: Ember.computed('sectionData', function() {
		if (!isEmpty(this.get('sectionData'))) {
			return this.get('sectionData').get('totalVotes');
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

	comparisonBar: Ember.computed('others', function() {
		let fpColor = this.get('partiesManager').get('colors')[this.get('firstParty.name')];
		let spColor = this.get('partiesManager').get('colors')[this.get('secondParty.name')];
		let othersColor = this.get('partiesManager').get('colors')["others"];

		let othersPct = this.get('others.percentage') + this.get('thirdParty.percentage');
		let firstPart = [fpColor + " " + 0 + "%,", fpColor + " " + this.get('firstParty.percentage') + "%," ];

		let movement = this.get('firstParty.percentage') + othersPct;

		let secondPart = [othersColor + " " + this.get('firstParty.percentage') + "%,", 
						  othersColor + " " + movement + "%," ];

		let thirdPart = [spColor + " " + movement + "%,", 
						  spColor + " " + 100 + "%);" ];

		return Ember.String.htmlSafe("background: linear-gradient(to right, " + firstPart[0] + firstPart[1] 
									+ secondPart[0] + secondPart[1] + thirdPart[0] +thirdPart[1]);
	}),
	
	computeTopParties: task(function * (section) {
		yield timeout(150);

		let totalVotesParties = 0;
		let parties = this.get('partiesManager').get('parties');
		let totalVotes = section.get('totalVotes');
		
		let pct;

		let firstParty = { name: null, votes: null, percentage: null };
		let secondParty = { name: null, votes: null, percentage: null };
		let thirdParty = { name: null, votes: null, percentage: null };
		let others = { name: "Otros", votes: null, percentage: null };

		// Getting top party
		let firstName = this.get('partiesManager').getMaxParty(parties, section);
		parties = parties.filter(function(el) {
			return el !== firstName;
		});
		firstParty.name = firstName;
		firstParty.votes = section.get(firstName);
		totalVotesParties += firstParty.votes
		pct = firstParty.votes / totalVotes * 100;
		firstParty.percentage = Math.round(pct * 10) / 10;

		// Getting second place party
		let secondName = this.get('partiesManager').getMaxParty(parties, section);
		parties = parties.filter(function(el) {
			return el !== secondName;
		});
		secondParty.name = secondName;
		secondParty.votes = section.get(secondName);
		totalVotesParties += secondParty.votes;
		pct = secondParty.votes / totalVotes * 100;
		secondParty.percentage = Math.round(pct * 10) / 10;

		// Getting third place party
		let thirdName = this.get('partiesManager').getMaxParty(parties, section);
		parties = parties.filter(function(el) {
			return el !== thirdName;
		});
		thirdParty.name = thirdName;
		thirdParty.votes = section.get(thirdName);
		totalVotesParties += thirdParty.votes
		pct = thirdParty.votes / totalVotes * 100;
		thirdParty.percentage = Math.round(pct * 10) / 10;

		// Calculating other parties votes and percent
		others.votes = totalVotes - totalVotesParties;
		pct = others.votes / totalVotes * 100;
		others.percentage = Math.round(pct * 10) / 10;

		// Setting computed vars
		this.set('firstParty', firstParty);
		this.set('secondParty', secondParty);
		this.set('thirdParty', thirdParty);
		this.set('others', others);
	
	}).restartable()
});