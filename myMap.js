var map_manager = {
    "map" : null,
    "map_items" : []
}

map_manager.map_items = [
    {
        "pokemon_id" : 12,
        "expire" : 1480829864,
        "longitude" : -73.45,
        "latitude" : 40.75
    },
    {
        "pokemon_id" : 2,
        "expire" : 1480829864,
        "longitude" : -73.46,
        "latitude" : 40.75
    }
]

function query_pokemon_data() {
    var bounds = map_manager.map.getBounds();
    // establish connection
    var apigClient = apigClientFactory.newClient();
    var params = {
        north: bounds.getNorth(),
        south: bounds.getSouth(),
        east: bounds.getEast(),
        west: bounds.getWest()
    };
    // query
    apigClient.mapPokemonGet(params, {}, {})
        .then(function(result){
            //console.log(result.data);
            map_manager.map_items = result.data;
        }).catch( function(result){
            //console.log(result);
        });
}

function formatNumberLength(number, length) {
    var r = "00" + number;
    return r.slice(-2);
}

function get_count_down_from_timestamp(expire) {
    var now_time = new Date().getTime() / 1000;
    var time_left = (expire - now_time * 1000) / 1000;
    if (time_left < 0) {
        return "";
    }
    //console.log(expire + " " + time_left);
    var second = Math.floor(time_left % 60);
    var minute = Math.floor(time_left / 60);
    return formatNumberLength(minute, 2) + ":" + formatNumberLength(second, 2);
}

function loadMapScenario() {
    var map = new Microsoft.Maps.Map(document.getElementById('myMap'), {
        credentials: 'AjZmbGB9OLnThq1IWaOe8EqA1ivi2lExihwHHDoEG6jk8SrcTkLKHGKF4Pyr0biI'
    });
    map_manager.map = map;
    window.setInterval(query_pokemon_data, 1000);
    window.setInterval(refresh_pokemon, 1000);
}


function refresh_pokemon() {
     // 1. Prepare pushpins
     var layer = new Microsoft.Maps.Layer();
     var pushpins = [];
     for (var i in map_manager.map_items) {
        var map_item = map_manager.map_items[i];
        //console.log(map_item);
        var icon_url = 'https://github.com/chenditc/mypokemon.io/raw/gh-pages/images/pushpin_images/pokemon/' + map_item["pokemon_id"] + '.png';
        var count_down = get_count_down_from_timestamp(map_item["expire"]);
        if (count_down !== "") {
            var pushpin = new Microsoft.Maps.Pushpin(new Microsoft.Maps.Location(map_item["latitude"], map_item["longitude"]), 
                                                 { title: count_down,
                                                   icon: icon_url});
            pushpins.push(pushpin);
        } else {
            // do nothing
        }
        
    }
    layer.add(pushpins);

    // 2. Remove old pushpins
    map_manager.map.layers.clear();
    
    // 3. Add new pushpins
    map_manager.map.layers.insert(layer);
}


