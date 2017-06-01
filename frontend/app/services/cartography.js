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
  getState: task(function * () {
    try {

      if (!this.get('states')) {
        let states = yield this.get('loadSData').perform();
      }

      let state = this.get('states').filterBy('properties.state_name', stateName);

      if (isEmpty(state)) {
        throw new Error("El código del estado es incorrecto.");
      } else {
        let stateCode = state[0].properties.state_code;
        let munis = yield this.get('loadMData').perform(stateCode);
        let fedDistricts = yield this.get('loadFData').perform(stateCode);
        return state[0];
      }
    } catch(e) {
      console.log(e);
    }
  }),

  // Function that gets a specific district object by code and loads its sections
  getFederalDistrict(districtCode, stateCode) {

    return new Promise((resolve,reject) => {
      if (this.get('federalDistricts')) {
        let district = this.get('federalDistricts').filterBy('properties.district_code', parseInt(districtCode));

        if (isEmpty(district)) {
          reject(new Error("No hay ese codigo de distrito para ese estado."));
        } else {
          this.loadSectionsData(stateCode, parseInt(districtCode), 'district_code').then(() => {
            resolve(district[0]);
          });
        }
      } else {
        this.loadFederalDistrictsData(stateCode).then(() => {
          let district = this.get('federalDistricts').filterBy('properties.district_code', parseInt(districtCode));

          if (isEmpty(district)) {
            reject(new Error("No hay ese codigo de distrito para ese estado."));
          } else {
            this.loadSectionsData(stateCode, parseInt(districtCode), 'district_code').then(() => {
              resolve(district[0]);
            });
          }
        });
      }
    });
  },

  // Function that gets a specific municipality object by name and loads its sections
  getMunicipality(muniName, stateCode) {
    return new Promise((resolve, reject) => {
      // If all municipalities data is stored in var, then don't make request
      if (this.get('municipalities')) {
        let muni = this.get('municipalities').filterBy('properties.mun_name', muniName);
        // If municipality name is wrong and couldnt find it
        if (isEmpty(muni)) {
          reject(new Error("El nombre del municipio es incorrecto. Debe llevar acentos."));
        } else {
          let muniCode = muni[0].properties.mun_code;
          this.loadSectionsData(stateCode, muniCode, 'mun_code').then(() => {
            resolve(muni[0]);
          });
        }
      } else {
        this.loadMunicipalitiesData(stateCode).then(() => {
          let muni = this.get('municipalities').filterBy('properties.mun_name', muniName);
          // If municipality name is wrong and couldnt find it
          if (isEmpty(muni)) {
            reject(new Error("El nombre del municipio es incorrecto. Debe llevar acentos."));
          } else {
            let muniCode = muni[0].properties.mun_code;
            this.loadSectionsData(stateCode, muniCode, 'mun_code').then(() => {
              resolve(muni[0]);
            });
          }
        });
      }
    });
  },

  getSection(stateCode, muniCode, sectionCode) {
    return new Promise((resolve, reject) => {
      // If all sections data is store in var, then don't make request
      if (this.get('sections')) {

        let section = this.get('sections').filterBy('properties.section_code', parseInt(sectionCode));
        // If section code is wrong and couldn't find it
        if (isEmpty(section)) {
          reject(new Error("El código de la sección es incorrecto."));
        } else {
          resolve(section[0]);
        }
      } else {
        // CHANGE THIS FOR DISTRICTS LOGIC
        this.loadSectionsData(stateCode, muniCode, 'mun_code').then(() => {
          let section = this.get('sections').filterBy('properties.section_code', parseInt(sectionCode));
          // If section code is wrong and couldn't find it
          if (isEmpty(section)) {
            reject(new Error("El código de la sección es incorrecto."));
          } else {
            resolve(section[0]);
          }
        });
      }
    });
  },

  getSectionByDistrict(stateCode, districtCode, sectionCode) {
    return new Promise((resolve, reject) => {
      // If all sections data is store in var, then don't make request
      if (this.get('sections')) {

        let section = this.get('sections').filterBy('properties.section_code', parseInt(sectionCode));
        // If section code is wrong and couldn't find it
        if (isEmpty(section)) {
          reject(new Error("El código de la sección es incorrecto."));
        } else {
          resolve(section[0]);
        }
      } else {
        // CHANGE THIS FOR DISTRICTS LOGIC
        this.loadSectionsData(stateCode, districtCode, 'district_code').then(() => {
          let section = this.get('sections').filterBy('properties.section_code', parseInt(sectionCode));
          // If section code is wrong and couldn't find it
          if (isEmpty(section)) {
            reject(new Error("El código de la sección es incorrecto."));
          } else {
            resolve(section[0]);
          }
        });
      }
    });
  },

  loadSData: task(function * () {
    let xhr;
    try {
      xhr = Ember.$.getJSON("../assets/mx_tj.json");
      let res = yield xhr.promise();
      this.set('states', topojson.feature(res, res.objects.states).features);
      return res;

    } finally {
      xhr.abort();
    }
  }),

  loadStatesData() {
    return new Promise((resolve, reject) => {
      d3.json("../assets/mx_tj.json", (error, data) => {
        if (error) { reject(error); }
        if (data) {
          this.set('states', topojson.feature(data, data.objects.states).features);
          resolve("States data loaded succesfully.");
        }
      });
    });
  },

  loadMData: task(function * (stateCode) {
    let xhr;
    try {
      xhr = Ember.$.getJSON("../assets/mx_tj.json");
      let res = yield xhr.promise();

      yield this.set('municipalities', topojson.feature(res, res.objects.municipalities).features.filterBy('properties.state_code', stateCode));
      yield this.set('municipalitiesBorders', topojson.mesh(data, data.objects.municipalities, function(a, b) {
        if (a.properties.state_code === stateCode) { return a !== b; }
      }));

      return res;

    } finally {
      xhr.abort();
    }
  }),

  loadMunicipalitiesData(stateCode) {
    return new Promise((resolve, reject) => {
      d3.json("../assets/mx_tj.json", (error, data) => {
        if (error) { reject(error); }
        if (data) {
          this.set('municipalities', topojson.feature(data, data.objects.municipalities).features.filterBy('properties.state_code', stateCode));

          this.set('municipalitiesBorders', topojson.mesh(data, data.objects.municipalities, function(a, b) {
            if (a.properties.state_code === stateCode) { return a !== b; }
          }));

          resolve("municipalities data loaded succesfully.");
        }
      });
    });
  },

  loadFederalDistrictsData(stateCode) {
    return new Promise((resolve, reject) => {
      d3.json("../assets/distritos.json", (error, data) => {
        if (error) { reject(error); }

        if (data) {
          this.set('federalDistricts', topojson.feature(data, data.objects.mx_distrito).features.filterBy('properties.state_code',stateCode));
          this.set('federalDistrictsBorders', topojson.mesh(data, data.objects.mx_distrito, function(a, b) {
            if (a.properties.state_code === stateCode) { return a !== b; }
          }));
          resolve("Federal districts loaded succesfully");
        }
      });
    })
  },

  loadFData: task(function * (stateCode) {
    let xhr;
    try {
      xhr = Ember.$.getJSON("../assets/distritos.json");
      let res = yield xhr.promise();

      yield this.set('federalDistricts', topojson.feature(res, res.objects.mx_distrito).features.filterBy('properties.state_code',stateCode));
      yield this.set('federalDistrictsBorders', topojson.mesh(res, res.objects.mx_distrito, function(a, b) {
        if (a.properties.state_code === stateCode) { return a !== b; }
      }));

      return res;

    } finally {
      xhr.abort();
    }
  }),  

  loadSectionsData(stateCode, code, property) {
    return new Promise((resolve, reject) => {
      d3.json("../assets/secciones.json", (error, data) => {
        if (error) { reject(error); }
        if (data) {
          let sections = topojson.feature(data, data.objects.secciones).features
            .filterBy('properties.state_code', stateCode)
            .filterBy('properties.' + property, code);

          this.set('sections', sections);
          resolve(sections);
        }
      });
    });
  },

  loadSecData: task(function * (stateCode, code, property) {
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