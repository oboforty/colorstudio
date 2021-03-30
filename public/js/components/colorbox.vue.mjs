export const template = `
  <div class="color-box border rounded border-dark p-3" :style="style" :data-color="color" @click="$emit('clicked', {color: color, name: name})">

    <div v-if="layout=='meta'">
      <span><b>{{ idx }}</b></span>
      <span v-if="locked" class="ra ra-lock"></span>
      <br/>
      <span v-if="name">{{ name }}</span>
      <br/>
      <span> {{ color.hex }}</span>  
    </div>
  
    <div v-else-if="layout=='hsl'">

      <div class="progress progress-lg">
        <div class="progress-bar border" role="progressbar" :style="saturation_style">S</div>
        <div class="progress-bar border" role="progressbar" :style="lightness_style">L</div>
      </div>
      
    </div>

    <div v-else-if="layout=='rgb'">

      <div class="progress progress-lg">
        <div class="progress-bar border" role="progressbar" :style="red_style"></div>
        <div class="progress-bar border" role="progressbar" :style="green_style"></div>
        <div class="progress-bar border" role="progressbar" :style="blue_style"></div>
      </div>
      
    </div>
    
    <div v-else-if="layout=='colorblind'">
      <!-- <div><span>Red-blind:</span> <div class="color-sm border d-inline-block" :style="red_cb_class"></div></div>
      <div><span>Blue-blind:</span> <div class="color-sm border d-inline-block" :style="blue_cb_class"></div></div> -->
    </div>

  </div>
`;
