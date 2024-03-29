console.log('hello')
const API_KEY = "d1845658f92b31c64bd94f06f7188c9c";

function renderData(data){
    let newPara=document.createElement('p')
    newPara.textContent = `${data?.main?.temp.toFixed(2)} °C`
    document.body.appendChild(newPara)
}

async function getWeatherDetails(){

    try{
    // let latitude=15.3333
    // let longitude=74.0833
    
    let city = "goa";

    const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`);
    const data = await response.json();
    
    console.log("Weather data:-> " , data);
    
    renderData(data)
    }
    catch(e){
      console.error('Error is ', e)
    }

    
}

function getLocation(){
  if(navigator.geolocation){
    navigator.geolocation.getCurrentPosition(showPos)
  }
  else{
    console.log('doesnt support geolocation')
  }
}

function showPos(position){
  let lat = position.coords.latitude;
  let longi = position.coords.longitude;

  console.log(lat)
  console.log(lon)
}
