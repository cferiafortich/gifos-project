// ELEMENTOS HTML //

let divImgTrending = document.getElementById('img-trending');
let prevBtn = document.getElementById('prev-btn');
let nextBtn = document.getElementById('next-btn');
let divFullByID = document.getElementById('full-screen');
let divClose = document.getElementById('close-full');
let divFavFull = document.getElementById('fav-full');
let divDownloadFull = document.getElementById('download-full');
let divInfoFull = document.getElementById('info-full');
let divUserFull = document.getElementById('user-full');
let divTitleFull = document.getElementById('title-full');



// VARIABLES GLOBALES //

let counter = 0;
let size = window.innerWidth <= 375?243:357;
let gap = window.innerWidth <= 375?22:29;
maxMovement = window.innerWidth <= 375?-2915:-3474;
let movimiento = 0;

// EVENTOS //
divDownloadFull.addEventListener('click', (ev)=>{
    giphy.descargarGif(ev.currentTarget.dataset['url'],ev.currentTarget.dataset['nombre']);
});

divFavFull.addEventListener('click', (ev)=>{
    
    if(ev.currentTarget.classList.contains(CLASS_FAVORITO)){
        ev.currentTarget.classList.remove(CLASS_FAVORITO);
        giphy.remFovoritById(ev.currentTarget);
    }else{
        ev.currentTarget.classList.add(CLASS_FAVORITO);
        giphy.addFavoritById(ev.currentTarget);
    }
});

divClose.addEventListener('click', ()=>{
    divFullByID.classList.remove('show-full-fav');
    divFullByID.classList.remove('show-full-slider');
    divFullByID.classList.remove('show-full');
    divFullByID.removeChild(divFullByID.childNodes[0]);
});

prevBtn.addEventListener('click', ()=>{
    // divImgTrending.style.transition = 'transform 0.4s ease-in-out';
    
    
    if(counter<0){ 
        divImgTrending.style.transition = 'transform 0.4s ease-in-out';
        counter++;
        movimiento = movimiento + (size+gap);
        divImgTrending.style.transform = 'translateX(' + movimiento + 'px)';
        
    }
    console.log(movimiento);
    console.log(counter);
});

nextBtn.addEventListener('click', ()=>{
    
    if (movimiento > maxMovement){
        divImgTrending.style.overflow = 'unset';
        divImgTrending.style.transition = 'transform 0.4s ease-in-out';
        
        counter--;
        movimiento = (size+gap) * counter;
        
        divImgTrending.style.transform = 'translateX(' + movimiento + 'px)';
        console.log(movimiento);
        console.log(counter);
    }
    
    
});

// FUNCIONES //

