import {template} from "/js/editor/yuv.vue.mjs"

const lerp = (x, y, a) => x * (1 - a) + y * a;


export let component = Vue.component('yuv', {
  template: template,
  props: {
    width: {
      default: 150,
    },
    height: {
      default: 150,
    }
  },
  data: function() {
    return {
      ctx: null,
      canvas: null,

      // yuv Y editing
      yuv_y: 0.5,

      // Draw stuff
      draw_tout: null,
      //draw_params_tmp: 0,

      // gradient LERP params
      param_x: 0.5,
      param_y: 0.5,
      param_3: 10, // radius

      lerp_function: 'horizontal',
      lerp_functions: [
        'horizontal',
        'vertical',
        'circle'
      ],

      // selected color indices
      selfrom: 1,
      selto: 4
    }
  },
  mounted() {
    this.canvas = this.$refs['canvas'];
    this.ctx = this.canvas.getContext("2d");

    Vue.nextTick(()=>{
      this.draw();
    });
  },

  updated() {
  },

  methods: {
    draw() {
      if (!this.ctx)
        return;
      const ctx = this.ctx;
      const data = ctx.getImageData(0,0,this.width, this.height);

      for(let x = 0; x < this.width; x++)
      for(let y = 0; y < this.height; y++) {
        let col = this.lerp_yuv(x / this.width, 1-y/this.height);

        var k = y * (this.width * 4) + x * 4;
        data.data[k+0] = col.r;
        data.data[k+1] = col.g;
        data.data[k+2] = col.b;
        data.data[k+3] = 255;
      }

      ctx.putImageData(data,0,0);

      // draw lines for function
      let linecol = from_yuv(this.yuv_y, 0,0).contrast;
      ctx.strokeStyle = linecol;

      switch(this.lerp_function) {
        case 'vertical': case 'horizontal':
          let param_y = (1-this.param_y);

          // horizontal
          ctx.beginPath();
          ctx.moveTo(0, param_y*this.height);
          ctx.lineTo(this.width, param_y*this.height);
          ctx.stroke();

          // vertical
          ctx.beginPath();
          ctx.moveTo(this.param_x*this.width, 0);
          ctx.lineTo(this.param_x*this.width, this.height);
          ctx.stroke();
          break;
        case 'circle':
          break;
        }
    },

    invalidate() {
      // begin drawing process
      //this.draw_params_tmp = this.allv;

      if (this.draw_tout!=null)
        clearTimeout(this.draw_tout);

      this.draw_tout = setTimeout(()=>{
        //this.draw_params_tmp = this.allv;
        this.draw();

        // reset timeout
        clearTimeout(this.draw_tout);
        this.draw_tout = null;
      }, 50);
    },

    lerp_yuv(pu,pv) {
      // lerp
      const u = lerp(-127, 127, pu);
      const v = lerp(-127, 127, pv);
      const y = lerp(0, 255, this.yuv_y);

      return from_yuv(y, u, v);
    },

    interpolate() {
      this.draw();

      let yf = this.param_y, xf = this.param_x;
      const N = this.lerp_points+2;
      const starti = this.selfrom;

      switch(this.lerp_function) {
        case "horizontal":
            for (let i = 0; i < this.lerp_points; i++) {
              let col = this.lerp_yuv((i+1)/N, yf);

              this.$emit('setcolor', {'i': starti+i, 'color': col});
            }
          break;
        case "vertical":
          for (let i = 0; i < this.lerp_points; i++) {
            let col = this.lerp_yuv(xf, (i+1)/N);

            this.$emit('setcolor', {'i': starti+i, 'color': col});
          }

          break;
        case "circle":
          alert("Function not supported yet");

          break;
      }
    },

    randomize() {
      
    }
  },

  watch: {
    yuv_y() { this.invalidate() },
    param_x() { this.invalidate() },
    param_y() { this.invalidate() },
    param_3() { this.invalidate() },
    lerp_points() { this.invalidate() },
    lerp_function() { this.invalidate() },
  },

  computed: {
    lerp_points() {
      return this.selto - this.selfrom+1;
    },
    allv() {
      // retard hash from all canvas inputs
      return this.yuv_y+"_"+this.param_x+"_"+this.param_y+"_"+this.param_3+"_"+this.lerp_points;
    }
  }

});
