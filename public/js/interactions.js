
// Mass editing =========================================================
let edit_mode = false;

let del_pressed = false;
let ctrl_pressed = false;
let shift_pressed = false;

let marked = [];
let bulk_iso = '';

document.onkeydown = function (e) {
  let key = e.key.toUpperCase();

  if (key == 'DELETE')
    del_pressed = true;
  if (key == 'SHIFT')
    shift_pressed = true;
  if (key == 'ESCAPE') {
    selects[0] = null;
    selects[1] = null;

    areaLayer.getSource().changed();
  }
};

document.onkeyup = function (e) {
  let key = e.key.toUpperCase();
  
  if (key == 'DELETE')
    del_pressed = false;
  if (key == 'SHIFT')
    shift_pressed = false;
};

map.on('pointermove', (event) => {
  if (edit_mode)
    return;

  // bulk set iso
  if (shift_pressed && bulk_iso) {
    map.forEachFeatureAtPixel(event.pixel, (feature, layer) => {
      feature.set('iso', bulk_iso);
    });
  }
  
  // bulk delete
  else if (del_pressed) {
    try {
      map.forEachFeatureAtPixel(event.pixel, (feature, layer) => {
        areaLayer.getSource().removeFeature(feature);
      });
    } catch(e) {
      
    }
  }
});


// Modify interaction ===================================================
var modify = new ol.interaction.Modify({
  source: areaLayer.getSource(),
  pixelTolerance: 20,
  insertVertexCondition: evt => !del_pressed,
	deleteCondition: evt => del_pressed,
});
var draw = new ol.interaction.Draw({
  source: areaLayer.getSource(),
  type: 'Polygon',
  //freehandCondition: evt => !del_pressed,
  condition: evt => !del_pressed,
});
var snap = new ol.interaction.Snap({
  source: areaLayer.getSource()
});



// Select interaction ===================================================
map.on('click', function(event) {
  selects[1] = null;

  // click is disabled in edit mode
  if (edit_mode)
    return;

  selects[0] = null;
  map.forEachFeatureAtPixel(event.pixel, function(feature) {
    selects[0] = feature;
  });
  
  areaLayer.getSource().changed();
});


// Context Menu =========================================================
var contextmenu = new ContextMenu({
  width: 170,
  defaultItems: false,
  items: []
});
map.addControl(contextmenu);

contextmenu.on('open', function (evt) {
  var feature = map.forEachFeatureAtPixel(evt.pixel, ft => ft);
  selects[1] = feature;
  
  contextmenu.clear();

  if (edit_mode)
    contextmenu.extend(contextmenuItems_editMode);
  else
    contextmenu.extend(contextmenuItems_objMode);

  areaLayer.getSource().changed();
});

let contextmenuItems_objMode = [
  {
    text: 'Merge into selection',
    callback: function() {
      if (!selects[0] || !selects[1])
        return;

      let feature = actions.merge(selects[0], selects[1]);

      let source = areaLayer.getSource();

      source.removeFeature(selects[0]);
      source.removeFeature(selects[1]);

      source.addFeature(feature);

      selects[0] = feature;
      selects[1] = null;

      //let filename = 'merge_'+selects[0].getId()+'_'+selects[1].getId()+'.geojson';
      //download_file(filename, JSON.stringify(cont));
      source.changed();
    }
  },
  {
    text: 'Separate MultiPolygon',
    callback: function() {
      if (!selects[1])
        return;

      let features = actions.separate(selects[1]);
      let source = areaLayer.getSource();
      
      if (features) {
        source.removeFeature(selects[1]);

        
        source.addFeatures(features);
  
        source.changed();
      }
    }
  },
  {
    text: 'Fill holes',
    callback: function() {
      if (!selects[1])
        return;

      actions.remove_holes(selects[1]);
      areaLayer.getSource().changed();
    }
  },
  '-',
  {
    text: 'Set name',
    callback: function() {
      if (!selects[1])
        return;
      let name = prompt('Enter name:', selects[1].get('name'));

      if (name)
        selects[1].set('name', name);

      areaLayer.getSource().changed();
    }
  },
  {
    text: 'Set country',
    callback: function() {
      if (!selects[1])
        return;

      let ISO = prompt('Enter iso:', selects[1].get('iso'));

      if (ISO) {
        selects[1].set('iso', ISO);
        bulk_iso = ISO;
      }

      areaLayer.getSource().changed();
    }
  },
  {
    text: 'Set Area ID',
    callback: function() {
      if (!selects[1])
        return;
      let id = prompt('Enter area ID:', selects[1].get('id'));

      if (id)
        selects[1].setId(id);

      areaLayer.getSource().changed();
    }
  },
  '-',
    {
      text: 'Delete',
      callback: function() {
        if (!selects[1]) {
          return;
        }
  
        areaLayer.getSource().removeFeature(selects[1]);
      }
    },
    '-',
    {
      text: 'Download',
      callback: function() {
        let cont = to_poly(selects[1]);
  
        let filename = selects[1].getId()+'.geojson';
  
        actions.download_file(filename, JSON.stringify(cont));
      }
    },
    {
      text: 'Properties',
      callback: function() {
        console.log(selects[1].getId(), selects[1].getGeometry().getType(), selects[1].getProperties());
      }
    },
];

let contextmenuItems_editMode = [
  {
    text: 'No menu in edit mode',
    callback: function() {
    }
  },
];

// File upload =========================================================
$('#file').onchange = function(e) {
  const file = e.target.files[0];
  const reader = new FileReader();
  reader.readAsText(file, "UTF-8");

  reader.onload = (evt) => {
    const geojson = JSON.parse(evt.target.result);
    actions.upload_file(geojson);
  };
}
