
"use strict"

// Datų kūrimas
let todayDate = new Date();
// dienų įrašymas į card'us
let week = new Array('Sk.', 'Pr.', 'An.', 'Tr.', 'Kt.', 'Pn.', 'Št.')
let nDay = []; // dienos, kurioms pateikiama orų prognozė
nDay.push(todayDate.getDate());
let newDate = new Date(todayDate.getFullYear(), todayDate.getMonth(), todayDate.getDate()); // pagalbinis kintamas, kad iteruojant dienos tvarkingai 'peršoktų' iš vieno mėnesio į kitą
let todayMonth = todayDate.getMonth() + 1;
let dateArray = [];
dateArray.push(todayDate.getFullYear() + '-' + todayMonth + '-' + todayDate.getDate())
let newDateMonth;
let newDateDate;
let divNextDay = document.querySelectorAll('#nextDay');
for (let i = 0; i < divNextDay.length; i++) {
    newDate.setDate(newDate.getDate() + 1);
    nDay[i+1] = newDate.getDate(); 
    divNextDay[i].innerHTML = `${week[(todayDate.getDay() + 1 + i) % 7]} ${nDay[i+1]} d.`;
    newDateMonth = new Intl.NumberFormat('lt-LT', { minimumIntegerDigits: 2 }).format(newDate.getMonth() + 1);
    newDateDate = new Intl.NumberFormat('lt-LT', { minimumIntegerDigits: 2 }).format(newDate.getDate());
    dateArray.push(`${newDate.getFullYear()}-${newDateMonth}-${newDateDate}`);
    }
let shortDate = dateArray[0];

let weather;
const fetchWeather = async(callback) => {
    weather = await fetch(
        'https://api.meteo.lt/v1/places/kaunas/forecasts/long-term'
    ).then(res => res.json());
};

//Nurodytos (pa'click'intos) dienos duomenų atrinkimas
function clickDay(value){
    return  value.forecastTimeUtc.includes(shortDate);
}

