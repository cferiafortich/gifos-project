// ELEMENTOS HTML

let txtBusqueda = document.getElementById('search-gif');
let btnBusqueda = document.getElementById('btn-search');
let divSugestion = document.getElementById('suggestion-bar');
let ulSugestion = document.getElementById('auto-complete-list');
let h1TitleResult = document.getElementById('title-result');
let divGifResult = document.getElementById('gif-result');
let btnSeeMore = document.getElementById('seemore-result');
let sectNoResult = document.getElementById('no-results-container');
let sectResult = document.getElementById('search-result');
let h1NoResult = document.getElementById('title-no-result');
let divTrending = document.getElementById('popular-trending');
let divCloseSearch = document.getElementById('close-search');
let divSearching = document.getElementById('searching');


let h2TrendingTitle = document.getElementById('trending-title')


let contenedorFullScreen = document.getElementById("full-screen");


const CLASS_FAVORITO='favorito';

// VARIABLES GLOBALES

let pagina = 0;

// divImgTrending.style.transform = 'translateX(' + ((-size-29) * counter) + 'px)';

// EVENTOS

txtBusqueda.addEventListener('keyup', (element)=>{
    if(txtBusqueda.value === ''){ 
        loadSuggestion();
    }else{ 
        if(element.keyCode === 13){ 
            search(txtBusqueda.value);
        }else{ 
            giphy.getAutoComplete(txtBusqueda.value).then(res =>{
            loadSuggestion(res);
            
            });
        }
    }
});

btnBusqueda.addEventListener('click', ()=>{
    if(txtBusqueda.value != '')
        search(txtBusqueda.value)
});

btnSeeMore.addEventListener('click', ()=>{
    pagina+=12;
    search(h1TitleResult.textContent, pagina);
});

divCloseSearch.addEventListener('click', ()=>{
    divSugestion.classList.remove('show');
    divSugestion.classList.add('hide');
    divCloseSearch.classList.remove('show');
    divCloseSearch.classList.add('hide');
});


// divImgTrending.addEventListener('transitionend', ()=>{
//     // if(imgsTrending[counter].id === 'last-clone'){
//         divImgTrending.style.transition = 'none';
//         counter = imgsTrending.length-2;
//         divImgTrending.style.transform = 'translateX(' + ((-size-22) * counter) + 'px)';
//     // }
// });

// FUNCIONES

function loadSuggestion(data = ''){
    

    if(data === '' || data.length === 0){
        divSugestion.classList.remove('show');
        divSugestion.classList.add('hide');
        
        // divCloseSearch.classList.remove('show');
        // divCloseSearch.classList.add('hide');

        // sectResult.classList.remove('show');
        // sectResult.classList.add('hide');
        
    }else{
        sectResult.classList.remove('hide');
        sectResult.classList.add('show');
        ulSugestion.innerHTML = '';
        
        data.forEach(e => {
            let li = document.createElement('li');
            li.textContent = e.name;
            li.addEventListener('click', (element)=>{search(element.target.textContent)});
            ulSugestion.appendChild(li);
        });
        divSugestion.classList.add('show');
        divSugestion.classList.remove('hide');
        divCloseSearch.classList.add('show');
        divCloseSearch.classList.remove('hide');
        divSearching.style.flexDirection = 'row-reverse';
        txtBusqueda.classList.add('margin-input');
        
    }
}

function search(text, page=0){
    pagina = page;

    if(page === 0){
        divGifResult.innerHTML = '';
        divSugestion.classList.remove('show');
        divSugestion.classList.add('hide');
        divCloseSearch.classList.remove('show');
        divCloseSearch.classList.add('hide');
        h1TitleResult.textContent = text;
    }
    
    
    giphy.search(text,page).then(data =>{
        console.log(data);
        if (data.length === 0 ){
            sectResult.classList.remove('show')
            sectResult.classList.add('hide')
            sectNoResult.classList.remove('hide')
            sectNoResult.classList.add('show')
            h1NoResult.textContent = text;
        }
        if(sectNoResult.classList.contains('show')){
            sectNoResult.classList.add('hide');
        }
        data.forEach(e => {
            
            let img = document.createElement('img');
            img.src = e.images.preview_gif.url;
            img.alt = e.title;
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
                divFullByID.insertAdjacentElement('afterbegin',imgFullScreen);
                divFullByID.classList.add("show-full");
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
            divGifResult.appendChild(divContentGif);

            let divContentInfo = document.createElement('div');
            let divContentUser = document.createElement('div');
            divContentInfo.classList.add('info-container-search');
            divContentUser.classList.add('div-user-search');
            divContentUser.innerHTML = e.username;
            divContentInfo.appendChild(divContentUser);

            let divContentTitle = document.createElement('div');
            divContentTitle.classList.add('div-title-search');
            divContentTitle.innerHTML = e.title;
            divContentInfo.appendChild(divContentTitle);

            divContentGif.appendChild(divContentInfo);

            let gifImg = divContentGif.querySelector('img');
            
            gifImg.dataset.url=e.images.downsized.url;
            gifImg.dataset.nombre=e.title;
            gifImg.dataset.username=e.username;
            gifImg.dataset.titulo=e.title;
            gifImg.id = e.id;
            

            gifImg.addEventListener('click', (ev)=>{
                
                let imgFullScreen = document.createElement("img");
                imgFullScreen.src=ev.currentTarget.dataset['url'];
                imgFullScreen.classList.add('img-full');
                divFullByID.insertAdjacentElement('afterbegin',imgFullScreen); // contenedorFullScreen
                divFullByID.classList.add("show-full"); // contenedorFullScreen

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

function loadPopularTrending(){
    
    giphy.getPopularTrending().then(data =>{
        console.log(data);
        for (let i = 0; i < 5; i++) {
            let divTrendingTxt = document.createElement('span');
            divTrendingTxt.textContent = data[i] + (i==4?'':', ');
            divTrending.appendChild(divTrendingTxt);
            divTrendingTxt.addEventListener('click', (e)=>{
                search(e.target.textContent.substring(0,e.target.textContent.length-2));
                sectResult.classList.remove('hide');
                sectResult.classList.add('show');
            });
        }
    });

}


loadPopularTrending();



