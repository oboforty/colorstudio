import {template} from "/js/components/colorbox.vue.mjs"


function getCB(o,cl) {
  let m = blindclass[cl];

  var r=((o.r*m[0])+(o.g*m[1])+(o.b*m[2])+(o.a*m[3])+m[4]);
  var g=((o.r*m[5])+(o.g*m[6])+(o.b*m[7])+(o.a*m[8])+m[9]);
  var b=((o.r*m[10])+(o.g*m[11])+(o.b*m[12])+(o.a*m[13])+m[14]);
  var a=((o.r*m[15])+(o.g*m[16])+(o.b*m[17])+(o.a*m[18])+m[19]);
  
  return new Color(clamp(r),clamp(g),clamp(b),a);
};

const blindclass = {
  'Normal':[1,0,0,0,0, 0,1,0,0,0, 0,0,1,0,0, 0,0,0,1,0, 0,0,0,0,1],
  'Protanopia':[0.567,0.433,0,0,0, 0.558,0.442,0,0,0, 0,0.242,0.758,0,0, 0,0,0,1,0, 0,0,0,0,1],
  'Protanomaly':[0.817,0.183,0,0,0, 0.333,0.667,0,0,0, 0,0.125,0.875,0,0, 0,0,0,1,0, 0,0,0,0,1],
  'Deuteranopia':[0.625,0.375,0,0,0, 0.7,0.3,0,0,0, 0,0.3,0.7,0,0, 0,0,0,1,0, 0,0,0,0,1],
  'Deuteranomaly':[0.8,0.2,0,0,0, 0.258,0.742,0,0,0, 0,0.142,0.858,0,0, 0,0,0,1,0, 0,0,0,0,1],
  'Tritanopia':[0.95,0.05,0,0,0, 0,0.433,0.567,0,0, 0,0.475,0.525,0,0, 0,0,0,1,0, 0,0,0,0,1],
  'Tritanomaly':[0.967,0.033,0,0,0, 0,0.733,0.267,0,0, 0,0.183,0.817,0,0, 0,0,0,1,0, 0,0,0,0,1],
  'Achromatopsia':[0.299,0.587,0.114,0,0, 0.299,0.587,0.114,0,0, 0.299,0.587,0.114,0,0, 0,0,0,1,0, 0,0,0,0,1],
  'Achromatomaly':[0.618,0.320,0.062,0,0, 0.163,0.775,0.062,0,0, 0.163,0.320,0.516,0,0,0,0,0,1,0,0,0,0,0]
};



export let component = Vue.component('color-box', {
  template: template,
  props: {
    idx: { default: "-" },
    color: { default: "white" },
    name: { default: "" },
    layout: { default: "meta" },
    colorblind: { default: "Protanopia" }
  },

  data: function() {
    return {
      locked: false
    }
  },

  methods: {
  },

  watch: {
  },

  computed: {
    style() {
      let col;
      
      if (this.layout == 'colorblind') 
        col = getCB(this.color, this.colorblind);
      else
        col = this.color;

      return {
        background: col.rgba,
        color: col.contrast
      }
    },

    // RGB -----------------------------------------------
    saturation_style() {
      let [h,s,l] = this.color.to_hsl();
      let hsl = ColorUtil.from_hsl(h,s,0.5);

      return {
        background: hsl.rgb,
        width: round((s / (s+l)) * 100)+'%',
        opacity: this.color.a,
        'border-color': this.color.contrast,
        color: hsl.contrast,
      }
    },

    lightness_style() {
      let [h,s,l] = this.color.to_hsl();
      let hsl = ColorUtil.from_hsl(h,0,l);

      return {
        background: hsl.rgb,
        width: round((l / (s+l)) * 100)+'%',
        opacity: this.color.a,
        'border-color': this.color.contrast,
        color: hsl.contrast,
      }
    },

    // RGB -----------------------------------------------
    red_style() {
      let s = this.color.r+this.color.g+this.color.b;

      return {
        background: 'red',
        width: round((this.color.r / s) * 100)+'%',
        opacity: this.color.a,
        'border-color': this.color.contrast,
      }
    },

    green_style() {
      let s = this.color.r+this.color.g+this.color.b;

      return {
        background: 'green',
        width: round((this.color.g / s) * 100)+'%',
        opacity: this.color.a,
        'border-color': this.color.contrast,
      }
    },

    blue_style() {
      let s = this.color.r+this.color.g+this.color.b;

      return {
        background: 'blue',
        width: round((this.color.b / s) * 100)+'%',
        opacity: this.color.a,
        'border-color': this.color.contrast,
      }
    },

    // YUV -----------------------------------------------
    yuv_u_style() {
      let [y,u,v] = this.color.to_yuv();
      let bg;

      if (-10 < u && u < 10) bg = 'gray';
      else if (-10 >= u) bg = 'red';
      else bg = 'purple';

      u = Math.abs(u);
      v = Math.abs(v);

      return {
        background: bg,
        width: round((u/(u+v)) * 100)+'%',
      }
    },

    yuv_v_style() {
      let [y,u,v] = this.color.to_yuv();
      let bg;

      if (-10 < v && v < 10) bg = 'gray';
      else if (-10 >= v) bg = 'green';
      else bg = 'red';

      u = Math.abs(u);
      v = Math.abs(v);

      return {
        background: bg,
        width: round((v/(u+v)) * 100)+'%',
      }
    },

    // CB Class -----------------------------------------------

    red_cb_class() {
      let [y,u,v] = this.color.to_yuv();

      return {
        'border-color': this.color.contrast,
        background: u < 0 ? "rgb(236,178,29)" : "rgb(0,127,220)"
      }
    },

    blue_cb_class() {
      let [y,u,v] = this.color.to_yuv();

      return {
        'border-color': this.color.contrast,
        background: v < 0 ? "rgb(0,200,216)" : "rgb(253,80,84)"
      }
    },

  }
});
