import { Menubar } from 'primereact/menubar'
import { useEffect, useRef, useState } from 'react'
import Credits from './components/credits'
import AppIcon from './assets/images/weather.png'
import { Card } from 'primereact/card'
import {Button} from 'primereact/button'
import {InputText} from 'primereact/inputtext'
import {IconField} from 'primereact/iconfield'
import {InputIcon} from 'primereact/inputicon'
import {Menu} from 'primereact/menu'
import {Toast} from 'primereact/toast'
import {ProgressSpinner} from 'primereact/progressspinner'
import { OverlayPanel } from 'primereact/overlaypanel';
import { Carousel } from 'primereact/carousel'
import SDK from './sdk'

export default function App() {
  const [weather,setWeather] = useState(null)
  const [city,setCity] = useState({
    lon:28.2824793,
    lat:-15.4164124
  })
  const [cities,setCities] = useState([])
  const [loading,setLoading] = useState(false)
  const sdk = new SDK()
  const toast = useRef(null)
  const searchMenuRef = useRef(null)
  const inputRef = useRef(null)

  useEffect(function(){
    getWeather()
  },[])

  function getWeather() {
    setLoading(true)
    sdk.forecast({lon:city.lon,lat:city.lat}).then((response)=>{
      console.log(response)
      setWeather(response)
      setLoading(false)
    }).catch((error)=>{
      setLoading(false)
      toast.current.show({ severity: 'error', summary: 'Failed to get weather data', detail: error.message })
      console.log(error)
    })
  }

  function searchCity(query,event=null) {
    setLoading(true)
    sdk.geo({q:query}).then((response)=>{
      console.log(response)
      setCities(response)
      searchMenuRef.current.show(event)
      setLoading(false)
    }).catch((error)=>{
      console.log(error)
      setLoading(false)
    })
    
    // sdk.search(query).then(function(response){
    //   if('error' in response) {
    //     toast.current.show({ severity: 'error', summary: 'Failed to get weather data', detail: response.error.message })
    //   } else {
    //     setCities(response)
    //     searchMenuRef.current.show(event)
    //     console.log(response)
    //   }
    //   setLoading(false)
    // }).catch(function(error){
    //   console.log(error)
    //   setLoading(false)
    // })
  }

  return (
    <>
    <Menubar style={{position:'sticky',top:'8px',backgroundColor:'white'}} start={(
      <img src={AppIcon} width={32} height={32} />
    )} model={[
      {label:"ICU Zambia",url:"https://www.icuzambia.net"},
      {label:"ZRDC",url:"https://www.zrdc.org"}
    ]} end={(
      <div style={{display:'flex'}}>
        <IconField>
          <InputIcon className={loading ? 'pi pi-spin pi-spinner' : 'pi pi-search'}/>
          <InputText placeholder="City name or Latitude,Longitude (decimal degree)" ref={inputRef}/>
        </IconField>
        <OverlayPanel ref={searchMenuRef}>
          <Menu model={cities.map(function(city){
            return {
              label:city.name,
              command: function(){
                setCity({
                  lon:city.lon,
                  lat:city.lat
                })
                getWeather()
                var e = new Event("click")
                searchMenuRef.current.hide(e)
              }
            }
          })} id='select-menu'/>
        </OverlayPanel>
        <Button onClick={function(e){searchCity(inputRef.current.value,e)}}  icon="pi pi-search" className="p-button-primary" />
        
      </div>
    )} />
    {(weather !== null) ? (
      <div style={{padding:"8px"}}>
        <div>
          <div style={{margin:"8px 0px"}}>
            <Card title={weather.city.name}
            subTitle={weather.city.country}>
            </Card>
          </div>
          <div>
            <Card title="Forecast">
              <Carousel 
                value={weather.list} 
                numVisible={3} 
                itemTemplate={(item)=>(
                  <div 
                    style={{margin:"0px 8px"}}>
                    <Card 
                      title={item.dt_txt} 
                      subTitle={item.weather[0].description}
                      header={<img src={`https://openweathermap.org/img/wn/${item.weather[0].icon}@4x.png`} />}></Card>
                  </div>
                )}
                responsiveOptions={[
                  {
                    breakpoint:"580px",
                    numVisible:1
                  },
                  {
                    breakpoint:"780px",
                    numVisible:2
                  },
                  {
                    breakpoint:"1000px",
                    numVisible:3
                  },
                  {
                    breakpoint:"1150px",
                    numVisible:4
                  }
                ]} />
              {/* <div style={{display:"flex",flexDirection:"row",gap:"8px",justifyContent:"center",flexWrap:"wrap"}}>
                {weather.list.map(function(forecast){
                  return (
                    <Card header={(
                      <img src={day.day.condition.icon} width={50} />
                    )} title={day.day.condition.text} subTitle={(
                      <ul>
                        <li>{day.date}</li>
                        <li>{day.day.mintemp_c} ℃ - {day.day.maxtemp_c} ℃</li>
                      </ul>
                    )} style={{width:200}}></Card>
                  )
                })}
              </div> */}
            </Card>
          </div>
        </div>
      </div>
    ) : (
      <>
      {(loading) ? (
        <center>
          <ProgressSpinner />
        </center>
      ) : (
        <div>Nothing to show!</div>
      ) }
      </>
    ) }
    <Credits />
    <Toast ref={toast} />
    </>
  )
}         
