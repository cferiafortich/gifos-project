//ELEMENTOS
let btnAction = document.getElementById('btn-action');
let containerGif = document.getElementById('create-gif');
let step1 = document.getElementById('step1');
let step2 = document.getElementById('step2');
let step3 = document.getElementById('step3');
let timer = document.getElementById('timer');
let uploading = document.getElementById('uploading');
let divDescarga = document.getElementById('descarga');
let divLink = document.getElementById('link');
let divUpload = document.getElementById('upload');

//CONSTANTES
const COMENZAR = 'COMENZAR';
const GRABAR = 'GRABAR';
const FINALIZAR = 'FINALIZAR';
const SUBIR_GIF = 'SUBIR GIFO';

//VARIABLES
let timerControl, sec = 0; min = 0, mil=0;
let recorder;

//EVENTOS
btnAction.addEventListener('click', ()=>{
    switch (btnAction.textContent) {
        case COMENZAR:
            comenzar();
            break;
        case GRABAR:
            grabar();
            break;
        case FINALIZAR:
            recorder.stopRecording(finalizar);
            break;
        case SUBIR_GIF:
            subirGif(); 
        break;     
        default:
            break;
    }
});

//FUNCIONES

let comenzar = function(){
    btnAction.classList.add('hide');
    containerGif.innerHTML =    `<div class="create-gif-title">
                                    ¿Nos das acceso <br> a tu cámara?
                                </div>
                                <div class="create-gif-text">
                                El acceso a tu camara será válido sólo<br>
                                por el tiempo en el que estés creando el GIFO.
                                </div>`;
    step1.classList.add('selected');

    let constraints = {
        audio: false,
        video: {
            width: {ideal: 480},
            height: {ideal: 320}
        }
    }

    navigator.mediaDevices.getUserMedia(constraints)
        .then(function(stream) {
            
            let video = document.createElement('video');
            video.srcObject = stream;
            video.play().then(()=>{
                containerGif.innerHTML='';
                containerGif.appendChild(video);
                step1.classList.remove('selected');
                step2.classList.add('selected');
                btnAction.classList.remove('hide');
                btnAction.textContent = GRABAR;
                timer.innerHTML = '<span>00</span>:<span>00</span>:<span>00</span>';
                timer.classList.remove('hide');
            });
            recorder = RecordRTC(stream, {
                type: 'gif',
                frameRate: 1,
                quality: 10,
                width: 480,
                hidden: 320,
                onGifRecordingStarted: function() {
                 console.log('started')
               },
              });
        })
        .catch(function(err) {
            btnAction.classList.remove('hide');
            alert('Debes permitir el uso de la camara para grabar tu GIF');

        });
}

let grabar = function(){
    timerControl = setInterval(cronometro, 10);
    btnAction.textContent = FINALIZAR;
    recorder.startRecording();
}


let cronometro = function() {
    mil++;
    if (mil >= 99) {
        mil = 0;
        sec++;
        if (sec >= 60) {
            sec = 0;
            min++;
        }
    }
    
    timer.innerHTML = '<span>' + (min ? (min > 9 ? min : "0" + min) : "00") + "</span>:<span>" + (sec ? (sec > 9 ? sec : "0" + sec) : "00") + "</span>:<span>" + (mil > 9 ? mil : "0" + mil) + '</span>';
}

let finalizar = function(){
    
    clearInterval(timerControl);
    containerGif.innerHTML = `<img src="${URL.createObjectURL(recorder.getBlob())}">`;
    btnAction.textContent = SUBIR_GIF;
    let repeat = document.createElement('span');
    repeat.textContent = 'REPETIR CAPTURA';
    repeat.classList.add('repeat');
    repeat.addEventListener('click', comenzar);
    timer.innerHTML = '';
    timer.appendChild(repeat);
    
}

let subirGif = function(){
    uploading.classList.remove('hide');
    btnAction.classList.add('hide');
    timer.classList.add('hide');
    step2.classList.remove('selected');
    step3.classList.add('selected');
    let form = new FormData();
    form.append('file', recorder.getBlob(), `mygif${Date.now()}.gif`);
    giphy.uploadGif(form).then(data =>{
        divDescarga.addEventListener('click', ()=>{
            giphy.descargarGif(URL.createObjectURL(recorder.getBlob()),`mygif${Date.now()}.gif`);
        });
        divLink.addEventListener('click', ()=>{
            let a = document.createElement('a');
            a.target = '_blank';
            a.href = `https://giphy.com/gifs/${data.id}`;
            a.click();
        });
        uploading.classList.add('hide');
        divUpload.classList.remove('hide');
        storage.setIdMyGifs(data.id);
    });
}