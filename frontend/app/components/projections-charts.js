import Ember from 'ember';

export default Ember.Component.extend({

  actions: {
        toggle: function(){
            var pane = $("#charts-panel");
            if(parseInt(pane.css("right"))===0){
              pane.animate({right: "-250"});
            }else{
              pane.animate({right: "0"});
            }
        }
    },

  sectionData: Ember.computed('hoveredSection', function() {
    if (this.get('hoveredSection') !== null) {
      let section = this.get('sectionsData').findBy('sectionCode', this.get('hoveredSection').section_code);
      this.get('computeTopParties').perform(section);
      return section;
    } else {
      return null;
    }
  }),

  init() {
    this._super(...arguments);
  },

  didReceiveAttrs() {
    this._super(...arguments);
  },

  didUpdateAttrs() {
    this._super(...arguments);
  },

  didInsertElement() {
    this._super(...arguments);
  }

});
