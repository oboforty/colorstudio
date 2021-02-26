
var actions = new (class{
  /**
   * Merges two features
   */
  merge(feature1, feature2) {
    let poly1 = to_poly(feature1);
    let poly2 = to_poly(feature2);
  
    var geojson = turf.union(poly1, poly2);
  
    let feature = feature1.clone();
    feature.setId(feature1.getId());
    feature.setGeometry(to_geom(geojson));
  
    return feature;
  }

  separate(feature) {
    if (feature.getGeometry().getType() != 'MultiPolygon') {
      alert("Feature is not a multipolygon!");
      return;
    }

    let poly = to_poly(feature);
    let id = feature.getId();
    let properties = poly.properties;
    let coordinates = poly.geometry.coordinates;
 
    let features = [];
    let i = 2;
    
    for(var polygon of coordinates)
    {
      // create ol features from split
      let feature2 = turf.polygon(polygon);
      feature2.id = id + " "+(i++);
      feature2.properties = properties;

      features.push(to_feature(feature2));
    }

    // largest polygon inherits the ID
    features.reduce(function(prev, current) {
      return (len(prev.getGeometry().getCoordinates()) > len(current.getGeometry().getCoordinates())) ? prev : current
    }).setId(id);

    return features;
  }

  remove_holes(feature) {
    let geom = feature.getGeometry();

    if (geom.getType() != 'Polygon') {
      alert("Can only remove holes in a polygon!");
      return;
    }

    let coordinates = geom.getCoordinates();
    coordinates = [coordinates[0]];
    geom.setCoordinates(coordinates);

    return feature;
  }

  /**
   * 
   */
  download_file(filename, text) {
    var element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
    element.setAttribute('download', filename);
  
    element.style.display = 'none';
    document.body.appendChild(element);
  
    element.click();
  
    document.body.removeChild(element);
  }
  
  /**
   * 
   */
  upload_file(geojson) {
    const format = (new ol.format.GeoJSON());
    const source = areaLayer.getSource();

    if (geojson['type'] == 'FeatureCollection')
    {
      for (let fgeo of geojson.features) {
        const feature = format.readFeature(fgeo);
        if (source.getFeatureById(feature.getId())) {
          console.error(`Feature ID${feature.getId()} is already added!`);
          return;
        }
        source.addFeature(feature);
      }
    } else if (geojson['type'] == 'Feature') {
      const feature = format.readFeature(geojson);
      if (source.getFeatureById(feature.getId())) {
        alert(`Feature ID${feature.getId()} is already added!`);
        return;
      }
      source.addFeature(feature);
    }else {
      console.error("Unsupported type : " + geojson['type']);
      // todo: parse other formats too? topojson, KML, GMT... all that shit
    }
  }
  
  /**
   * Initiates mesh generation
   */
  generate() {
    if (isGenerating)
      return false;
  
    let formData = new FormData();
    formData.append("map", mapId);
  
    isGenerating = true;
    $("#loader").style.display = 'inline-block';
    $("#play").style.display = 'none';
  
    fetch('/home/generate', {
      method: "POST",
      body: formData
    }).then(function(response) {
      return response.json();
    }).then((resp)=>{
      isGenerating = false;
      $("#loader").style.display = 'none';
      $("#play").style.display = 'inline-block';
    });
  }
  
  /**
   * 
   */
  download_all() {
    let cont = get_all();
  
    download_file('areas.geojson', JSON.stringify(cont));
  }

  /**
   * Clears all features
   */  
  delete_all() {
    if (confirm("Are you sure you want to clear the map?")) {
      areaLayer.getSource().clear();
    }
  }
  
  /**
   * 
   */
  save_workspace() {
    let cont = get_all();
    let backup = confirm("Backup previous workspace?");
  
    let formData = new FormData();
    formData.append('geojson', JSON.stringify(cont));
    formData.append("map", mapId);
    formData.append("backup", backup);
  
    fetch('/home/save', {
      method: "POST",
      body: formData
    }).then(function(response) {
      return response.json();
    }).then((resp)=>{
  
    });
  }

  
  /**
   * 
   */
  set_bulk_iso() {
    bulk_iso = prompt("Set iso:");

    if (bulk_iso == '')
      bulk_iso = null;
  }

  help() {
    alert("SHIFT+mouse: bulk sets areas to iso  -  DELETE+mouse: bulk deletes areas  -  CTRL+click: selects secondary area for polygon editing");
  }
  
  switch_edit_mode(b)
  {
    edit_mode = b;

    if (edit_mode)
    {
      map.addInteraction(modify);
      map.addInteraction(draw);
      map.addInteraction(snap);

      $("#object_mode").classList.remove("selected");
      $("#edit_mode").classList.add("selected");
    } else {
      map.removeInteraction(modify);
      map.removeInteraction(draw);
      map.removeInteraction(snap);
  
      $("#object_mode").classList.add("selected");
      $("#edit_mode").classList.remove("selected");
    }
    
    selects[0] = null;
    selects[1] = null;
    areaLayer.getSource().changed();
  }

  /**
   *
   */
  rename(fn) {
    let fn1 = prompt("New name:", fn);

    if (!fn1.includes(".geojson"))
      fn1 += ".geojson";

    let formData = new FormData();
    formData.append("map", fn);
    formData.append("new", fn1);

    fetch('/home/rename', {
      method: "POST",
      body: formData
    }).then(function(response) {
      return response.json();
    }).then((resp)=>{

    });
  }

  /**
   *
   */
  open_window() {
    $("#map-window").style.display = 'block';

    fetch('/home/files', {
      method: "GET",
    }).then(function(response) {
      return response.json();
    }).then((resp)=>{
      const d = $("#files");
      d.innerHTML = "";

      for(let fn of resp)
        d.innerHTML += `<div>${fn} (<button onclick="actions.rename('${fn}')">Rename</button>)</div>`;
    });
  }

  close_window() {
    $("#map-window").style.display = 'none';
    $("#files").innerHTML = "Loading...";
  }
})();