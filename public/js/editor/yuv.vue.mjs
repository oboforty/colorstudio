export const template = `
  <div>
    <h5>YUV Range</h5>

    <span>Selected colors:</span>
    <div class="input-group mb-3">
      <input v-model.number="selfrom" type="number" class="form-control input-sm" placeholder="Start color" :max="selto">
      <div class="input-group-prepend">
        <span class="input-group-text" id="basic-addon1">to</span>
      </div>
      <input v-model.number="selto" type="number" class="form-control input-sm" placeholder="End color" :min="selfrom">
    </div>

    <div>
      <span>Y param:</span>
      <input type="range" v-model.number="yuv_y" class="form-range" min="0" max="1" step="0.001">
      
    </div>

    <div>
      <span>LERP Function:</span>

      <b-form-select v-model="lerp_function" :options="lerp_functions"></b-form-select>

      <!-- canvas coordinates -->
      <input type="range" v-model.number="param_x" class="form-range" min="0" max="1" :step="1/width" :style="'width:'+width+'px'">
      <div class="d-flex">
        <div>
          <canvas ref="canvas" :width="width" :height="height"></canvas>  
        </div>
        <div class="pl-2">
          <input type="range" v-model.number="param_y" class="form-range" min="0" max="1"  :step="1/height" :style="'height:'+height+'px'" orient="vertical">
        </div>
      </div>
      
      <span>U: {{ param_x }} V: {{ param_y }}</span>
    </div>
    
    <button @click="interpolate" class="btn btn-success">Generate</button>

    <button @click="randomize" class="btn btn-success">Randomize</button>
  </div>
`;
