export const template = `<div>

  <div class="row">
    <div :class="cell_class"  v-for="i in rows*cols">
      <color-box :ref="'col'+i" :idx="i" :color="fetch_color(i)" @clicked="$emit('clicked', {color: $event.color, name: $event.name, i: i})" />
    </div>
  </div>

</div>`;
