import Ember from 'ember';
import d3 from "npm:d3";
import topojson from "npm:topojson";

const { isEmpty } = Ember;

export default Ember.Service.extend({

  states: null,

  municipalities: null,

  municipalitiesBorders: null,

  sections: null,

  // Function that gets a specific state object by name and loads its municipalities
  getState(stateName) {
    return new Promise((resolve, reject) => {
      // If states data is stored in var, then don't make request
      if (this.get('states')) {
        let state = this.get('states').filterBy('properties.state_name', stateName);
        if (isEmpty(state)) {
            reject(new Error("El código del estado es incorrecto."));
          } else {
            let stateCode = state[0].properties.state_code;
            this.loadMunicipalitiesData(stateCode).then(() => {
              resolve(state[0]);
            });
          }
      } else {
        this.loadStatesData().then(() => {
          let state = this.get('states').filterBy('properties.state_name', stateName);
          //If state name is wrong and couldnt find this state
          if (isEmpty(state)) {
            reject(new Error("El nombre del estado es incorrecto. Debe llevar acentos."));
          } else {
            let stateCode = state[0].properties.state_code;
            this.loadMunicipalitiesData(stateCode).then(() => {
              resolve(state[0]);
            });
          }
        });
      }
    });
  },

  // Function that gets a specific municipality object by name name and loads its sections
  getMunicipality(muniName, stateCode) {
    return new Promise((resolve, reject) => {
      // If municipalities data is stored in var, then don't make request
      if (this.get('municipalities')) {
        let muni = this.get('municipalities').filterBy('properties.mun_name', muniName);
        // If municipality name is wrong and couldnt find it
        if (isEmpty(muni)) {
          reject(new Error("El nombre del municipio es incorrecto. Debe llevar acentos."));
        } else {
          let muniCode = muni[0].properties.mun_code;
          this.loadSectionsData(stateCode, muniCode).then(() => {
            resolve(muni[0]);
          });
        }
      } else {
        this.loadData().then(() => {
          let muni = this.get('municipalities').filterBy('properties.mun_name', muniName);
          // If municipality name is wrong and couldnt find it
          if (isEmpty(muni)) {
            reject(new Error("El nombre del municipio es incorrecto. Debe llevar acentos."));
          } else {
            let muniCode = muni[0].properties.mun_code;
            this.loadSectionsData(stateCode, muniCode).then(() => {
              resolve(muni[0]);
            });
          }
        });
      }
    });
  },

  getSection(stateCode, muniCode, sectionCode) {
    return new Promise((resolve, reject) => {
      // If sections data is store in var, then don't make request
      if (this.get('sections')) {

        let section = this.get('sections').filterBy('properties.section_code', parseInt(sectionCode));
        // If section code is wrong and couldn't find it
        if (isEmpty(section)) {
          reject(new Error("El código de la sección es incorrecto."));
        } else {
          resolve(section[0]);
        }
      } else {
        this.loadSectionsData(stateCode, muniCode).then(() => {
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

  loadMunicipalitiesData(stateCode) {
    return new Promise((resolve, reject) => {
      d3.json("../assets/mx_tj.json", (error, data) => {
        if (error) { reject(error); }
        if (data) {
          this.set('municipalities', topojson.feature(data, data.objects.municipalities).features.filterBy('properties.state_code', stateCode));

          this.set('municipalitiesBorders', topojson.mesh(data, data.objects.municipalities, function(a, b) {
            if (a.properties.state_code === stateCode) { return a !== b; }
          }));
          console.log(this.get('municipalitiesBorders'));

          resolve("municipalities data loaded succesfully.");
        }
      });
    });
  },

  loadSectionsData(stateCode, muniCode) {
    return new Promise((resolve, reject) => {
      d3.json("../assets/secciones.json", (error, data) => {
        if (error) { reject(error); }
        if (data) {
          let sections = topojson.feature(data, data.objects.secciones).features
            .filterBy('properties.state_code', stateCode)
            .filterBy('properties.mun_code', muniCode);

          this.set('sections', sections);
          resolve(sections);
        }
      });
    });
  }
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