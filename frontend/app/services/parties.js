import Ember from 'ember';

const { isEmpty } = Ember;

export default Ember.Service.extend({

  colors: { PRI: "#b71c1c", PAN: "#377eb8", others: "#4daf4a", 
            Morena: "#ff7f00", PRD: "#ffff33"},

  partiesNames: ["PRI", "PAN", "PRD", "Morena"],

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
    let party = this.getMaxParty(this.get('partiesNames'), section);
    return this.get('colors')[party];
  }
});