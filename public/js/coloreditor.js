import '/js/components/frame.mjs';


let gui = new Vue({
  el: '#app-gui',
});

window.gui = gui;

export function init() {
  const app = gui.$refs['frame-app'];

  fetch('/project.json?stamp='+time())
  .then(response => response.json())
  .catch((error) => {
    app.init();

    Vue.nextTick(()=>{
      save_project(app);
    });
  })
  .then((data) => {
    load_project(app, data);
  });
  
}

document.addEventListener("keydown", function(e) {
  if ((window.navigator.platform.match("Mac") ? e.metaKey : e.ctrlKey)  && e.keyCode == 83) {
    e.preventDefault();

    save_project(gui.$refs['frame-app']);
  }
}, false);

window.save_project = function(app) {
  const format = app.copy_mode;
  let data = {
    "name": app.name,
    "layout": app.layout,
    "format": app.copy_mode,
    "open_editor": app.editor,
    "grids": []
  };

  for (let i of app.tabs) {
    let name = app.gridnames[i];
    let grid = app.grid(i);

    let g = {
      cols: grid.cols,
      rows: grid.rows,
      name: name,
      colors: [],
      names: []
    };

    for(let i of range(grid.cols*grid.rows))
    {
      let cb = grid.colbox(i+1);

      g.colors.push(cb.color.hex); //[format];
      g.names.push(cb.name||"");
    }

    data.grids.push(g);
  }

  let json = JSON.stringify(data);
  let formData = new FormData();
  formData.append("content", json);

  fetch('/home/save', {
    method: "POST",
    body: formData
  }).then(function(response) {
    return response.json();
  }).then((resp)=>{
    console.log("Saved project");
  });
}

window.load_project = function(app, data) {
  app.name = data.name;
  app.copy_mode = data.format;
  app.layout = data.layout;
  app.editor = data.open_editor;

  let i = 0;
  for (let g of data.grids) {
    app.newTab();
    app.renameTab(i, g.name);
    i++;
  }

  Vue.nextTick(()=>{
    i = 0;

    for (let g of data.grids) {
      let grid = app.grid(i);
      grid.cols = g.cols;
      grid.rows = g.rows;

      for(let i of range(grid.cols*grid.rows)) {
        let cb = grid.colbox(i+1);

        cb.color = new Color(g.colors[i] || "white");
        cb.name = g.names[i] || null;
      }
      
      i++;
    }
  
  });

};