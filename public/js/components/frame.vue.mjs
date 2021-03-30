export const template = `
  <div class="frame">

    <div>
      <!-- Menu -->
    </div>

    <div class="d-flex">
      <div class="flex-justify pt-1 pb-3 pr-4 pl-4">

        <!-- Palette tabs -->
        <b-tabs card :data-change="change_tab" class="border rounded">
          <b-tab v-for="i in tabs" :key="'dyn-tab-' + i"  @click="opengrid(i)">
            <template #title>
              <span class="mr-3">{{ gridnames[i] }}</span>

              <b-button size="sm" variant="danger" @click="renameTab(i)"><span class="ra ra-highlighter"></span></b-button>
              <b-button size="sm" variant="danger" @click="closeTab(i)"><span class="ra ra-delete"></span></b-button>
            </template>
            
            <color-grid :ref="'grid'+i" :layout="layout" :colorblind="colorblind" @clicked="onclick($event, i)" />
          </b-tab>
  
          <template #tabs-end>
            <b-nav-item role="presentation" @click.prevent="newTab" href="#"><b>+</b></b-nav-item>
          </template>
  
          <template #empty>
            <div class="text-center text-muted">
              There are no open tabs<br>
              Open a new tab using the <b>+</b> button above.
            </div>
          </template>
        </b-tabs>
        
        <!-- General settings -->
        <div class="border rounded p-4 mt-3">
          <h5>Settings</h5>
          
          <span>Grid size:</span>
          <div class="input-group mb-3">
            <input type="number" class="form-control" v-model.number="set_rows" placeholder="X">
            <div class="input-group-append"><span class="input-group-text">x</span></div>
            <input type="number" class="form-control" v-model.number="set_cols" placeholder="Y">
          </div>
            <!--
          <div class="input-group mb-3">
            <input type="text" class="form-control" placeholder="Project name">
            <div class="input-group-append">
              <button class="btn btn-outline-secondary" type="button" style="width: 150px;">Save</button>
            </div>
          </div> -->

          <div class="input-group mb-3">
            <div class="input-group-prepend">
              <span class="input-group-text">Color Layout</span>
            </div>

            <b-form-select v-model="layout" :options="layouts"></b-form-select>
          </div>
          <div class="input-group mb-3" v-if="layout=='colorblind'">
            <div class="input-group-prepend">
              <span class="input-group-text">Colorblind class</span>
            </div>

            <b-form-select v-model="colorblind" :options="colorblinds"></b-form-select>
          </div>
          <div class="input-group mb-3">
            <div class="input-group-prepend">
              <span class="input-group-text">Copy mode</span>
            </div>

            <b-form-select v-model="copy_mode" :options="copy_modes"></b-form-select>
          </div>

        </div>
      </div>

      <!-- Sidebar editors -->
      <div class="p-2 mr-3 toolbar border rounded">

        <div class="btn-group d-flex" role="group">
          <button @click="editor = 'yuv'" type="button" class="btn btn-outline-info"><span class="ra ra-paint-roller"></span></button>
          <button @click="editor = 'blending'" type="button" class="btn btn-outline-info"><span class="ra ra-paint-bucket"></span></button>
          <button @click="editor = 'genetic'" type="button" class="btn btn-outline-info"><span class="ra ra-points"></span></button>
        </div>
        
        <setcolor ref="setcolor" @setcolor="setcolor" @setname="setname" class="m-2"/>

        <hr />

        <blending v-if="editor == 'blending'" class="m-2" @setcolor="setcolor" ref="editor-blending" />
        <genetic v-if="editor == 'genetic'" class="m-2" @setcolor="setcolor" ref="editor-genetic" />
        <yuv v-if="editor == 'yuv'" class="m-2" @setcolor="setcolor" ref="editor-yuv" />
      </div>
    </div>

  </div>
`;
