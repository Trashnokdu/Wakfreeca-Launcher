'use client'
import { useEffect, useRef, useState } from "react"
import { HexColorPicker } from 'react-colorful';
import axios from 'axios';
import Google from "next-auth/providers/google";
import ListView from "./components/ListView";
import { SessionProvider, signIn, useSession } from "next-auth/react";
import { createContext } from "react";
import Head from "next/head";
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
  try{
    const response = await axios({
        url: `https://bjapi.afreecatv.com/api/${id}/station`,
    })
    return (response.data.station.upd.fan_cnt / 10000).toFixed(1) + '만';
  }
  catch{
    return alert("알수없는 오류가 발생하였습니다")
  }
}
const getUser = async (id: string) => {
  try{
    const response = await axios({
        url: `https://bjapi.afreecatv.com/api/${id}/station`,
    })
    return (response.data.station.user_nick)
  } catch (error: any){
    try{
      if(error.response.status == 515){
        alert("존재하지않는 방송국 ID입니다")
        return false
      }
    }
    catch{
      alert("알수없는 오류가 발생하였습니다.")
      return false
    } 
  }
}
export default function Home() {
  const [Login, setLogin] = useState(false)
  const [isdataediting, setIsdataediting] = useState(false)
  const [isediting, setIsediting] = useState(false)
  const [textColor, setTextcolor] = useState("#000000")
  const [id, setId] = useState("")
  const [name, setName] = useState("")
  const [isLoding, setIsLoding] = useState(true)
  const [color, setColor] = useState("#164532")
  const [oldColor, setOldColor] = useState("#164532")
  const [chData, setChData] = useState([{"sequence": 0,"id": "ecvhao","name": "우왁굳","color": "#164532"}, {"sequence": 1,"id": "inehine","name": "아이네♪","color": "#8A2BE2"}, {"sequence": 2,"id": "jingburger1","name": "징버거☆","color": "#F0A957"}, {"sequence": 3,"id": "lilpa0309","name": "릴파♥","color": "#443965"}, {"sequence": 4,"id": "cotton1217","name": "주르르_","color": "#FF008C"}, {"sequence": 5,"id": "gosegu2","name": "고세구!","color": "#467EC6"}, {"sequence": 6,"id": "viichan6","name": "_비챤","color": "#95C100"}])
  var sortedChData = chData.sort((a: data_type, b: data_type) => a.sequence - b.sequence);
  const [showModal, setShowModal] = useState(false)
  const [showLoginModal, setShowLoginModal] = useState(false)
  const [showDelteModal, setshowDelteModal] = useState(false)
  const [showColorpicker, setShowColorpicker] = useState(false)
  const [isSetting, setIsSetting] = useState(false)
  const { data: session, status } = useSession();
  const ThemeContext = createContext("null");
  const [setTheme, theme] = useState("light")
  const [follows, setFollows] = useState<any>({});
  function testisinlist(list: any, id: string){
    return list.some(function (item: any) {
        return item.id === id;
    })
  }
  function del(){
    setChData(chData.filter((itemin:any) => itemin.id !== id));
    setshowDelteModal(false)
    setTimeout(() => {
      setId("")
      setName("")
      setColor("#164532")
    }, 300)
  }
  function save(){
    if (!id){
      return
    }
    if (isdataediting){
      setChData(prevData => prevData.map(item => item.id === id ? {...item, color: color} : item));
      setShowModal(false)
      setTimeout(() => {
        setId("")
        setColor("#164532")
      }, 300)
    }
    else{
      getUser(id)
      .then(stationName => {
        if(!stationName){
          return
        }
        else{
          if(testisinlist(chData, id)){
            return alert("이미 존재하는 바로가기입니다")
          }
          setChData([...chData, {"sequence": chData[chData.length - 1].sequence + 1, "id": id, "name": stationName, "color": color}])
          setShowModal(false)
          setTimeout(() => {
            setId("")
            setColor("#164532")
          }, 300)
        }
      })  
    }
  }
  useEffect(() => {
    if(isediting && !isSetting){
        console.log("edit end")
        const fetchFollows = async () => {
          const newFollows: any = {};

          for (const item of chData) {
              const follow = await getFollow(item.id);
              newFollows[item.id] = follow;
          }

          setFollows(newFollows);
      };
      fetchFollows();
        const data = {"data": sortedChData, "email": session?.user?.email}
        axios({method: "post", url: "/api/data/edit", data: data})
        .then((response) => setChData(response.data))
        return setIsediting(false)
    }
    if(!isediting && isSetting){
        setIsediting(true)
        return console.log("edit start")
    }
}, [isSetting])
  useEffect(() => {
    if(!isediting){
      const fetchFollows = async () => {
          const newFollows: any = {};

          for (const item of chData) {
              const follow = await getFollow(item.id);
              newFollows[item.id] = follow;
          }

          setFollows(newFollows);
      };

      fetchFollows();
    }
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
      console.log(sortedChData)
    }, [chData])
    if(isLoding){
      return (
        <div className="sp-col" style={{width: "100vw", height: "100svh"}}>
          <div className="autotextcolor" style={{fontSize: "2.25rem", fontWeight: "bold", display: "flex", alignItems: "center", height: "100svh",  marginLeft: "16px"}}>WAKFREECA<br />LAUNCHER</div>
        </div> 
      ); 
    }
  return (
    <>
      <Head>
        <title>WAKFREECA LAUNCHER</title>
        <meta name="description" content="왁프리카 런처" />
        <meta name="theme-color" content="#000000" />
        <link rel="manifest" href="/manifest.json" />
        <link rel="icon" href="./favicon.png"/>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <header className="container Top autotextcolor">
        <span style={{marginLeft:"1rem", fontSize: '0.75rem', fontWeight: '700', left: "50"}}><p style={{margin: 0, fontWeight: '700'}}>WAKFREECA</p>LAUNCHER</span>
        <button style={{marginLeft: "auto", marginRight: "1rem", background: "none", border: "none", color: "#999999"}} className="material-symbols-rounded"  onClick={() => {Login ? isSetting? setIsSetting(false) : setIsSetting(true) : setShowLoginModal(true)}}>{isSetting? "check_circle": "settings"}</button>
      </header>
      <main style={{margin: "1rem"}}>
        <ListView setName={setName} setshowDelteModal={setshowDelteModal} chData={chData} isSetting={isSetting} setIsediting={setIsediting} setChData={setChData} isediting={isediting} setShowModal={setShowModal} sortedChData={sortedChData} follows={follows} setIsdataediting={setIsdataediting} setColor={setColor} setId={setId}></ListView>
      </main>




      {/* 이하 모달 모음 */}

      {/* 추가, 수정 모달 */}
      <div className={showModal ? 'modal active' : 'modal'} onClick={() => {setShowModal(false)     
        setTimeout(() => {
          setId("")
          setName("")
          setIsdataediting(false)
          setColor("#164532")
        }, 300)}}>
        <div className="modal-content" onClick={e => e.stopPropagation()}>
          <div className="modal-button container" style={{fontSize: "0.875rem"}}>
            <input className={isdataediting? "" : "autotextcolor"} placeholder="아이디" style={{ height: "100%", width: "80%", background: "none", border: "none", paddingLeft:"18px", flex: 1}} disabled={isdataediting} value={id} onChange={onChange} />
            <span style={{marginLeft: "auto", marginRight: "16px", background: "none", border: "none", color: "#999999", flex: "none"}} className="material-symbols-rounded" onClick={() => setId("")}>cancel</span>
          </div>
          <button className="modal-button container" style={{fontSize: "0.875rem", paddingInline: "none"}} onClick={() => {setOldColor(color); setShowColorpicker(true);}}>
            <span style={{marginLeft:"18px"}} className="autotextcolor">{color}</span>
            <span style={{marginLeft: "auto", marginRight: "16px", background: "none", backgroundColor: color, width: "24px", height: "24px", borderRadius: "32px"}} className="autooutlinecolor"></span>
          </button>
          <div style={{ width: '100%', height: "100%", display: 'flex', justifyContent: 'space-between'}}>
            <button className="modal-bottom-button autotextcolor" style={{fontSize: "0.875rem", height: '21.43%', float: "left"}} onClick={() => {setShowModal(false); setTimeout(() => {setId(""); setColor("#164532"); setIsdataediting(false)}, 300)}}>쓰읍...</button>
            <button className="modal-bottom-button" style={{fontSize: "0.875rem", height: '21.43%', backgroundColor: color, float: "left", marginLeft: "8px", color: textColor}} onClick={save}>킹애</button>
          </div>
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
          <button style={{backgroundColor: '#000080', color: textColor, border: "2px solid #FFFFFF", borderRadius: "24px"}} onClick={() => {setColor('#000080')}}></button>
          <button style={{backgroundColor: '#FF008C', color: textColor, border: "2px solid #FFFFFF", borderRadius: "24px"}} onClick={() => {setColor('#FF008C')}}></button>
          <button style={{backgroundColor: '#467EC6', color: textColor, border: "2px solid #FFFFFF", borderRadius: "24px"}} onClick={() => {setColor('#467EC6')}}></button>
          <button style={{backgroundColor: '#95C100', color: textColor, border: "2px solid #FFFFFF", borderRadius: "24px"}} onClick={() => {setColor('#95C100')}}></button>
        </div>
        <div className="modal-button container" style={{fontSize: "0.875rem", height: "11.865%", marginTop: "8px"}}><input style={{paddingLeft:"18px", width: "100%", height: "100%", border: "none", background: "none", paddingTop: "0px", paddingBottom: "0px", flex: "1"}} className="autotextcolor" value={color} onChange={handleChange}></input></div>
        <div style={{ width: '100%', height: "100%", display: 'flex', justifyContent: 'space-between'}}>
            <button className="modal-bottom-button autotextcolor" style={{fontSize: "0.875rem", height: '10.17%', width: '48.91%', float: "left", padding: "0px",}} onClick={() => {setColor(oldColor); setShowColorpicker(false)}}>쓰읍...</button>
            <button className="modal-bottom-button" style={{fontSize: "0.875rem", height: '10.17%', backgroundColor: color, width: '48.91%', float: "left", marginLeft: "8px", color: textColor, padding: "0px"}} onClick={() => setShowColorpicker(false)}>킹애</button>
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
      {/* 삭제 모달 */}
      <div className={showDelteModal ? 'modal_3 active' : 'modal_3'} onClick={() => {setshowDelteModal(false); setName(""); setId(""); setColor("#164532")}}>
        <div className="modal-content" onClick={e => e.stopPropagation()} style={{justifyContent: 'space-between', alignItems: 'center', textAlign: "center"}}>
          <div style={{display: 'flex', flexDirection: 'column'}}>
            <span className="autotextcolor" style={{fontSize: "0.875rem", paddingTop: "24px"}}>이 바로가기를 관보내실건가요?</span>
          </div>
          <div className='list_con' style={{marginTop: "27px"}}>
                <div style={{display: "flex",}} >
                    <img src={`https://profile.img.afreecatv.com/LOGO/${id.substring(0,2)}/${id}/${id}.jpg`} alt="" style={{width: "40px", borderRadius: "8px", marginRight: "0.5rem"}} />
                    <span>
                    <span style={{color: color}}>{name}</span> <span style={{color: "#999999"}}>({id})</span><br/>
                       <div style={{marginTop: "0.25rem", display: "flex", alignItems: "center", color: "#999999"}}>
                           <span className="material-symbols-rounded infill" style={{fontSize: "1rem"}}>stars</span>
                           <span style={{fontSize: "0.75rem", marginLeft: "0.1875rem"}}>{follows[id]}</span>
                       </div>
                    </span>
                </div>
                <div style={{display: "flex"}}>
                    <button className='material-symbols-rounded' style={{alignSelf: 'center', border: "none", background: "none", color: color, fontSize: "1.25rem", width: "2.5rem", height: "100%"}}>play_circle</button>
                    <button className='material-symbols-rounded' style={{alignSelf: 'center', border: "none", background: "none", color: color, fontSize: "1.25rem", width: "2.5rem", height: "100%"}}>account_circle</button>
                </div>
            </div>
          <div style={{display: "flex", justifyContent: "space-between", height: "3rem"}}>
            <button className="modal-bottom-button autotextcolor" style={{fontSize: "0.875rem", height: '100%', float: "left", padding: "0px",}} onClick={() => {setshowDelteModal(false)}}>쓰읍...</button>
            <button className="modal-bottom-button" style={{fontSize: "0.875rem", height: '100%', backgroundColor: color, float: "left", marginLeft: "8px", color: textColor, padding: "0px"}} onClick={del}>-관-</button>
          </div>
        </div>
      </div>
    </>
  )
}
  
/*
  킹아
*/
/** 이제 페이지 번역 안뜰거빈다 어 global.css좀 손보고 올게요
*/