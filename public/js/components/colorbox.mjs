import {template} from "/js/components/colorbox.vue.mjs"



export let component = Vue.component('color-box', {
  template: template,
  props: {
    idx: {
      default: "-"
    },
    color: {
      default: "white"
    },
    name: {
      default: ""
    },
  },
  data: function() {
    return {
      locked: true
    }
  },
  methods: {
  },

  watch: {
  },

  computed: {
    style() {
      return {
        background: this.color.rgba,
        color: this.color.contrast
      }
    }
  }

});
