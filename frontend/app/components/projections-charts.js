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
  queryData: Ember.computed('level','section','state','municipality','federalDistrict', function(){
    if(this.get("level") === "section"){
      return this.get('store').query('projection',{history: 1, state: this.get('state'), section: this.get('section')});
    }
    return null;
  }).property(),

  chartData: Ember.computed('queryData.content', function(){
    if(!this.get('queryData').get('content')){
      return null;
    }
    if(this.get("level") === "section"){
      let types = ["dif", "prs", "sen"];
      let result = [[],[],[]];
      this.get('queryData').forEach(function(item){
        let idx = types.indexOf(item.get('electionType'));
        if(idx === -1){
          types.push(item.get('electionType'));
          result.push([item]);
        }else{
          result[idx].push(item);
        }
      });
      return result;
    }
    return null;
  }),

  parties: Ember.computed(function(){
    return ["PAN","PCONV","PES","PH","PMC","PMOR","PNA",
            "PPM","PRD","PRI","PSD","PSM","PT","PVEM"];
  }),

  colors: Ember.computed(function(){
    return {
      PRI: "#00923f",
      PAN: "#06338e",
      PCONV: "#e38129",
      PMOR: "#93000a",
      PRD: "#ffcb01",
      PVEM: "#95c065",
      PT: "#da251d",
      PMC: "#f04c23",
      PES: "#490073",
      PH: "#9f3b77",
      PNA: "#00a4ac",
      PSD: "#ff0b06",
      PPM: "#00adef",
      PSM: "#f50800"};
  }),

  formatDataset(party, raw){
    let tmp = {label: party,
      backgroundColor: this.get('colors')[party],
      fill: false,
      borderColor: this.get('colors')[party],
      data: raw.map((x)=>x.get(party)),
      pointBackgroundColor: this.get('colors')[party]};
      return tmp;
  },

  formatChartData(raw){
    let result = {};
    if(raw.length === 1){
      result = {labels: this.get('parties'),
                    datasets: [{
                      label: "Votos",
                      data: this.get('parties').map((x)=>raw[0].get(x)),
                      backgroundColor: this.get('parties').map((x)=>this.get('colors')[x])
                    }]};
    }else{
      raw = raw.sort((a,b)=>a.get('year')-b.get('year'));
      let years = raw.map((x)=>x.get('year'));
      result = {
        labels: years,
        datasets: this.get('parties').map((x)=>this.formatDataset(x,raw))
      };
    }
    return result;
  },

  presidentChart: Ember.computed('chartData.@each', function(){
    if(!this.get('chartData') || !this.get('chartData')[1]){
      return null;
    }
    return this.formatChartData(this.get('chartData')[1]);
  }),

  presidentChartType: Ember.computed('presidentChart.dataset', function(){
    if(!this.get('presidentChart')){
      return null;
    }
    if(this.get('presidentChart').datasets.length===1){
      return "doughnut";
    }else{
      return "line";
    }
  }),

  senatorsChart: Ember.computed('chartData.@each', function(){
    if(!this.get('chartData') || !this.get('chartData')[2]){
      return null;
    }
    return this.formatChartData(this.get('chartData')[2]);
  }),

  senatorsChartType: Ember.computed('senatorsChart.dataset', function(){
    if(!this.get('senatorsChart')){
      return null;
    }
    if(this.get('senatorsChart').datasets.length===1){
      return "doughnut";
    }else{
      return "line";
    }
  }),

  deputiesChart: Ember.computed('chartData.@each', function(){
    if(!this.get('chartData') || !this.get('chartData')[0]){
      return null;
    }
    return this.formatChartData(this.get('chartData')[0]);
  }),

  deputiesChartType: Ember.computed('deputiesChart.dataset', function(){
    if(!this.get('deputiesChart')){
      return null;
    }
    if(this.get('deputiesChart').datasets.length===1){
      return "doughnut";
    }else{
      return "line";
    }
  }),
    // data: Ember.computed('level','section','state','municipality', function() {
    //   if(this.get("level") === "section"){
    //     var section = parseInt(this.get('section'));
    //     var sectionData = this.get('sectionData').filter(function(item){
    //       if(item.get('sectionCode')===section){
    //         return true;
    //       }
    //       return false;
    //     });
    //     return sectionData;
    //     // return sectionData.map(function(item){
    //     //   return item.get('year')
    //     // });
    //   }
    //   return null;
    // }).property(),

  // sectionData: Ember.computed('hoveredSection', function() {
  //   if (this.get('hoveredSection') !== null) {
  //     let section = this.get('sectionsData').findBy('sectionCode', this.get('hoveredSection').section_code);
  //     this.get('computeTopParties').perform(section);
  //     return section;
  //   } else {
  //     return null;
  //   }
  // }),

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
