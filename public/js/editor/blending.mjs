import {template} from "/js/editor/blending.vue.mjs"

// ඞ \\
export let component = Vue.component('blending', {
  template: template,
  data: function() {
    return {
      keep_colors: true,
      invert: false,
      basecolor: new Color("#fefefe"),

      // blending
      colorscheme: 'lineardodge',
      blends: [
        'colorburn',
        'colordodge',
        'darken',
        'difference',
        'exclusion',
        'hardlight',
        'inbetween',
        'lighten',
        'linearburn',
        'lineardodge',
        'multiply',
        'none',
        'normal',
        'overlay',
        'screen',
        'softlight',
        'subtract',
      ],

      // selected color indices
      selfrom: 1,
      selto: 4
    }
  },

  updated() {
  },

  methods: {
    generate() {
      const N = this.selto-this.selfrom;
      const grid = this.$parent.active_grid;

      // @todo: check if we have enough colors
      if (this.keep_colors && N*2 > this.selfrom+grid.cols*grid.rows) {
        alert(`You need at least ${this.selfrom+grid.cols*grid.rows} colors on this grid!`);
        return;
      }

      for (let i = 0; i <= N; i++)
      {
        const sample_i = this.selfrom + i;
        const result_i = this.selto + i + 1;
        const sample_col = grid.getcolor(sample_i);
        const result_col = this.blend(sample_col);
        
        this.$emit('setcolor', {'i': result_i, 'color': result_col});
      }
    },

    randomize() {
      console.log(this.$parent.active_grid);
      // this.$emit('setcolor', {'i': starti+i, 'color': col});
    },

    blend(color) {
      let out_color;
        // softlight, light (lineardodge), screen, vivid (multiply) ['softlight','lineardodge','screen','darken','multiply']
        // => basecolor.blend(color)
        // faded (normal), hardlight
        // => color.blend(basecolor)
        // 'normal': 'Faded',
        // 'lineardodge': 'Light',
        // 'screen': 'Screen',
        // 'softlight': 'Softlight',
        // 'hardlight': 'Hardlight',
        // 'multiply': 'Vivid',

      if (this.invert)
        out_color = color.blend(this.basecolor, this.colorscheme);
      else
        out_color = this.basecolor.blend(color, this.colorscheme);

      return out_color;
    },

    onchange(e) {
      var hex = e.target.value;
      this.basecolor = new Color(hex);
    }
  },

  watch: {
  },

  computed: {
    style() { return { 'background-color': this.basecolor.toString() } },
  }

});
