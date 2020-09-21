let darkMode = document.getElementById('dark-mode');
let darkStorage = localStorage.getItem('darkStorage');

const enableDarkMode = () =>{
    document.body.classList.add('dark');
    localStorage.setItem("darkStorage", "enabled");
};

const disableDarMode = () => {
    document.body.classList.remove('dark');
    localStorage.setItem("darkStorage", null);
};

if(darkStorage==='enabled'){
    enableDarkMode();
}

darkMode.addEventListener('click', ()=>{
    darkStorage = localStorage.getItem("darkStorage");
    if (darkStorage !== "enabled") {
        enableDarkMode();
    }
    else{
        disableDarMode();
    }
});

