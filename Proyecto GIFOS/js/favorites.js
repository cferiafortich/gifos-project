//#########Globales###########//
let contenedorFavorites = document.getElementById("images-favorites");
let divNoFavorites = document.getElementById('no-favorites');

const CLASS_FAVORITO='favorito';
// let giphy = new Giphy();
//let storage =typeof(storage)==='undefined'?new MiStorage():storage;
giphy.getGifsPorIds(storage.getIdsFavoritos()).then((gifsData) => {
    console.log(gifsData);//TODO: eliminar
    if (gifsData.length === 0 ){
        divNoFavorites.classList.remove('hide')
        divNoFavorites.classList.add('show-flex')
        
    }
    if(gifsData!=null)
        gifsData.forEach(gifData => {
            //let nGif = new Gif(gifData.title, gifData.username, gifData.images.preview_gif.url, false, gifData.id);
            //showInit(nGif);
            let img = document.createElement("img");
            img.src=gifData.images.preview_gif.url;
            img.id=gifData.id;
                //DESCARGA
            let divDescarga = document.createElement("div");
                
            divDescarga.id=gifData.id;
            divDescarga.dataset.url= gifData.images.downsized.url;//almacenado datos como atributos de elemento html
            divDescarga.dataset.nombre= gifData.title;
            divDescarga.classList.add("descarga");
            divDescarga.addEventListener("click",(ev)=>{
                giphy.descargarGif(ev.currentTarget.dataset['url'],ev.currentTarget.dataset['nombre']);
            });

            //FAVORITOS
            let divfavorito = document.createElement("div");
            divfavorito.id=gifData.id;
            divfavorito.classList.add("no-favorito");//todos los gif empiezan sin ser favoritos
            if(storage.getIdFavoritos(gifData.id)!=null)//Se evalua si el gif está en favorito
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
            divFullScreen.id=gifData.id;
            divFullScreen.dataset.url=gifData.images.downsized.url;
            divFullScreen.dataset.nombre=gifData.title;
            divFullScreen.dataset.username=gifData.username;
            divFullScreen.dataset.titulo=gifData.title;
            divFullScreen.addEventListener('click',(ev)=>{
                let imgFullScreen = document.createElement("img");
                imgFullScreen.src=ev.currentTarget.dataset['url'];
                imgFullScreen.classList.add('img-full');
                divFullByID.insertAdjacentElement('afterbegin',imgFullScreen);
                divFullByID.classList.add("show-full-fav");
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
            contenedorFavorites.appendChild(divContentGif);

            let divContentInfo = document.createElement('div');
            let divContentUser = document.createElement('div');
            divContentInfo.classList.add('info-container-search');
            divContentUser.classList.add('div-user-search');
            divContentUser.innerHTML = gifData.username;
            divContentInfo.appendChild(divContentUser);

            let divContentTitle = document.createElement('div');
            divContentTitle.classList.add('div-title-search');
            divContentTitle.innerHTML = gifData.title;
            divContentInfo.appendChild(divContentTitle);

            divContentGif.appendChild(divContentInfo);

            let gifImg = divContentGif.querySelector('img');

            gifImg.dataset.url=gifData.images.downsized.url;
            gifImg.dataset.nombre=gifData.title;
            gifImg.dataset.username=gifData.username;
            gifImg.dataset.titulo=gifData.title;
            gifImg.addEventListener('click',(ev)=>{
                let imgFullScreen = document.createElement("img");
                imgFullScreen.src=ev.currentTarget.dataset['url'];
                imgFullScreen.classList.add('img-full');
                divFullByID.insertAdjacentElement('afterbegin',imgFullScreen);
                divFullByID.classList.add("show-full-fav");
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

let showInit = function(gif){
    let img = document.createElement("img");
    img.src=gif.url;
    img.id=gif.id;
    contenedorFavorites.appendChild(img);

 
}

let obtenerObejtoEnStorage = function () {
    let gifs = giphy.getGifObjects();
    console.log(gifs);
    //showInit(gif);
}
obtenerObejtoEnStorage();