import Ember from 'ember';
import d3 from "npm:d3";
import topojson from "npm:topojson";

export default Ember.Service.extend({

  states: null,

  municipalities: null,

  getMuniCode(stateCode, muniName) {
    return new Promise((resolve, reject) => {
      if (this.get('municipalities')) {
        resolve(this.findMuniCode(stateCode, muniName, this.get('municipalities')));
      } else {
        this.loadData().then(() => {
          resolve(this.findMuniCode(stateCode, muniName, this.get('municipalities')));
        });
      }
    });
  },

  getStateCode(stateName) {
    return new Promise((resolve, reject) => {
      if (this.get('states')) {
        resolve(this.findStateCode(stateName, this.get('states')));
      } else {
        this.loadData().then(() => {
          resolve(this.findStateCode(stateName, this.get('states')));
        });
      }
    });
  },

  findStateCode(stateName, states) {
    let state = states.filterBy('properties.state_name', stateName);
    if (Ember.isEmpty(state)) {
      return null;
    } else {
      return state[0].properties.state_code;  
    }
  },

  findMuniCode(stateCode, muniName, municipalities) {
    let muni = municipalities.filterBy('properties.state_code', stateCode).filterBy('properties.mun_name', muniName);

    if (Ember.isEmpty(muni)) {
      return null;
    } else {
      return muni[0].properties.mun_code;  
    }
    
  },

  loadData() {
    return new Promise((resolve, reject) => {
      d3.json("../assets/mx_tj.json", (error, data) => {
        if (error) { reject(error); }
        if (data) {
          this.set('states', topojson.feature(data, data.objects.states).features);
          this.set('municipalities', topojson.feature(data, data.objects.municipalities).features);

          resolve("Data loaded succesfully.");
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