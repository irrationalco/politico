import Ember from 'ember';
import d3 from "npm:d3";
import topojson from "npm:topojson";
import { task, timeout } from 'ember-concurrency';

const { isEmpty } = Ember;

export default Ember.Service.extend({

  states: null,

  municipalities: null,
  municipalitiesBorders: null,

  sections: null,

  federalDistricts: null,
  federalDistrictsBorders: null,

  // Function that gets a specific state object by name and loads it municipalities
  getState: task(function * (stateName) {
    try {
      if (isEmpty(this.get('states'))) { let states = yield this.get('loadStatesData').perform(); }

      let state = this.get('states').filterBy('properties.state_name', stateName);

      if (isEmpty(state)) {
        throw new Error("El código del estado es incorrecto.");
      } else {
        let stateCode = state[0].properties.state_code;
        let munis = yield this.get('loadMunicipalitiesData').perform(stateCode);
        let fedDistricts = yield this.get('loadFederalDistrictsData').perform(stateCode);
        return state[0];
      }
    } catch(e) {
      console.log(e);
    }
  }),

  // Function that gets a specific district object by code and loads its sections
  getFederalDistrict: task(function * (districtCode, stateCode) {
    try {
      if (isEmpty(this.get('federalDistricts'))) { let fedDistrictsData = yield this.get('loadFederalDistrictsData').perform(stateCode); }

      let district = this.get('federalDistricts').filterBy('properties.district_code', parseInt(districtCode));

      if (isEmpty(district)) {
        throw new Error("No existe ese código de distrito para ese estado.");
      } else {
        let sectionsData = yield this.get('loadSectionsData').perform(stateCode, parseInt(districtCode), 'district_code');
        return district[0];
      }
    } catch(e) {
      console.log(e);
    }
  }),

  // Function that gets a specific municipality object by name and loads its sections
  getMunicipality: task(function * (muniName, stateCode) {
    try {
      if (isEmpty(this.get('municipalities'))) { let munisData = yield this.get('loadMunicipalitiesData').perform(stateCode); }

      let muni = this.get('municipalities').filterBy('properties.mun_name', muniName);

      if (isEmpty(muni)) {
        throw new Error("El nombre del municipio es incorrecto. Asegurate que tenga acentos.");
      } else {
        let sectionsData = yield this.get('loadSectionsData').perform(stateCode, muni[0].properties.mun_code, 'mun_code');
        return muni[0];
      }
    } catch(e) {
      console.log(e);
    }
  }),

  // Function that gets a specific section object by section code and municipality code
  getSection: task(function * (stateCode, muniCode, sectionCode) {
    try {
      if (isEmpty(this.get('sections'))) { let sectionsData = yield this.get('loadSectionsData').perform(stateCode, muniCode, 'mun_code'); }

      let section = this.get('sections').filterBy('properties.section_code', parseInt(sectionCode));

      if (isEmpty(section)) {
        throw new Error("El código de la sección seleccionada es incorrecto.");
      } else {
        return section[0];
      }
    } catch(e) {
      console.log(e);
    }
  }),

  // Function that gets a specific section object by section code and federal district code
  getSectionByDistrict: task(function * (stateCode, districtCode, sectionCode) {
    try {
      if (isEmpty(this.get('sections'))) { let sectionsData = yield this.get('loadSectionsData').perform(stateCode, districtCode, 'district_code'); }

      let section = this.get('sections').filterBy('properties.section_code', parseInt(sectionCode));

      if (isEmpty(section)) {
        throw new Error("El código de las ección seleccionada es incorrecto.");
      } else {
        return section[0];
      }
    } catch(e) {
      console.log(e);
    }
  }),

  // Loads all states data and saves it in the 'states' var of this service
  loadStatesData: task(function * () {
    let xhr;
    try {
      xhr = Ember.$.getJSON("../assets/mx_tj.json");
      let res = yield xhr.promise();
      this.set('states', topojson.feature(res, res.objects.states).features);
      return true;

    } finally {
      xhr.abort();
    }
  }),

  // Loads municipalities of an specific state, saves them in 'municipalities' var, calculates its borders and saves them in 'municipalitiesBorders'
  loadMunicipalitiesData: task(function * (stateCode) {
    let xhr;
    try {
      xhr = Ember.$.getJSON("../assets/mx_tj.json");
      let res = yield xhr.promise();

      yield this.set('municipalities', topojson.feature(res, res.objects.municipalities).features.filterBy('properties.state_code', stateCode));
      yield this.set('municipalitiesBorders', topojson.mesh(res, res.objects.municipalities, function(a, b) {
        if (a.properties.state_code === stateCode) { return a !== b; }
      }));
      return true;

    } finally {
      xhr.abort();
    }
  }),

  // Loads federal districts of an specific state, saves them in 'federalDistricts' var, calculates its borders and saves them in 'federalDistrictsBorders'
  loadFederalDistrictsData: task(function * (stateCode) {
    let xhr;
    try {
      xhr = Ember.$.getJSON("../assets/distritos.json");
      let res = yield xhr.promise();

      yield this.set('federalDistricts', topojson.feature(res, res.objects.mx_distrito).features.filterBy('properties.state_code',stateCode));
      yield this.set('federalDistrictsBorders', topojson.mesh(res, res.objects.mx_distrito, function(a, b) {
        if (a.properties.state_code === stateCode) { return a !== b; }
      }));

      return true;

    } finally {
      xhr.abort();
    }
  }),

  // Loads all sections data of municipality or a federal district | property is either: mun_code or district_code
  loadSectionsData: task(function * (stateCode, code, property) {
    let xhr;
    try {
      xhr = Ember.$.getJSON("../assets/secciones.json");
      let res =yield xhr.promise();

      let sections = yield topojson.feature(res, res.objects.secciones).features
                    .filterBy('properties.state_code', stateCode)
                    .filterBy('properties.' + property, code);

      this.set('sections', sections);
      return true;

    } finally {
      xhr.abort();
    }
  })
});

// d3.json("../assets/mx_tj.json", (error, data) => {
//       let municipalities = topojson.feature(data, data.objects.municipalities).features
//         .filterBy("properties.state_code", stateCode);

//       Ember.run.later(this, () => {
//         this.get('muniLayer').selectAll("path")
//         .data(municipalities)
//         .enter().append("path")
//         .attr("d", this.get('path'))
//         .attr("class", "feature")
//         .on("click", function(d) {
//           emberScope.clicked(this, d);
//         });

//         this.get('muniLayer').append("path")
//         .datum(topojson.mesh(data, data.objects.municipalities, function(a, b) {
//           if (a.properties.state_code == stateCode) {
//             return a !== b;
//           }
//         }))
//         .attr("class", "mesh")
//         .attr("d", this.get('path'));

//       }, 300);
//     });
