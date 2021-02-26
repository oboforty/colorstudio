import {template} from "/js/components/grid.vue.mjs"



export let component = Vue.component('color-grid', {
  template: template,
  props: {
    cols: {
      default: 4,
    },
    rows: {
      default: 4,
    },
  },
  data: function() {
    return {
    }
  },
  methods: {
    //1-indexed
    setcolor({i, color}) {
      this.colbox(i).color = color;
    },

    getcolor(i) {
      return this.colbox(i).color;
    },

    colbox(i) {
      let va = this.$refs['col'+i];
      return Array.isArray(va) ? va[0] : va;
    },

    fetch_color(i) {
      // clone color property of colorbox
      if (!this.colbox(i))
        return this.test_color;
      else {
        return this.colbox(i).color;
      }
    },

    refresh() {
      this.$forceUpdate();

      // for(let oof of this.$refs)
      //   oof.$forceUpdate();
    }
  },

  watch: {
  },

  computed: {
    test_color() {
      return new Color("#ffffff");
    },

    cell_class() {
      const C = 12;
      let ci = Math.floor(C / this.cols);

      return `col-${ci} mt-2 mb-2`;
    }
  }

});
