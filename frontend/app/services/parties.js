import Ember from 'ember';
import { task } from 'ember-concurrency';

const { isEmpty } = Ember;

export default Ember.Service.extend({

  colors: { PRI: "#4cf99", PAN: "#578eff", others: "#9a999a", 
            PMOR: "#ff4d59", PRD: "#ffdb4e", PCONV: "#ffb97b",
            PVEM: "#c6ff86", PT: "#ff756e", PMC: "#ff8e72", PES: "#a200ff",
            PH: "#ffabdd", PNA: "#00a3cc", PSD: "#ff5653", PPM: "#4dceff", PSM:"#802926" },

  parties: ["PAN", "PCONV", "PES", "PH", "PMC", "PMOR", "PNA",
            "PPM", "PRD", "PRI", "PSD", "PSM", "PT", "PVEM"],

  selectedParties: ["PRI", "PAN", "PRD", "PMOR"],

  getMaxParty(parties, section) {
    let max = null;
    parties.forEach(party => {
      if (max === null) { 
        max = party; 
      } else if (section.get(party) > section.get(max)) {
        max = party
      }
    });
    return max;
  },

  getColor(section) {
    let party = this.getMaxParty(this.get('selectedParties'), section);
    return this.get('colors')[party];
  },

  getComparisonColor(parties, section) {
    let color = { hex: "", isGradient: false };
    let totalVotes = section.get(parties[0]) + section.get(parties[1]);
    let percentOne = Math.round(section.get(parties[0]) / totalVotes * 100);
    let percentTwo = Math. round(section.get(parties[1]) / totalVotes * 100);
    let diff = percentOne - percentTwo;
    if (diff < 10) {
      color["hex"] = this.getGradientColor(this.get('colors')[parties[0]], this.get('colors')[parties[1]]);
      color["isGradient"] = true;
      return color;
    } else {
      color["hex"] = this.get('colors')[parties[0]]
      return color;
    }
  },

  computeComparison(section) {
    let sP = this.get('selectedParties');
    let parties = []
    if (section.get(sP[1]) > section.get(sP[0])) {
      return [sP[1], sP[0]];
    } else {
      return sP;
    }
  },

  setSelectedParties(selectedParties) {
    this.set('selectedParties', selectedParties);
  },

  getGradientColor(color1, color2) {
    if (color1.charAt(0) === "#") { color1 = color1.substring(1); }

    if (color2.charAt(0) === "#") { color2 = color2.substring(1); }

    let ratio = 0.5;

    let r = Math.ceil(parseInt(color1.substring(0,2), 16) * ratio + parseInt(color2.substring(0,2), 16) * (1-ratio));
    let g = Math.ceil(parseInt(color1.substring(2,4), 16) * ratio + parseInt(color2.substring(2,4), 16) * (1-ratio));
    let b = Math.ceil(parseInt(color1.substring(4,6), 16) * ratio + parseInt(color2.substring(4,6), 16) * (1-ratio));

    return this.hex(r) + this.hex(g) + this.hex(b);
  },

  hex(x) {
    x = x.toString(16);
    return (x.length == 1) ? '0' + x : x;
  }
});