import Ember from 'ember';
import { task } from 'ember-concurrency';

const { isEmpty } = Ember;

export default Ember.Service.extend({

  pollId:         0,
  totalSections:  0,
  currentSection: 0,
  sectionIds:     [],

  setPollId(id) {
    this.set('pollId', id);
  },

  setSections(sections) {
    this.set('sectionIds', sections);
  },

  setTotalSections(total) {
    this.set('totalSections', total);
  },

  debugValues() {
    console.log("--- Poll Manager ---");
    console.log("Poll Id: " + this.get('pollId'));
    console.log("Total Sections: " + this.get('totalSections'));
    console.log("Current Section: " + this.get('currentSection'));
    console.log("Section Ids: " + this.get('sectionIds'));
  }

});