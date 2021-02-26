export const template = `
  <div class="color-box border rounded border-dark p-3" :style="style" :data-color="color" @click="$emit('clicked', {color: color, name: name})">
    <span><b>{{ idx }}</b></span>
    <span v-if="locked" class="ra ra-lock"></span>
    <br/>
    <span v-if="name">{{ name }}</span>
    <br/>
    <span> {{ color.hex }}</span>
  </div>
`;
