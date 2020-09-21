class Gif{
	constructor(name, user, url, mark, id){
        this.name = name;
        this.user = user;
		this.url = url;
        this.mark = mark;
        this.id = id;
    }
}

class Giphy{
    constructor(){
        this.API_KEY = 'bWxdHUpMboxqFxYI9YqCBnRQzj2Aokpv';
        this.URL_AUTOCOMPLETE = 'https://api.giphy.com/v1/gifs/search/tags';
        this.URL_SEARCH = 'https://api.giphy.com/v1/gifs/search';
        this.URL_TRENDING = 'https://api.giphy.com/v1/gifs/trending';
        this.URL_BASE = 'https://api.giphy.com/v1/gifs';
        this.URL_POPULAR_TRENDING = 'https://api.giphy.com/v1/trending/searches';
        this.URL_UPLOAD = 'https://upload.giphy.com/v1/gifs';
    }

    async getAutoComplete(textComplete) {
        let url = this.URL_AUTOCOMPLETE+'?api_key='+this.API_KEY+'&q='+textComplete;
        let response = await fetch(url);
        let dataAutoComplete = await response.json();
        return dataAutoComplete.data;
    }

    async search(text,page=0){
        let url = this.URL_SEARCH+'?api_key='+this.API_KEY+'&q='+text+'&limit=12&offset='+page;
        let response = await fetch(url);
        let dataSearch = await response.json();
        return dataSearch.data;
    }

    async getTrending(limit=12, offset=0){//async y await
        let response = await fetch(this.URL_TRENDING+'?api_key='+this.API_KEY+'&limit='+limit+'&offset='+offset);//concatenando
        let gifs = await response.json();
        return gifs.data;
    }

    async getPopularTrending(){
        let response = await fetch(this.URL_POPULAR_TRENDING+'?api_key='+this.API_KEY);
        let popular = await response.json();
        return popular.data;
    }

    async uploadGif(form){
        form.append('api_key', this.API_KEY);
        let response = await fetch(this.URL_UPLOAD, {method:'POST', body:form});
        let upload = await response.json();
        return upload.data;
    }

    async getGifsPorIds(ids){
        if(ids.length==0) return null;
        let returnData=null;
        await fetch(`${this.URL_BASE}?api_key=${this.API_KEY}&ids=${ids.toString()}`)
                .then(res=>res.json()
                    .then(data=>{
                        returnData=data.data;
                    })
                ).catch(err=>console.error(err));
        return returnData;
    }

    async getGifPorId(id){
        let returnData=null;
        await fetch(`${this.URL_BASE}?api_key=${API_KEY}&gif_id=${id}`)
            .then(res=>res.json()
                .then(data=>{
                    returnData = data.data;
                })
            ).catch(err=>console.error(err));
        return returnData;
    }

    addFavoritById(e){
        let favoritos = storage.getIdsFavoritos();
        if(favoritos.indexOf(e.id)<0)
            favoritos.push(e.id);
        storage.setIdsFavoritos(favoritos);
    }

    remFovoritById(e){
        let favoritos = storage.getIdsFavoritos();
        let i = favoritos.indexOf(e.id);
        if(i>=0)
            favoritos.splice(i,1);
        storage.setIdsFavoritos(favoritos);
    }

    async descargarGif (url, nombre) {
        await fetch(url).then((img)=> {
            img.blob().then((file)=>{
                let a = document.createElement("a");
                a.href = URL.createObjectURL(file);
                a.download= nombre;
                a.click();
            });
        });
    }

    setGifObject(gif){
        storage.miStorage.setItem(gif.id,JSON.stringify(gif));        
    }

    getGifObjects(){
        let gifs = storage.getIdsFavoritos();
        let gifsList=[];
        for (let i = 0; i <gifs.length; i++) {
            let gif = storage.miStorage.getItem(gifs[i]);
            if(gif!=null)
                gifsList.push(JSON.parse(gif));
        }
        return gifsList;
    }

    getMyGifObjects(){
        let gifs = storage.getIdsMyGifs();
        let gifsList=[];
        for (let i = 0; i <gifs.length; i++) {
            let gif = storage.miStorage.getItem(gifs[i]);
            if(gif!=null)
                gifsList.push(JSON.parse(gif));
        }
        return gifsList;
    }
}

let giphy = new Giphy();

class MiStorage{
    constructor(){
        this.miStorage = window.localStorage;
        this.favoritos = 'favoritos';
        this.mygifs = 'mygifs';
    }
    getIdsFavoritos(){
        let favoritos = this.miStorage.getItem(this.favoritos);
        return favoritos != null?favoritos.split(','):[];
    }
    setIdsFavoritos(e){
        this.miStorage.setItem(this.favoritos,e);
    }
    getIdFavoritos(id){
        let favoritos = this.getIdsFavoritos();
        return favoritos.indexOf(id)<0?null:favoritos[favoritos.indexOf(id)];
    }
    setIdMyGifs(e){
        let ids = this.miStorage.getItem(this.mygifs) != null? this.miStorage.getItem(this.mygifs).split(','): [];
        ids.push(e);
        this.miStorage.setItem(this.mygifs, ids);
    }
    getIdsMyGifs(){
        let mygifs = this.miStorage.getItem(this.mygifs);
        return mygifs != null?mygifs:'';
    }
    deleteIdMyGifs(id){
        console.log(id);
        let ids = this.miStorage.getItem(this.mygifs) != null? this.miStorage.getItem(this.mygifs).split(','): [];
        console.log(ids);
        let i = ids.indexOf(id);
        console.log(i);
        if (i>=0)
            ids.splice(i,1);
        this.miStorage.setItem(this.mygifs, ids);    
    }
}
let storage = new MiStorage();