import {template} from "/js/components/frame.vue.mjs"
import '/js/components/colorbox.mjs';
import '/js/components/grid.mjs';

import '/js/editor/blending.mjs';
import '/js/editor/setcolor.mjs';
import '/js/editor/genetic.mjs';
import '/js/editor/yuv.mjs';


export let component = Vue.component('frame-app', {
  template: template,
  props: {
    
  },
  data: function() {
    return {
      editor: null,

      // grids
      gridnames: [],
      tabs: [],
      tabCounter: 0,
      current_grid: 0,
      change_tab: 0,

      // settings
      name: null,
      copy_mode: 'hex',
      copy_modes: ['hex', 'rgba', 'rgb', 'hsv', 'hsl', 'yuv'],
      layout: 'meta',
      layouts: {
        meta: 'Metadata',
        temp: 'Temperature',
        colorblind: 'Colorblind class',
        yuv: 'YUV channels',
        hsl: 'HSL channels',
        rgb: 'RGB channels',
      },
      colorblind: 'Protanopia',
      colorblinds: [
        'Protanopia',
        'Protanomaly',
        'Deuteranopia',
        'Deuteranomaly',
        'Tritanopia',
        'Tritanomaly',
        'Achromatopsia',
        'Achromatomaly',
        'Normal'        
      ],
      set_rows: 0,
      set_cols: 0,
    }
  },
  methods: {
    init() {
      this.name = 'new project';
      this.newTab();
      this.renameTab(0, "Default");

      if (this.active_grid) {
        Vue.nextTick(() =>{
          this.set_cols = this.active_grid.cols;
          this.set_rows = this.active_grid.rows;    
        });
      }
    },

    onclick({color, name, i}, grid) {
      if (!grid)
        grid = this.current_grid;

      this.$refs['setcolor'].open(color, i, grid, name);

      clipboard_copy(color[this.copy_mode]);
    },

    //1-indexed
    setcolor({i, color, grid}) {
      if (!grid)
        grid = this.current_grid;

      try {
        this.grid(grid).colbox(i).color = color;
      } catch(e) {
        console.error(`Color #${i} of Grid #${grid} not found!`, e);
      }
    },

    //1-indexed
    setname({i, name, grid}) {
      if (!grid)
        grid = this.current_grid;

      try {
        this.grid(grid).colbox(i).name = name;
      } catch(e) {
        console.error(`Color #${i} of Grid #${grid} not found!`, e);
      }
    },

    opengrid(i) {
      this.current_grid = i;
      
      this.set_cols = this.active_grid.cols;
      this.set_rows = this.active_grid.rows;
    },

    grid(grid) {
      let va = this.$refs['grid'+grid];

      return Array.isArray(va) ? va[0] : va;
    },

    renameTab(x, name) {
      if (!name)
        var name = prompt("Palette name:", this.gridnames[x]);

      if (name) {
        this.gridnames[x] = name;
        this.change_tab++;
      }
    },

    closeTab(x) {
      for (let i = 0; i < this.tabs.length; i++) {
        if (this.tabs[i] === x) {
          this.gridnames.splice(i,1);
          this.tabs.splice(i, 1);
        }
      }
    },

    newTab() {
      this.gridnames.push("New palette");
      this.tabs.push(this.tabCounter++);
    }
  },

  watch: {
    set_cols(value) {
      this.active_grid.cols = value;
    },

    set_rows(value) {
      this.active_grid.rows = value;
    },
  },

  computed: {
    active_grid() {
      return this.grid(this.current_grid);
    }
  }

});
