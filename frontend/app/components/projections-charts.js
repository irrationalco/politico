import Ember from 'ember';
import { task } from 'ember-concurrency';

export default Ember.Component.extend({

  actions: {
      toggle: function(){
          $("#charts-panel").animate({right: (this.isOpen?"-250":"0")},()=>this.set('isStatic', true));
          this.set('isStatic', false);
          this.set('isOpen', !this.isOpen);
          this.get('loadChartData').perform();
      }
  },

  isOpen: false,

  isStatic: true,

  parties: ["PAN","PCONV","PES","PH","PMC","PMOR","PNA",
            "PPM","PRD","PRI","PSD","PSM","PT","PVEM"],

  colors: {
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
      PSM: "#f50800"},

  formatDataset(party, raw){
    return {label: party,
      backgroundColor: this.colors[party],
      fill: false,
      borderColor: this.colors[party],
      data: raw.map((x)=>x.get(party)),
      pointBackgroundColor: this.colors[party]};
  },

  formatChartData: task(function * (raw){
    let result = null;
    if(raw.length === 1){
      let activeParties = this.parties.filter((x)=>raw[0].get(x)>0);
      result = {
        labels: activeParties,
        datasets: [{
          label: "Votos",
          data: activeParties.map((x)=>raw[0].get(x)),
          backgroundColor: activeParties.map((x)=>this.colors[x])
        }]
      };
    }else{
      raw = raw.sort((a,b)=>a.get('year')-b.get('year'));
      let activeParties = this.parties.filter((party)=>
        raw.map((x)=>x.get(party)).reduce((s,v)=>{s+v},0)!==0);
        // !raw.map((x)=>x.get(party)).some((v)=>v===0));
      result = {
        labels: raw.map((x)=>x.get('year')),
        datasets: activeParties.map((x)=>this.formatDataset(x,raw))
      };
    }
    return result;
  }),

  presidentChart: null,

  presidentChartType: null,

  senatorsChart: null,

  senatorsChartType: null,

  deputiesChart: null,

  deputiesChartType: null,

  electionTypes: {dif: 0, prs: 1, sen: 2},

  chartNames: ['deputiesChart', 'presidentChart', 'senatorsChart'],

  setChart: task(function * (chartName, data) {
    this.set(chartName ,yield this.get('formatChartData').perform(data));
    this.set(chartName+'Type', this.get(chartName).datasets.length===1?"doughnut":"line");
  }),

  loadChartData: task(function * () {
    if(!this.isOpen){
      return;
    }
    let data = null;
    if(this.get("level") === "section"){
      let result = yield this.get('store').query('projection', {
        history: 1,
        state: this.get('state'),
        section: this.get('section')
      });
      data = [[],[],[]];
      result.forEach((item) => {
        data[this.electionTypes[item.get('electionType')]].push(item);
      });
    }
    if(!data){
      this.chartNames.forEach((name)=> this.set(name, null));
      return;
    }
    let charts = this.chartNames.map((item, index) =>
      this.get('setChart').perform(item, data[index]));
    for(let i=0;i<charts.length;i++){
      charts[i] = yield charts[i];
    }
  }).restartable(),

  init() {
    this._super(...arguments);
  },

  didReceiveAttrs() {
    this._super(...arguments);
    this.get('loadChartData').perform();
  },

  didUpdateAttrs() {
    this._super(...arguments);
  },

  didInsertElement() {
    this._super(...arguments);
    let div = $("#charts-panel");
    div.outerHeight($(window).height() - div.position().top - parseInt(div.css('margin-top')));
  }

});
