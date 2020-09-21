// ELEMENTOS GLOBALES

let containerMyGifos = document.getElementById('images-gifos');
let divNoGifos = document.getElementById('no-gifos');

const CLASS_FAVORITO = 'favorito'

giphy.getGifsPorIds(storage.getIdsMyGifs()).then((gifsData) => {
    console.log(gifsData);//TODO: eliminar
    if (gifsData == null ){
        divNoGifos.classList.remove('hide')
        divNoGifos.classList.add('show-flex')
        
    }
    if(gifsData!=null)
        gifsData.forEach(gifData => {
            
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
                
                
                divDownloadFull.dataset.url=ev.currentTarget.dataset['url'];
                divDownloadFull.dataset.nombre=ev.currentTarget.dataset['nombre'];
                
                divUserFull.dataset.username = ev.currentTarget.dataset['username'];
                divUserFull.textContent=divUserFull.dataset['username'];
                divTitleFull.dataset.titulo=ev.currentTarget.dataset['titulo'];
                divTitleFull.textContent=divTitleFull.dataset['titulo'];
            });

            //ELIMINAR
            let divDelete = document.createElement("div");
            divDelete.classList.add('trash');
            divDelete.id=gifData.id;
            
            divDelete.addEventListener('click', (id)=>{
                console.log(divDelete.id);
                storage.deleteIdMyGifs(divDelete.id);
                
            });

            let divContentGif = document.createElement('div');
            let divContentEvents = document.createElement('div');
            divContentGif.classList.add('gif-container'); 
            divContentGif.appendChild(divContentEvents);
            divContentEvents.appendChild(divDescarga);
            divContentEvents.appendChild(divDelete);
            divContentEvents.appendChild(divFullScreen);
            divContentGif.appendChild(img);
            containerMyGifos.appendChild(divContentGif);

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

        });
});

let obtenerObejtoEnStorage = function () {
    let gifs = giphy.getMyGifObjects();
    console.log(gifs);
    //showInit(gif);
}
obtenerObejtoEnStorage();