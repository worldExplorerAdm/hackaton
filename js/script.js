var map;
var indexSalvo = null;
var polos;
var markersArray = [];
var polosOrdenados = [];
var ocorrenciasCatastroficas = [];
var latPesquisa;
var lngPesquisa;

window.onload = function()
{
    var defaultBounds = new google.maps.LatLngBounds(
        new google.maps.LatLng(-33.8902, 151.1759),
        new google.maps.LatLng(-33.8474, 151.2631)
    );
    
    var input = document.getElementById('searchTextField');

    var options = {
        bounds: defaultBounds,
        types: ['establishment']
    };

    initMap();
    
    var input = document.getElementById('autocomplete');
    var autocomplete = new google.maps.places.Autocomplete(input);

    buscarInfoEventos();
};

function buscarCatastrofe()
{
    ocorrenciasCatastroficas.forEach((e) => {
        if (((latPesquisa + 0.5) >= e.latitude) && ((latPesquisa - 0.5) <= e.latitude) && ((lngPesquisa + 0.5) >= e.longitude) && ((lngPesquisa - 0.5) <= e.longitude) )
        {
            criarMarcador(e.latitude, e.longitude, e.categoria, e.titulo);
        }
    });
}

function initMap() 
{
    map = new google.maps.Map(document.getElementById('map'), 
    {
        center: {lat: -19.747348, lng: -47.939176},
        zoom: 5,
        mapTypeId: 'hybrid'
    });
}

function criarMarcador(latitude, longitude, icon, titulo)
{
    switch (icon)
    {
        case 'Landslides':
            icon = './imagens/Landslides.png';
        break;
        case 'Volcano':
            icon = './imagens/Volcano.png';
        break;
        case 'Avalanche':
            icon = './imagens/avalanche.png';
        break;
        case 'CO2':
            icon = './imagens/co2.png';
        break;
        case 'Comet':
            icon = './imagens/comet.png';
        break;
        case 'Drought':
            icon = './imagens/drought.png';
        break;
        case 'DustStorm':
            icon = './imagens/dust-storm.png';
        break;
        case 'Earthquake':
            icon = './imagens/earthquake.png';
        break;
        case 'Fire':
            icon = './imagens/fire.png';
        break;
        case 'Flood':
            icon = './imagens/flood.png';
        break;
        case 'ForestFire':
            icon = './imagens/forest-fire.png';
        break;
        case 'Hole':
            icon = './imagens/hole.png';
        break;
        case 'Snow':
            icon = './imagens/snow.png';
        break;
        case 'Storm':
            icon = './imagens/storm.png';
        break;
        case 'Tornado':
            icon = './imagens/tornado.png';
        break;
        case 'Tsunami':
            icon = './imagens/tsunami.png';
        break;
        case 'Wind':
            icon = './imagens/wind.png';
        break;
        default:
            icon = './imagens/gps_comum.png';
        break;
    }
    
    var markerC = new google.maps.Marker({
        title: titulo,
        position: new google.maps.LatLng(latitude, longitude),
        icon: icon,
        map: map
    });
    
    markersArray.push(markerC);
    map.setZoom(8);
    map.panTo(markerC.position);

    if (titulo)
    {
        var  infowindowC = new google.maps.InfoWindow({
            content: titulo
        });
    
        markerC.addListener('click', 
            function()
            {
                infowindowC.open(map, markerC);
            }
        );
    }
}

function geolocate()
{
    var geocoder =  new google.maps.Geocoder();
    
    geocoder.geocode({'address': $('#autocomplete').val()}, function(results, status)
    {
        if (status == google.maps.GeocoderStatus.OK)
        {
            latPesquisa = results[0].geometry.location.lat();
            lngPesquisa = results[0].geometry.location.lng();
            criarMarcador(latPesquisa, lngPesquisa);            
            buscarCatastrofe();
        }
        else
        {
            alert("Nâo foi possivel realizar a busca.");
        }
    });
}

function buscarInfoEventos()
{
    var evento, categoria, descricao, titulo, latitude, longitude;

    $.ajax({
        url: "https://eonet.sci.gsfc.nasa.gov/api/v2.1/events",
        method: 'GET',
        data: {'days': 365},
        success:
            function (result)
            {
                evento = result.events;
                
                evento.forEach(element => {
                    categoria = element.categories[0].title;
                    descricao = element.description;
                    titulo = element.title;
                    
                    if (element.geometries[0].coordinates[0] instanceof Array)
                    {
                        latitude = element.geometries[0].coordinates[0][0][0];
                        longitude = element.geometries[0].coordinates[0][0][1];
                    }
                    else
                    {
                        latitude = element.geometries[0].coordinates[0];
                        longitude = element.geometries[0].coordinates[1];
                    }
                    
                    data = element.geometries[0].date;
                    
                    ocorrenciasCatastroficas.push({categoria, descricao, titulo, latitude, longitude, data});
                });
            },
        error:
            function()
            {
                console.log("Ocorreu um erro ao verificar as informações.");
            }
    });
}
