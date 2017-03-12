import Ember from 'ember';
import d3 from "npm:d3";
import topojson from "npm:topojson";

export default Ember.Service.extend({

  states: null,

  municipalities: null,

  findMuniCode(stateName, muniName) {
  },

  getStateCode(stateName) {
    return new Promise((resolve, reject) => {
      if (this.get('states')) {

        console.log("STATES NOT EMPTY");

        resolve(this.findStateCode(stateName, this.get('states')));
      } else {
        console.log("STATES EMPTY");
        this.loadData().then(() => {
          resolve(this.findStateCode(stateName, this.get('states')));
        });
      }
    });
  },

  findStateCode(stateName, data) {
    let state = topojson.feature(data, data.objects.states).features
      .filterBy('properties.state_name', stateName);

      return state;
  },

  loadData() {
    return new Promise((resolve, reject) => {
      d3.json("../assets/mx_tj.json", (error, data) => {
        if (error) { reject(error); }
        if (data) {
          this.set('states', data);
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