'use client'
import { useEffect, useRef, useState } from "react"
import { HexColorPicker } from 'react-colorful';
import axios from 'axios';
import Google from "next-auth/providers/google";
import ListView from "./components/ListView";
import { SessionProvider, signIn, useSession } from "next-auth/react";
import { createContext } from "react";
interface data_type {
  sequence: number,
  id: string,
  name: string,
  color: string
}
function getTextColor(hexColor: any){
  const c = hexColor.substring(1)
  const rgb = parseInt(c, 16)
  const r = (rgb >> 16) & 0xff
  const g = (rgb >> 8) & 0xff
  const b = (rgb >> 0) & 0xff
  const luma = 0.2126 * r + 0.7152 * g + 0.0722 * b

  const result = luma < 127.5 ? '#FFFFFF' : '#000000'
  return result
}

function getchData(setChData: any){
  return axios({
    method: "get",
    url: "/api/data/get",
  })
  .then((response) => setChData(response.data))
  .catch((error) => console.log(error))
}
const getFollow = async (id: string) => {
  const response = await axios({
      url: `https://bjapi.afreecatv.com/api/${id}/station`,
  })
  return (response.data.station.upd.fan_cnt / 10000).toFixed(1) + '만';
}
export default function Home() {
  const [Login, setLogin] = useState(false)
  const [isediting, setIsediting] = useState(false)
  const [textColor, setTextcolor] = useState("#000000")
  const [id, setId] = useState("")
  const [isLoding, setIsLoding] = useState(true)
  const [color, setColor] = useState("#164532")
  const [oldColor, setOldColor] = useState("#164532")
  const [chData, setChData] = useState([{"sequence": 0,"id": "ecvhao","name": "우왁굳","color": "#164532"}, {"sequence": 1,"id": "inehine","name": "아이네♪","color": "#8A2BE2"}, {"sequence": 2,"id": "jingburger1","name": "징버거☆","color": "#F0A957"}, {"sequence": 3,"id": "lilpa0309","name": "릴파♥","color": "#443965"}, {"sequence": 4,"id": "cotton1217","name": "주르르_","color": "#FF008C"}, {"sequence": 5,"id": "gosegu2","name": "고세구!","color": "#467EC6"}, {"sequence": 6,"id": "viichan6","name": "_비챤","color": "#95C100"}])
  var sortedChData = chData.sort((a: data_type, b: data_type) => a.sequence - b.sequence);
  const [showModal, setShowModal] = useState(false)
  const [showLoginModal, setShowLoginModal] = useState(false)
  const [showColorpicker, setShowColorpicker] = useState(false)
  const [isSetting, setIsSetting] = useState(false)
  const { data: session, status } = useSession();
  const ThemeContext = createContext("null");
  const [setTheme, theme] = useState("light")
  const [follows, setFollows] = useState<any>({});

  useEffect(() => {
    if(isediting && !isSetting){
        console.log("edit end")
        axios({method: "post", url: "/api/data/edit", data: sortedChData})
        .then((response) => setChData(response.data))
        return setIsediting(false)
    }
    if(!isediting && isSetting){
        setIsediting(true)
        return console.log("edit start")
    }
}, [isSetting])
  useEffect(() => {
      const fetchFollows = async () => {
          const newFollows: any = {};

          for (const item of chData) {
              const follow = await getFollow(item.id);
              newFollows[item.id] = follow;
          }

          setFollows(newFollows);
      };

      fetchFollows();
  }, [sortedChData]);
  const onChange = (event: any) => {
    setId(event.target.value);
  }
  const handleChange = (event: any) => {
    const newValue = event.target.value;
    if (newValue[0] !== '#') {
      return;
    }
    if (!/^#[0-9A-F]{0,6}$/i.test(newValue)) {
      return;
    }
    setColor(newValue);
  };
  useEffect(() => {
    setTextcolor(getTextColor(color))
  }, [color])
  useEffect(() => {
    if(status != "loading"){
        const item: any = window.localStorage.getItem('isLoggedIn')
        if(!item){
          const addItem = () => window.localStorage.setItem('isLoggedIn', 'false');
          addItem();
          setLogin(false)
          setIsLoding(false)
          console.info('[LoginCheck]addSuccess')
        } else if(item === 'false'){
          if(session){
            axios({
              method: "get",
              url: "/api/auth/check"
            })
            .then(async () => {
              setLogin(true); 
              window.localStorage.setItem('isLoggedIn', 'true');
              await getchData(setChData);
              setIsLoding(false);
            })
            .catch(() => {setLogin(false); window.localStorage.setItem('isLoggedIn', 'false'); setIsLoding(false);})            
          }
          setLogin(false)
          setIsLoding(false)
          return console.log("you need login to google.")
        }
        else{
          if(!session){
            setLogin(false)
            return window.localStorage.setItem('isLoggedIn', 'false');
          }
          axios({
            method: "get",
            url: "/api/auth/check"
          })
          .then(async () => {
            setLogin(true); 
            window.localStorage.setItem('isLoggedIn', 'true');
            await getchData(setChData);
            setIsLoding(false);
          })
          .catch(() => {setLogin(false); window.localStorage.setItem('isLoggedIn', 'false'); setIsLoding(false);})
        }
      }
    }, [status])
    useEffect(()=>{
      sortedChData = chData.sort((a: data_type, b: data_type) => a.sequence - b.sequence);
    }, [chData])
    if(isLoding){
      return (
        <ThemeContext.Provider value={{ theme, setTheme }}>
        <div style={{width: "100vw", height: "100svh", backgroundColor: "#1C1C1E"}}>
          <div className="autotextcolor" style={{fontSize: "2.25rem", fontWeight: "bold", display: "flex", alignItems: "center", height: "100svh",  marginLeft: "16px"}}>WAKFREECA<br />LAUNCHER</div>
        </div>
        </ThemeContext.Provider>      
      ); 
    }
  return (
    <ThemeContext.Provider>
      <header className="container Top autotextcolor">
        <span style={{marginLeft:"4.444444444444445%", fontSize: '0.75rem', fontWeight: '700'}}><p style={{margin: 0, fontWeight: '700'}}>WAKFREECA</p>LAUNCHER</span>
        <button style={{marginLeft: "auto", marginRight: "4.444444444444445%", background: "none", border: "none", color: "#999999"}} className="material-symbols-rounded"  onClick={() => {isSetting? setIsSetting(false) : setIsSetting(true)}}>{isSetting? "check_circle": "settings"}</button>
      </header>
      <main style={{margin: "1rem"}}>
        <ListView chData={chData} isSetting={isSetting} setIsediting={setIsediting} setChData={setChData} isediting={isediting} setShowModal={setShowModal} sortedChData={sortedChData} follows={follows}></ListView>
      </main>




      {/* 이하 모달 모음 */}

      {/* 추가 모달 */}
      <div className={showModal ? 'modal active' : 'modal'} onClick={() => setShowModal(false)}>
        <div className="modal-content" onClick={e => e.stopPropagation()}>
          <div className="modal-button container" style={{fontSize: "0.875rem"}}>
            <input placeholder="아이디" style={{ height: "100%", background: "none", border: "none", paddingLeft:"4.444444444444445%"}} value={id} onChange={onChange}></input>
            <span style={{marginLeft: "auto", marginRight: "16px", background: "none", border: "none", color: "#999999"}} className="material-symbols-rounded" onClick={() => setId("")}>cancel</span>
          </div>
          <button className="modal-button container" style={{fontSize: "0.875rem", paddingInline: "none"}} onClick={() => {setOldColor(color); setShowColorpicker(true);}}>
            <span style={{marginLeft:"4.444444444444445%"}} className="autotextcolor">{color}</span>
            <span style={{marginLeft: "auto", marginRight: "16px", background: "none", backgroundColor: color, width: "24px", height: "24px", borderRadius: "32px"}} className="autooutlinecolor"></span>
          </button>
          <button className="modal-bottom-button autotextcolor" style={{fontSize: "0.875rem", height: '21.43%', width: '48.91%', float: "left"}}>취소</button>
          <button className="modal-bottom-button" style={{fontSize: "0.875rem", height: '21.43%', backgroundColor: color, width: '48.91%', float: "left", marginLeft: "2.18%", color: textColor}}>저장</button>
        </div>
      </div>

      {/* 컬러피커 모달 */}
      <div className={showColorpicker ? 'modal_2 active' : 'modal_2'} onClick={() => {setColor(oldColor); setShowColorpicker(false)}}>
      <div className="modal-content" onClick={e => e.stopPropagation()} style={{height: "63vh", justifyContent: 'space-between', alignItems: 'center'}}>
        <HexColorPicker color={color} onChange={setColor} style={{marginBottom: "8px"}} />
        <div className="button-container">
          <button style={{backgroundColor: '#164532', color: textColor, border: "2px solid #FFFFFF", borderRadius: "24px"}} onClick={() => {setColor('#164532')}}></button>
          <button style={{backgroundColor: '#8A2BE2', color: textColor, border: "2px solid #FFFFFF", borderRadius: "24px"}} onClick={() => {setColor('#8A2BE2')}}></button>
          <button style={{backgroundColor: '#F0A957', color: textColor, border: "2px solid #FFFFFF", borderRadius: "24px"}} onClick={() => {setColor('#F0A957')}}></button>
          <button style={{backgroundColor: '#443965', color: textColor, border: "2px solid #FFFFFF", borderRadius: "24px"}} onClick={() => {setColor('#443965')}}></button>
          <button style={{backgroundColor: '#FF008C', color: textColor, border: "2px solid #FFFFFF", borderRadius: "24px"}} onClick={() => {setColor('#FF008C')}}></button>
          <button style={{backgroundColor: '#467EC6', color: textColor, border: "2px solid #FFFFFF", borderRadius: "24px"}} onClick={() => {setColor('#467EC6')}}></button>
          <button style={{backgroundColor: '#95C100', color: textColor, border: "2px solid #FFFFFF", borderRadius: "24px"}} onClick={() => {setColor('#95C100')}}></button>
        </div>
        <div className="modal-button container" style={{fontSize: "0.875rem", height: "11.865%", marginTop: "8px"}}><input style={{paddingLeft:"4.444444444444445%", width: "100%", height: "100%", border: "none", background: "none", paddingTop: "0px", paddingBottom: "0px"}} className="autotextcolor" value={color} onChange={handleChange}></input></div>
        <div style={{ width: '100%', height: "100%", display: 'flex', justifyContent: 'space-between'}}>
            <button className="modal-bottom-button autotextcolor" style={{fontSize: "0.875rem", height: '10.17%', width: '48.91%', float: "left", padding: "0px",}} onClick={() => {setColor(oldColor); setShowColorpicker(false)}}>취소</button>
            <button className="modal-bottom-button" style={{fontSize: "0.875rem", height: '10.17%', backgroundColor: color, width: '48.91%', float: "left", marginLeft: "2.18%", color: textColor, padding: "0px"}} onClick={() => setShowColorpicker(false)}>저장</button>
        </div>
        </div>
      </div>
      {/* 로그인 모달 */}
      <div className={showLoginModal ? 'modal_3 active' : 'modal_3'} onClick={() => {setShowLoginModal(false)}}>
        <div className="modal-content" onClick={e => e.stopPropagation()} style={{justifyContent: 'space-between', alignItems: 'center', textAlign: "center"}}>
          <div style={{display: 'flex', flexDirection: 'column'}}>
            <span className="autotextcolor" style={{fontSize: "0.875rem", paddingTop: "24px"}}>Google로 로그인해서 설정을 저장하세요</span>
          </div>
            <button className="modal-button container" style={{fontSize: "0.875rem", paddingInline: "none", marginTop: "27px"}} onClick={() => signIn('google')}>
                <img style={{marginLeft:"4.444444444444445%"}} src="google.svg" alt="" />
                <span className="autotextcolor" style={{marginLeft: "auto", marginRight: "20px"}}>Google로 로그인</span>
            </button>
          <button className="modal-bottom-button autotextcolor" style={{fontSize: "0.875rem", height: '21.43%', width: '48.91%', float: "left", padding: "0px",}} onClick={() => {setShowLoginModal(false)}}>쓰읍...</button>
          <button className="modal-bottom-button" style={{fontSize: "0.875rem", height: '21.43%', backgroundColor: color, width: '48.91%', float: "left", marginLeft: "2.18%", color: textColor, padding: "0px"}}>두개재</button>
        </div>
      </div>
    </ThemeContext.Provider>
  )
}
  
/*
  킹아
*/
/** 이제 페이지 번역 안뜰거빈다 어 global.css좀 손보고 올게요
*/