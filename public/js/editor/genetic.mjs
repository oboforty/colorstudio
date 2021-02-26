import {template} from "/js/editor/genetic.vue.mjs"
import {Genetic} from "/js/genetic.js";


function cdist(col1, col2) {
  return Math.sqrt(
    Math.pow(col1.c[0]-col2.c[0], 2) + 
    Math.pow(col1.c[1]-col2.c[1], 2) + 
    Math.pow(col1.c[2]-col2.c[2], 2)
  );
}


export let component = Vue.component('genetic', {
  template: template,
  props: {
  },
  data: function() {
    return {
    }
  },
  methods: {
    start() {
      const grid = this.$parent.active_grid;
      const c0 = new Color("#ff0000");

      // get colors
      let colors = [];
      for(let i of range(grid.cols*grid.rows))
        colors.push(grid.getcolor(i+1).clone())

      let pop0 = [
        colors,
      ];

      let gen = new Genetic(pop0, (genes)=>{
        let dist = 0;

        // @TEMPORAL: debug with 1 color
        //dist += cdist(c0, genes[0]);

        for(let gene of genes) {
          dist += cdist(c0, gene);
        }

        // fittness
        return -dist;
      }, (gene)=>{
        let p_mut = 0.05;
        let mut_change = 0.1;

        // @TODO: @later: define .clamp func for color and remove global clamp func
        if (Math.random() <= p_mut)
          gene.r = round(clamp(gene.r + 255 * mut_change * (Math.random()-0.5)));
        if (Math.random() <= p_mut)
          gene.g = round(clamp(gene.g + 255 * mut_change * (Math.random()-0.5)));
        if (Math.random() <= p_mut)
          gene.b = round(clamp(gene.b + 255 * mut_change * (Math.random()-0.5)));
      }, 4, 40);

      gen.run(100);

      // @TODO: ITT: there's still just 1 pop wtf?

      // @TODO: get bets of all populations
      let best = gen.best;
      let outcolor = best.unit[0];

      console.log("Fitness:", best.fitness, best.index);
      console.log("Chosen color:", outcolor.rgb, c0.rgb, "Diff:", cdist(outcolor, c0));
      // gen.debug_pop((cs)=>{
      //   let str = "";
      //   for (let c of cs)
      //     str+=c.hex+",";
      //   return str;
      // });
      
      // no need to update with setcolor as the colors are stored as references
      // print result
      for(let i of range(grid.cols*grid.rows))
        this.$emit('setcolor', {i: i+1, color: best.unit[i]});
    }
  },

  watch: {
  },

  computed: {
  }
});