const showWeather = async () => {

    // getting the weather data from api
    await fetchWeather();
    
    let weatherItems = weather.forecastTimestamps;
    let iSky; 

    function pickIcon(wCond, dTime){       
        if (wCond === 'overcast') { // debesuota 
            return iSky = 'wi wi-cloud'; 
            } else if (wCond === 'light-rain' || wCond === 'moderate-rain' || wCond === 'heavy-rain'){  // lietus
                return iSky = 'wi wi-rain';
            } else if (wCond === 'fog'){  // rūkas 
                return iSky = 'wi wi-fog';
            } else if (wCond === 'sleet'){  //Šlapdriba
                return iSky = 'wi wi-rain-mix';
            } else if (wCond === 'light-snow' || wCond === 'moderate-snow' || wCond === 'heavy-snow'){ // sniegas
                iSky = 'wi wi-snow';
            } else if (wCond === 'na'){ // nenustatyta
                return iSky = 'wi wi-na';
            } else if (dTime >= 6 && dTime <= 21 ){  // diena nuo 9:00 iki 16:00
                if (wCond === 'clear'){  // saulėta
                    return iSky = 'wi wi-day-sunny';
                } else if (wCond === 'isolated-clouds' || wCond === 'scattered-clouds') {
                    return iSky = 'wi wi-day-cloudy'; // debesuota su pragiedruliais
                    } else return iSky = 'wi wi-na';
            } else if (dTime < 6 || dTime > 21 ){ //naktis nuo 17:00 iki 8:00
                if (wCond === 'clear'){
                    return iSky = 'wi wi-night-clear'  // giedra naktis
                } else if (wCond === 'isolated-clouds' || wCond === 'scattered-clouds') {
                    return iSky = 'wi wi-night-alt-cloudy'; // debesuota su pragiedruliais
                    } else return iSky = 'wi wi-na';
            } else return iSky = 'wi wi-na';
    };

    calculateWeather();

    function calculateWeather(){  // Nurodytos (pa'click'intos) dienos orų skaičiavimas

     //duomenys
    let weatherItems = weather.forecastTimestamps;
    weatherItems = weatherItems.filter(clickDay)

    let pTime;
    let iSkyIconClass, pTemp, iHour;
    let iPrecipitIconClass, pPrecipit;
    let iWindIconClass, pWind, iWind;
    let parentDiv = document.querySelector('.d31');
    
    for (let weatherItem of weatherItems) {       
             
        let childDiv = document.createElement('div');
        childDiv.setAttribute("class", "d-flex flex-column align-items-center d33");
        
        pTime = weatherItem.forecastTimeUtc.slice(11,16);
        addData(pTime, childDiv);
        
        iHour = weatherItem.forecastTimeUtc.slice(11,13);
                 
        pickIcon(weatherItem.conditionCode, iHour);
        iSkyIconClass = iSky
       
        addIcon(iSkyIconClass, childDiv);

        pTemp = Math.round(weatherItem.airTemperature) + '°';        
        addData(pTemp, childDiv);
        
        iPrecipitIconClass = 'wi wi-raindrops';
        addIcon(iPrecipitIconClass, childDiv);
       
        pPrecipit = weatherItem.totalPrecipitation + ' mm';
        addData(pPrecipit, childDiv);

        iWind = weatherItem.windDirection;
        iWindIconClass = windIcon(iWind);
        addIcon(iWindIconClass, childDiv);
       
        pWind = weatherItem.windSpeed + ' m/s';
        addData(pWind, childDiv);

        parentDiv.appendChild(childDiv);
    }
    
    function addData(measure, div){
        let pItem = document.createElement('p'); 
        pItem.textContent = measure;  
        div.appendChild(pItem); 
    }

    function addIcon(className, div){
        let iIcon = document.createElement('i'); 
        iIcon.setAttribute("class", className);  
        let pItem = document.createElement('p'); 
        pItem.appendChild(iIcon);  
        div.appendChild(pItem); 
    }

    function windIcon(direction){
        if (direction>= 338 || direction <= 22){
            return 'wi wi-direction-down';
        } else if (direction >= 292){
            return 'wi wi-direction-down-right';
        } else if (direction >= 247){
            return 'wi wi-direction-right';
        } else if (direction >= 202){
            return 'wi wi-direction-up-right';
        } else if (direction >= 157){
            return 'wi wi-direction-up';
        } else if (direction >= 112){
            return 'wi wi-direction-up-left';
        } else if (direction >= 67){
            return 'wi wi-direction-left';
        } else if (direction > 22){
            return 'wi wi-direction-down-left';
        } else return 'wi wi-na';
    }
}
 
let card = document.querySelectorAll('.card');

    for (let i = 0; i < card.length; i++) {
        card[i].onclick = function (e) {
            shortDate = dateArray[i];
            removeWeather()
            calculateWeather();
            document.querySelector('div#bigCard p#withNote').id = "withoutNote";
            document.querySelector('#bigCard').id = 'smallCard';
            e.target.id = 'bigCard';
            document.querySelector('div#bigCard p#withoutNote').id = "withNote";
        }      
    }

    function removeWeather(){
        let wthr = document.getElementById('dHour');
        while (wthr.firstChild){
            wthr.removeChild(wthr.firstChild)
        }
    }

// Card'uose nurodytų dienų orų suvetinės skaičiavimas

let dayT = document.querySelectorAll('.dayT');
let nightT = document.querySelectorAll('.nightT');
let p23 = document.querySelectorAll('.p23')
let pi = document.querySelectorAll('p.pi2 > i');
for (let i=0; i<dateArray.length; i++){
    function cardDay(value){
        return  value.forecastTimeUtc.includes(dateArray[i]);
    }
    weatherItems = weather.forecastTimestamps; //duomenys
    weatherItems = weatherItems.filter(cardDay);
    let tempArray = [];
    let cloudArray = [];
    let windArray = [];
    let sumWindSpeed = 0;
    let j=0  // reikia skaičiuoti kiek weatherItem yra pateikiama
    
    for (let weatherItem of weatherItems) {
        tempArray.push(Math.round(weatherItem.airTemperature)); 
        windArray.push(weatherItem.windSpeed);
        sumWindSpeed += weatherItem.windSpeed;
        let cloudObject = makeClouds(
            weatherItem.forecastTimeUtc.slice(11,13), weatherItem.conditionCode);
            cloudArray.push(cloudObject);
            j++;
        }
    function makeClouds(hours, clouds){
        return{hours, clouds}
    }
    
    let maxTemp = Math.max(...tempArray);
    let minTemp = Math.min(...tempArray);
    dayT[i].innerHTML = maxTemp + '°';
    nightT[i].innerHTML = minTemp + '°';
    let averageWindSpeed = sumWindSpeed / (j + 1);
    let cloudA
    if (cloudArray.find(item => item.hours == 12)){
        cloudA = cloudArray.find(item => item.hours == 12)
    } else {
        cloudA = cloudArray[0];
    }
    let cloudCond = cloudA.clouds
    
    pickIcon(cloudCond, cloudA.hours)
    pi[i].setAttribute("class", iSky);

    let note1;     // note1 naudojamas tik .card'uose trumpam oro aprašymui

    if (iSky === 'wi wi-cloud') { 
        note1 = 'Apniukęs dangus';   
    } else if (iSky === 'wi wi-rain'){  
        note1 = 'Lietus iš pilkų debesų'
    } else if (iSky === 'wi wi-fog'){  
        note1 = 'Rūkas';
    } else if (iSky === 'wi wi-rain-mix'){  
        note1 = 'Apniukęs dangus, šlapdriba'
    } else if (iSky === 'wi wi-snow'){ 
        note1 = 'Apniukęs dangus, sniegas'
    } else if (iSky === 'wi wi-day-sunny' || iSky === 'wi wi-night-clear' ){              
        note1 = 'Giedras dangus';
    } else if (iSky === 'wi wi-day-cloudy' || iSky === 'wi wi-night-alt-cloudy'){
        note1 = 'Debesuota su pragiedruliais';
    } else if (iSky === 'wi wi-na'){ 
        note1 = 'Duomenų apie debesuotumą nėra';  
    }  
    console.log(averageWindSpeed)
    if (averageWindSpeed === 0 && averageWindSpeed < 1.6){
        note1 = note1 + ' ir be vėjo';
    } else  if (averageWindSpeed < 5.4){
        note1 = note1 + ' ir silpnas vėjas';
    }else  if (averageWindSpeed < 7.9){
        note1 = note1 + ' ir vidutinio stiprumo vėjas';
    }else  if (averageWindSpeed < 13.8){
        note1 = note1 + ' ir stiprus vėjas';
    }else  if (averageWindSpeed < 28.5){
        note1 = note1 + ' ir labai stiprus vėjas';
    }else  if (averageWindSpeed >= 38.5){
        note1 = note1 + ' ir uragano stiprumo vėjas';
    } else note1 =  note1 + ' o duomenų apie vėją nėra';

    p23[i].innerHTML = note1;
    
}

}

showWeather()

