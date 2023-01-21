import React, { useEffect, useState } from 'react'
import '../styles/weather.scss'
import axios from 'axios'
import dayjs from 'dayjs'
import weekday from 'dayjs/plugin/weekday'
dayjs.extend(weekday)
interface weather {
    time: number;
}
export default function weather() {
    //所有地區天氣資料
    const [locationWeather, setLocationWeather] = useState<any>([])
    //預設新北市
    const [newTaipeiWeather, setNewTaipeiWeather] = useState<any>([])
    //下拉選單State
    const [choseCity, setChoseCity] = useState<number>(3);
    //星期
    const [selWeek, setSelWeek] = useState([
        '星期日',
        '星期一',
        '星期二',
        '星期三',
        '星期四',
        '星期五',
        '星期六'
    ])
    const getWeatherData = async () => {
        const response: any = await axios.get('https://opendata.cwb.gov.tw/api/v1/rest/datastore/F-D0047-091?Authorization=CWB-2B3B896B-C471-49CA-A28D-D099BCFA2FE7&format=JSON&elementName=MinT,MaxT,PoP12h,Wx,WeatherDescription')
        console.log(response);
        setLocationWeather(response.data.records.locations[0].location)
        setNewTaipeiWeather(response.data.records.locations[0].location[3].weatherElement)
    }
    //日期切換   data會有12個0值
    const [week, setWeek] = useState(0)
    function plus() {
        if (week < 12) {
            setWeek(week + 2)
        }
        return
    }
    function minus() {
        if (week <= 12 && week >= 2) {
            setWeek(week - 2)
        }
        return
    }
    //城市
    const moreCity = locationWeather.map((v: any, i: number) => {
        return (
            <option key={i} value={i}>
                {v.locationName}
            </option>
        );
    })

    //星期切換
    const displayWeekDay = locationWeather.length !== 0 &&
        selWeek[dayjs(locationWeather[choseCity].weatherElement[0].time[week].startTime).weekday()]
    //幾月幾號
    const howDates = locationWeather.length !== 0 &&
        dayjs(locationWeather[choseCity].weatherElement[0].time[week].startTime.split(' ')[0]).format('YYYY/MM/DD')
    //startTimes
    const startTimes = locationWeather.length !== 0 &&
        locationWeather[choseCity].weatherElement[0].time[week].startTime.split(' ')[1]
    //endTimes
    const endTimes = locationWeather.length !== 0 &&
        locationWeather[choseCity].weatherElement[0].time[week].endTime.split(' ')[1]
    //天氣描述
    const weatherState = locationWeather.length !== 0 &&
        locationWeather[choseCity].weatherElement[1].time[week].elementValue[0].value

    //天氣代碼
    const weatherTypes: any = {
        isThunderstorm: [15, 16, 17, 18, 21, 22, 33, 34, 35, 36, 41],
        isSunny: [1, 2, 3],
        isCloudy: [4, 5, 6, 7, 24, 25, 26, 27, 28],
        isPartiallyClearWithRain: [
            8, 9, 10, 11, 12, 13, 14, 19, 20, 29, 30, 31, 32, 38, 39,
        ],
        isSnowing: [23, 37, 42],
    }

    //天氣代碼
    const codeSelectLocation =
        locationWeather.length !== 0 &&
        +locationWeather[choseCity].weatherElement[1].time[week].elementValue[1].value
    const codeType = (codeSelectLocation: number | boolean) => {
        if (weatherTypes.isThunderstorm.includes(codeSelectLocation)) {
            return 'isPartiallyClearWithRain'
        } else if (weatherTypes.isSunny.includes(codeSelectLocation)) {
            return 'isSunny'
        } else if (weatherTypes.isCloudy.includes(codeSelectLocation)) {
            return 'isCloudy'
        } else if (weatherTypes.isPartiallyClearWithRain.includes(codeSelectLocation)) {
            return 'isPartiallyClearWithRain'
        } else if (weatherTypes.isSnowing.includes(codeSelectLocation)) {
            return 'isSnowing'
        } else {
            return
        }
    }

    //降雨機率
    const rain =
        locationWeather.length !== 0 &&
        +locationWeather[choseCity].weatherElement[0].time[week].elementValue[0].value



    useEffect(() => {
        getWeatherData()
    }, [])




    return (
        <div className='card'>
            <div className="area">
                <select name="" id="" value={choseCity} onChange={(e: any) => { setChoseCity(e.target.value) }}>
                    {moreCity}
                </select>
            </div>
            <div className="timeRwrap">
                <div onClick={() => {
                    minus()
                }}><i className="fa-solid fa-arrow-left"></i></div>
                {/* 星期幾 */}
                <p>{displayWeekDay}</p>
                {/* 幾月幾號 */}
                <p>{howDates}</p>
                <div onClick={() => {
                    plus()
                }}><i className="fa-solid fa-arrow-right"></i></div>
            </div>
            {/* 起始至結束時間 */}
            <div>{startTimes} ~ {endTimes}</div>
            {/* 天氣描述*/}
            {weatherState}
            <br />
            <br />
            <div className="icon">
                <img src={`/imgs/weather_icon/${codeType(codeSelectLocation)}.png`} alt={`${codeType(codeSelectLocation)}`} />
            </div>
            <br />
            <p>降雨機率{rain}%</p>
        </div>
    )
}
