import Ember from 'ember';
import {
  task
} from 'ember-concurrency';

export default Ember.Component.extend({

  actions: {
    toggle: function () {
      $("#charts-panel").animate({
        right: (this.isOpen ? "-250" : "0")
      }, () => this.set('isStatic', true));
      this.set('isStatic', false);
      this.set('isOpen', !this.isOpen);
      this.get('loadChartData').perform();
    }
  },

  isOpen: false,

  isStatic: true,

  parties: ["PAN", "PCONV", "PES", "PH", "PMC", "PMOR", "PNA",
    "PPM", "PRD", "PRI", "PSD", "PSM", "PT", "PVEM"
  ],

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
    PSM: "#f50800"
  },

  electionTypes: {
    dif: 0,
    prs: 1,
    sen: 2
  },

  chartNames: ['deputiesChart', 'presidentChart', 'senatorsChart'],

  formatDataset(party, raw) {
    return {
      label: party,
      backgroundColor: this.colors[party],
      fill: false,
      borderColor: this.colors[party],
      data: raw.map((x) => x.get(party)),
      pointBackgroundColor: this.colors[party]
    };
  },

  getOther(activeParties) {
    return this.parties.filter((x) => activeParties.indexOf(x) === -1)
      .reduce((s, v) => {
        return s + raw[0].get(v)
      }, 0);
  },

  formatOther(parties, raw) {
    return {
      label: "Otros",
      backgroundColor: '#4d4d4d',
      fill: false,
      borderColor: '#4d4d4d',
      data: raw.map((x) => parties.reduce((s, v) => {
        return s + x.get(v)
      }, 0)),
      pointBackgroundColor: '#4d4d4d'
    };
  },

  filterPartiesDoughnut(raw) {
    let total = this.parties.reduce((s, v) => {
      return s + raw[0].get(v)
    }, 0);
    let minVal = total * 0.05;
    let activeParties = this.parties.filter((x) => raw[0].get(x) >= minVal);
    activeParties.sort((a, b) => raw[0].get(b) - raw[0].get(a));
    minVal = total * 0.95;
    activeParties = activeParties.filter((x) => {
      let tmp = minVal;
      minVal -= raw[0].get(x);
      return tmp >= 0;
    });
    return {
      active: activeParties,
      other: this.parties.filter((x) => activeParties.indexOf(x) === -1)
        .reduce((s, v) => {
          return s + raw[0].get(v)
        }, 0)
    };
  },

  filterPartiesLine(raw) {
    // let activeParties = this.parties.filter((party)=>
    //   raw.map((x)=>x.get(party)).reduce((s,v)=>{s+v},0)!==0);
    //   !raw.map((x)=>x.get(party)).some((v)=>v===0));
    let ratios = this.parties.map((s) => 0);
    raw.forEach((year, idx) => {
      let total = this.parties.reduce((s, v) => {
        return s + year.get(v)
      }, 0);
      this.parties.forEach((party, index) => ratios[index] += year.get(party) / total * (idx + 1));
    });
    let total = ratios.reduce((s, v) => {
      return s + v
    }, 0);
    ratios = ratios.map((x, idx) => {
      return {
        party: this.parties[idx],
        ratio: x / total
      };
    });
    let activeParties = ratios.filter((x) => x.ratio >= .05);
    activeParties.sort((a, b) => b.ratio - a.ratio);
    let val = 0;
    activeParties = activeParties.filter((x) => {
      let tmp = val;
      val += x.ratio;
      return tmp <= .95;
    }).map((x) => x.party);
    return {
      active: activeParties,
      other: this.parties.filter((x) => activeParties.indexOf(x) === -1)
    };
  },

  formatChartData: task(function* (raw) {
    let result = null;
    if (raw.length === 1) {
      let parties = this.filterPartiesDoughnut(raw);
      result = {
        labels: parties.active.concat('Otros'),
        datasets: [{
          label: "Votos",
          data: parties.active.map((x) => raw[0].get(x)).concat(parties.other),
          backgroundColor: parties.active.map((x) => this.colors[x]).concat('#4d4d4d')
        }]
      };
    } else {
      raw = raw.sort((a, b) => a.get('year') - b.get('year'));
      let parties = this.filterPartiesLine(raw);
      result = {
        labels: raw.map((x) => x.get('year')),
        datasets: parties.active.map((x) => this.formatDataset(x, raw))
                                            .concat(this.formatOther(parties.other, raw))
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

  setChart: task(function* (chartName, data) {
    this.set(chartName, yield this.get('formatChartData').perform(data));
    this.set(chartName + 'Type', this.get(chartName).datasets.length === 1 ? "doughnut" : "line");
  }),

  loadChartData: task(function* () {
    if (!this.isOpen) {
      return;
    }
    let resultLevel = this.get('level');
    if(resultLevel === 'municipality' && this.get('mapDivision') === 'federal'){
      resultLevel = 'district';
    }
    let result = yield this.get('store').query('projection', {
        history: 1,
        section: this.get('section'),
        municipality: this.get('municipality'),
        federalDistrict: this.get('federalDistrict'),
        state: this.get('state'),
        level: resultLevel
      });
    if (!result) {
      this.chartNames.forEach((name) => this.set(name, null));
      return;
    }
    let data = [
      [],
      [],
      []
    ];
    result.forEach((item) => {
      data[this.electionTypes[item.get('electionType')]].push(item);
    });
    let charts = this.chartNames.map((item, index) =>
      this.get('setChart').perform(item, data[index]));
    for (let i = 0; i < charts.length; i++) {
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
