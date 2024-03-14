// 2 tabs 
let userTab=document.querySelector('[data-userWeather]')
let searchTab=document.querySelector('[data-searchWeather]')
// single container
let userContainer=document.querySelector('.weather-container')
// 5 screens
let grantAccessContainer=document.querySelector('.grant-location-cointainer')
let searchForm=document.querySelector('.form-container')
let userInfoContainer=document.querySelector('.user-info-container')
let loadingScreen=document.querySelector('.loading-container')
let errorScreen=document.querySelector('.error_screen')

// initial variables
let currentTab = userTab   //application will start at user tab by default
const API_KEY = "d1845658f92b31c64bd94f06f7188c9c";
currentTab.classList.add('current-tab')
getFromSessionStorage()

//

function switchTab(clickedTab){
  if(clickedTab!=currentTab){
    //  currentTab.classList.remove('current-tab')
    //  clickedTab.classList.add('current-tab')
    //  currentTab=clickedTab 
      currentTab.classList.remove('current-tab')
      currentTab=clickedTab 
      currentTab.classList.add('current-tab')

    if(!searchForm.classList.contains('active')){  
        //search vaale tab me jaare h
        userInfoContainer.classList.remove('active')
        grantAccessContainer.classList.remove('active')
        searchForm.classList.add('active')
    }   
    else{
        //user weather vaale tab me jaare h
        searchForm.classList.remove('active')
        userInfoContainer.classList.remove('active')
        errorScreen.classList.remove('active')
        //weather display karna h jaise hi your weather tab me aae
        getFromSessionStorage(); //local storage se coordinates liye
    }
  }
}

userTab.addEventListener('click',()=>{
    //pass clicked tab as input
    switchTab(userTab)
})
searchTab.addEventListener('click',()=>{
    //pass clicked tab as input
    switchTab(searchTab)
})

// check if coordinates are present in local Storage 
function getFromSessionStorage(){
    let localStorage=sessionStorage.getItem('userCoordinates');          //adding pending?????
    if(!localStorage){
      grantAccessContainer.classList.add('active')
    }
    else{
      let coordinates=JSON.parse(localStorage)
      fetchUserWeather(coordinates)
    }
}

async function fetchUserWeather(coordinates) {
    console.log('6')
    const {lat, lon} = coordinates;
    // make grantcontainer invisible
    grantAccessContainer.classList.remove("active");
    //make loader visible
    loadingScreen.classList.add("active");

    //API CALL
    try {
        const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
          );
        const  data = await response.json();

        loadingScreen.classList.remove("active");
        userInfoContainer.classList.add("active");
        renderWeatherInfo(data);
    }
    catch(err) {
        loadingScreen.classList.remove("active");
        //HW

    }

}

function renderWeatherInfo(data){

    if(data?.message === "city not found"){
        userInfoContainer.classList.remove('active')
        errorScreen.classList.add('active')
    }
    else{
        errorScreen.classList.remove('active')
    let cityName=document.querySelector('[data-cityName]')
    let countryIcon=document.querySelector('[data-countryIcon]')
    let weatherDesc=document.querySelector('[data-weatherDesc]')
    let weaterIcon=document.querySelector('[data-weatherIcon]')
    let temp=document.querySelector('[data-temp]')
    let windSpeed=document.querySelector('[data-windSpeed]')
    let humidity=document.querySelector('[data-humidity]')
    let clouds=document.querySelector('[data-cloud]')

    // fetch values from data and put in elements 
    cityName.innerText=data?.name
    countryIcon.src=`https://flagcdn.com/144x108/${data?.sys?.country.toLowerCase()}.png`
    weatherDesc.innerText=data?.weather?.[0]?.description
    weaterIcon.src=`http://openweathermap.org/img/w/${data?.weather?.[0]?.icon}.png`
    temp.innerText=data?.main?.temp+` °C`
    windSpeed.innerText=`${data?.wind?.speed } m/s`
    humidity.innerText=data?.main?.humidity +'%'
    clouds.innerText=data?.clouds?.all+ '%'    
    }

    
}

//grant location
function getcurrentLocWea() {
    if(navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition);
    }
    else {
        //HW - show an alert for no gelolocation support available
        alert('goelocation not supported')
    }
}

function showPosition(position) {
    console.log('4')
    const userCoordinates = {
        lat: position.coords.latitude,
        lon: position.coords.longitude
    }

    sessionStorage.setItem("userCoordinates", JSON.stringify(userCoordinates));
    console.log('3')
    fetchUserWeather(userCoordinates);

}

let grantAccessButton=document.querySelector('[data-grantAccess]')
grantAccessButton.addEventListener('click',getcurrentLocWea)

//searchForm 

let searchInput=document.querySelector('[data-searchInput]')

searchForm.addEventListener('submit',(e)=>{
    e.preventDefault()
    if(searchInput.value==''){
        alert('add city')
        return
    }
    
    fetchSearchWeather(searchInput.value)
})

async function fetchSearchWeather(city){
    loadingScreen.classList.add('active')
    grantAccessButton.classList.remove('active')
    userInfoContainer.classList.remove('active')

    try{
      let response=await fetch( `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`)
      let data= await response.json()

      loadingScreen.classList.remove('active')
      userInfoContainer.classList.add('active')
      renderWeatherInfo(data)
    }
    catch(e){
      
    }
}
