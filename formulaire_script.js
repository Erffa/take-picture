
/* les éléments */
var
cameraView,
cameraSensor,
buttonSnapshot,
buttonRetry,
buttonDownload;

/* autorisation utiliser la caméra */
var autorisation = false;

/* contraintes caméra */
var constraints = { 
    video: { facingMode: "environment" }, 
    audio: false
};


/* */
var cam_width;
var cam_height;

window.onload = function() {

    cameraView   = document.getElementById("camera--view"),
    cameraSensor = document.getElementById("camera--sensor");

    buttonSnapshot = document.getElementById('camera--snapshot'),
    buttonRetry    = document.getElementById('camera--retry'),
    buttonDownload = document.getElementById('camera--download'),
    downloader     = document.getElementById('downloader');

    /* initialisation de la page */
    /* --------------------------------------------------------------------------- */
    cameraStart(cameraView);
    /* --------------------------------------------------------------------------- */
    step1()

    /* fonctions des boutons */
    /* --------------------------------------------------------------------------- */
    // step 1
    buttonSnapshot.onclick = () => {
        step2();        
        cameraSensor.width = cameraView.videoWidth;
        cameraSensor.height = cameraView.videoHeight;
        cameraSensor.getContext("2d").drawImage(cameraView, 0,0, cameraSensor.width, cameraSensor.height);

        var imageDataURL = cameraSensor.toDataURL('image/png');
        downloader.href = imageDataURL;
        downloader.download = getDateName() + ".png";
    }
    // step 2
    buttonRetry.onclick = () => { step1(); }
    buttonDownload.onclick = () => {
        console.log('download');
        step1();
    }
}


/* Etapes prise de photo */
/* ---------------------------------------------------------------------------------------- */
function step1() {
    setButtonVisibility('visible', 'hidden', 'hidden');
    cameraSensor.getContext("2d").clearRect(0,0, cameraSensor.width,cameraSensor.height);
}
function step2() {
    setButtonVisibility('hidden', 'visible', 'visible');
}
function step3() {
    setButtonVisibility('hidden', 'hidden', 'hidden');
}

/* ---------------------------------------------------------------------------------------- */

function setButtonVisibility(v1='hidden', v2='hidden', v3='hidden') {
    buttonSnapshot.style.visibility = v1;
    buttonRetry.style.visibility = v2;
    buttonDownload.style.visibility = v3;
}


function cameraStart() {
    navigator.mediaDevices
        .getUserMedia(constraints)
        .then( function(stream) {
            autorisation = true;
            track = stream.getTracks()[0];
            cameraView.srcObject = stream;
            cam_width  = track.getSettings()['width'];
            cam_height = track.getSettings()['height'];
            div_areas = document.getElementById('areas');
            div_areas.style.width = "" + cam_width + "px";
            div_areas.style.height = "" + cam_height + "px";
            console.log("width : " + cam_width + " ; height : " + cam_height);
        })
        .catch(function(error) {
            console.error("Oops. Something is broken.", error);
        });
}

function getDateName() {
    let d = new Date();
    return "" + d.getFullYear()  + "" + completeZeros(d.getMonth(),2) + "" + completeZeros(d.getDay(),2) + 
    "_" + completeZeros(d.getHours(),2) + completeZeros(d.getMinutes(),2) + completeZeros(d.getSeconds(),2);
}

/**
 * 
 * @param {*} n the number to modify into string
 * @param {*} l the min length of the string
 */
function completeZeros(n, l) {
    if (n<0) { throw "Positive number only"; }
    return (n >= Math.pow(10, l)) ? n : "0".repeat(l-Math.floor(Math.log10(n))-1) + n;
}