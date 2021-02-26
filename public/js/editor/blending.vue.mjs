export const template = `
  <div>
    <h5>Blend Factory</h5>

    <span>Selected colors:</span>
    <div class="input-group mb-3">
      <input v-model.number="selfrom" type="number" class="form-control input-sm" placeholder="Start color" :max="selto">
      <div class="input-group-prepend">
        <span class="input-group-text" id="basic-addon1">to</span>
      </div>
      <input v-model.number="selto" type="number" class="form-control input-sm" placeholder="End color" :min="selfrom">
    </div>

    <div>
      <span>Base color:</span>

      <input class="setcolor-box setcolor-box-sm border rounded border-dark" type="color" @input="onchange" @change="onchange" :value="basecolor.hex" :style="style">

      <div class="form-group form-check">
        <input type="checkbox" class="form-check-input" v-model="invert" id="exampleCheck1">
        <label class="form-check-label" for="exampleCheck1">Invert blend</label>
      </div>
    </div>

    <div>
      <span>Colorscheme:</span>
      <b-form-select v-model="colorscheme" :options="blends"></b-form-select>
    </div>
    
    <button @click="generate" class="btn btn-success">Generate</button>
    <button @click="randomize" class="btn btn-success">Randomize</button>
  </div>
`;
