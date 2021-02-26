import {template} from "/js/editor/setcolor.vue.mjs"


export let component = Vue.component('setcolor', {
  template: template,
  props: {
    size: {
      default: null
    }
  },
  data: function() {
    return {
      color: new Color("#ffffff"),
      i: null,
      grid: null,
      name: null,
    }
  },
  methods: {
    open(color, i, grid, name) {
      this.color = color;
      this.i = i;
      this.grid = grid;
      this.name = name;
    },

    onchange(e) {
      var hex = e.target.value;
      this.color = new Color(hex);

      this.$emit('setcolor', {color: this.color, i: this.i, grid: this.grid});
    },
  },

  watch: {
    name(val) {
      this.$emit('setname', {name: val, i: this.i, grid: this.grid});
    }
  },

  computed: {
    style() { return { 'background-color': this.color.toString() } },
    style2() { return { 'color': this.color.toString(), '-webkit-text-stroke': '0.5px '+this.color.contrast, 'font-size': '1.6em' } },
  }
});
