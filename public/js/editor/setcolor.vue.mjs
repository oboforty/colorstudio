export const template = `
  <div>
    <h5>Edit color</h5>

    <input class="setcolor-box border rounded border-dark d-block mx-auto" type="color" @input="onchange" @change="onchange" :value="color.hex" :style="style">
    <span>#{{ i }}: <b :style="style2">{{ color.hex }}</b></span>

    <br/>

    <input class="form-control" type="text" v-model="name" placeholder="Color Named">
  </div>
`;
