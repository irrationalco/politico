import Ember from 'ember';

const { isEmpty } = Ember;

export default Ember.Service.extend({

  colors: { PRI: "#ce3a3a", PAN: "#446093", others: "#647329", 
            Morena: "#f36916", PRD: "#e8c230"},

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
  }
});