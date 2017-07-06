import Ember from 'ember';
import { task, timeout } from 'ember-concurrency';
const { isEmpty } = Ember;

export default Ember.Component.extend({
	partiesManager: Ember.inject.service("parties"),

	firstParty:  null,
	secondParty: null,
	thirdParty:  null,
	others: 	 null,

	more30: null,
	less30: null,
	masc: null,
	fem: null,

	isSingle: Ember.computed('visualization', function() {
		if (this.get('visualization') === "single") {
			return true;
		} else {
			return false;
		}
	}),

	isComparison: Ember.computed('visualization', function() {
		if (this.get('visualization') === "comparison") {
			return true;
		} else {
			return false;
		}
	}),

	calculateShit: Ember.observer('hoveredSection', function() {
		let less30 = Math.floor(Math.random() * 100) + 1;
		let more30 = 100 - less30;
		let fem = Math.floor(Math.random() * 100) + 1;
		let masc = 100 - fem;

		this.set('less30', less30);
		this.set('more30', more30);
		this.set('fem', fem);
		this.set('masc', masc);
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

	isNormal: Ember.computed('visualization', function() {
		if (this.get("visualization") === "normal") {
			return true;
		} else {
			return false;
		}
	}),

	sectionData: Ember.computed('hoveredSection', function() {
		if (this.get('hoveredSection') !== null) {
			let section = this.get('sectionsData').findBy('sectionCode', this.get('hoveredSection').section_code);
			this.get('computeTopParties').perform(section);
			return section;
		} else {
			return null;
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