import Ember from 'ember';
import {
  task
} from 'ember-concurrency';

export default Ember.Component.extend({

  actions: {},

  noPoints: {
    points: false,
    curve: false
  },

  stateClickOption: null,

  selectedState: null,

  selectedMunicipality: null,

  municipalityClickOption: null,

  municipalityQuery: Ember.computed('selectedState', function () {
    let state = this.get('selectedState');
    return `municipality.${state}`
  }),

  sectionQuery: Ember.computed('selectedState', 'selectedMunicipality', function () {
    let state = this.get('selectedState');
    let muni = this.get('selectedMunicipality');
    return `section.${state}.${muni}`
  }),

  init() {
    this._super(...arguments);
    var stateClickFunction = (event, activeElm) => {
      if(this.get('selectedState') === activeElm[0]._model.label){
        return;
      }
      this.set('selectedState', activeElm[0]._model.label)
      this.set('selectedMunicipality', null)
    };
    this.set('stateClickOption', {
      library: {
        onClick: stateClickFunction.bind(this)
      }
    });

    var municipalityClickFunction = (event, activeElm) => {
      if(this.get('selectedMunicipality') === activeElm[0]._model.label){
        return;
      }
      this.set('selectedMunicipality', activeElm[0]._model.label)
    };
    this.set('municipalityClickOption', {
      library: {
        onClick: municipalityClickFunction.bind(this)
      }
    });
  }
});