function trendings(){
    

    giphy.getTrending(limit=12, offset=0).then(data=>{
        console.log(data);

        data.forEach(e =>{
            let img = document.createElement('img');
            img.src = e.images.preview_gif.url;
            img.alt = e.title;
            img.id = e.id;
            img.dataset.username = e.username;
            divImgTrending.appendChild(img);

             //DESCARGA
             let divDescarga = document.createElement("div");
           
             divDescarga.id=e.id;
             divDescarga.dataset.url= e.images.downsized.url;//almacenado datos como atributos de elemento html
             divDescarga.dataset.nombre= e.title;
             divDescarga.classList.add("descarga");
             divDescarga.addEventListener("click",(ev)=>{
                 giphy.descargarGif(ev.currentTarget.dataset['url'],ev.currentTarget.dataset['nombre']);
             });

             //FAVORITOS
            let divfavorito = document.createElement("div");
            divfavorito.id=e.id;
            divfavorito.classList.add("no-favorito");//todos los gif empiezan sin ser favoritos
            if(storage.getIdFavoritos(e.id)!=null)//Se evalua si el gif está en favorito
                divfavorito.classList.add(CLASS_FAVORITO);//Si es favorito, se agrega la clase 
            divfavorito.addEventListener("click",(ev)=>{
                //En esta sección podría operar con el atributo mark que tengo en el objeto almacenado en el localStorage
                if(ev.currentTarget.classList.contains(CLASS_FAVORITO)){
                    //Si tiene la clase favorito se elimina porque lo están retirando
                    ev.currentTarget.classList.remove(CLASS_FAVORITO);
                    giphy.remFovoritById(ev.currentTarget);
                }else{
                    //Si NO tiene la clase favorito se adiciona porque lo están agregando
                    ev.currentTarget.classList.add(CLASS_FAVORITO);
                    giphy.addFavoritById(ev.currentTarget);
                }
            });

            //MAXIMIZAR
            let divFullScreen = document.createElement("div");
            divFullScreen.classList.add('full-screen');
            divFullScreen.id=e.id;
            divFullScreen.dataset.url=e.images.downsized.url;
            divFullScreen.dataset.nombre=e.title;
            divFullScreen.dataset.username=e.username;
            divFullScreen.dataset.titulo=e.title;
            divFullScreen.addEventListener('click',(ev)=>{
                let imgFullScreen = document.createElement("img");
                imgFullScreen.src=ev.currentTarget.dataset['url'];
                imgFullScreen.classList.add('img-full');
                divFullByID.insertAdjacentElement('afterbegin',imgFullScreen); // contenedorFullScreen
                divFullByID.classList.add("show-full-slider"); // contenedorFullScreen
                divFavFull.id = ev.currentTarget.id;
                divDownloadFull.dataset.url=ev.currentTarget.dataset['url'];
                divDownloadFull.dataset.nombre=ev.currentTarget.dataset['nombre'];
                if(storage.getIdFavoritos(ev.currentTarget.id)!=null)//Se evalua si el gif está en favorito
                    divFavFull.classList.add(CLASS_FAVORITO);
                divUserFull.dataset.username = ev.currentTarget.dataset['username'];
                divUserFull.textContent=divUserFull.dataset['username'];
                divTitleFull.dataset.titulo=ev.currentTarget.dataset['titulo'];
                divTitleFull.textContent=divTitleFull.dataset['titulo'];
            });    

            let divContentGif = document.createElement('div');
            let divContentEvents = document.createElement('div');
            divContentGif.classList.add('gif-container'); 
            divContentGif.appendChild(divContentEvents);
            divContentEvents.appendChild(divDescarga);
            divContentEvents.appendChild(divfavorito);
            divContentEvents.appendChild(divFullScreen);
            divContentGif.appendChild(img);
            divImgTrending.appendChild(divContentGif);

            let divContentInfo = document.createElement('div'); //informacion del gif
            let divContentUser = document.createElement('div'); //inf
            divContentInfo.classList.add('info-container');
            divContentUser.classList.add('div-user');
            divContentUser.textContent = e.username;
            divContentInfo.appendChild(divContentUser);
            
            let divContentTitle = document.createElement('div'); //inf
            divContentTitle.classList.add('div-title');
            divContentTitle.textContent = e.title;
            divContentInfo.appendChild(divContentTitle);

            divContentGif.appendChild(divContentInfo);

            let gifImg = divContentGif.querySelector('img');
            
            gifImg.dataset.url=e.images.downsized.url;
            gifImg.dataset.nombre=e.title;
            gifImg.dataset.username=e.username;
            gifImg.dataset.titulo=e.title;
            gifImg.addEventListener('click', (ev)=>{
                
                let imgFullScreen = document.createElement("img");
                imgFullScreen.src=ev.currentTarget.dataset['url'];
                imgFullScreen.classList.add('img-full');
                divFullByID.insertAdjacentElement('afterbegin',imgFullScreen); // contenedorFullScreen
                divFullByID.classList.add("show-full-slider"); // contenedorFullScreen
                divFavFull.id = ev.currentTarget.id;
                divDownloadFull.dataset.url=ev.currentTarget.dataset['url'];
                divDownloadFull.dataset.nombre=ev.currentTarget.dataset['nombre'];
                if(storage.getIdFavoritos(ev.currentTarget.id)!=null)//Se evalua si el gif está en favorito
                    divFavFull.classList.add(CLASS_FAVORITO);
                divUserFull.dataset.username = ev.currentTarget.dataset['username'];
                divUserFull.textContent=divUserFull.dataset['username'];
                divTitleFull.dataset.titulo=ev.currentTarget.dataset['titulo'];
                divTitleFull.textContent=divTitleFull.dataset['titulo'];
                
            });
            

        });

        
    });
}

trendings();

function eventsCard() {
    
}