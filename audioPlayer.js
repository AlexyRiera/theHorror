var active_source = null;

function stopActiveSource() {
    if (active_source) {
        active_source.onended = null; // manual stop, no event
        active_source.stop(0);
    }
}
// instead of requesting a new ArrayBuffer every time
// store them in a dictionnary
var buffers = {};
var context = new(window.AudioContext || window.webkitAudioContext)();

window.document=onload function(){
    
}

function playTrack(url) {
    // get from our dictionnary
    var buffer = buffers[url];
    // stop the active one if any
    stopActiveSource();
    // create a new BufferSource
    var source = context.createBufferSource();
    // it is now the active one
    active_source = source;
    source.onended = function() {
        active_source = null;
    };

    source.buffer = buffer;
    source.connect(context.destination);

    source.start(0);
}

//buttons
const playButton = document.getElementsByClassName('play');

// start by getting all AudioBuffers
var tracks = document.getElementsByClassName('track');

for (var i = 0, len = tracks.length; i < len; i++) {
    tracks[i].addEventListener('click', function(e) {
        playTrack(this.dataset.href);
        e.preventDefault();
    });
    getBuffer(tracks[i].dataset.href);
}


function getBuffer(url) {
    var request = new XMLHttpRequest();
    request.open('GET', url, true);
    request.responseType = 'arraybuffer';
    request.onload = function(evt) {
        context.decodeAudioData(request.response, store);
    };
    request.send();

    function store(buffer) {
        buffers[url] = buffer;
    }
}

