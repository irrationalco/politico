import Ember from 'ember';
import { task } from 'ember-concurrency';

const { isEmpty } = Ember;

export default Ember.Service.extend({

  colors: { PRI: "#b71c1c", PAN: "#377eb8", others: "#4daf4a", 
            Morena: "#ff7f00", PRD: "#ffff33"},

  parties: ["PRI", "PAN","PRD", "Morena"],

  selectedParties: ["PRI", "PAN", "PRD", "Morena"],

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
    let totalVotes = section.get(parties[0]) + section.get(parties[1]);
    let percentOne = Math.round(section.get(parties[0]) / totalVotes * 100);
    let percentTwo = Math. round(section.get(parties[1]) / totalVotes * 100);
    let diff = percentOne - percentTwo;
    if (diff < 10) {
      return [this.getGradientColor(this.get('colors')[parties[0]], this.get('colors')[parties[1]]), true];
    } else {
      return [this.get('colors')[parties[0]], false];
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