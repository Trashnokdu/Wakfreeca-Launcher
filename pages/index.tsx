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
  .catch()
}
const getFollow = async (id: string) => {
  try{
    const response = await axios({
        url: `https://bjapi.afreecatv.com/api/${id}/station`,
    })
    const fanCount = response.data.station.upd.fan_cnt;
    return fanCount < 10000 ? fanCount : (fanCount / 10000).toFixed(1) + '만';
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
  const [showPCAlert, setshowPCAlert] = useState(false)
  const [showColorpicker, setShowColorpicker] = useState(false)
  const [isSetting, setIsSetting] = useState(false)
  const { data: session, status } = useSession();
  const ThemeContext = createContext("null");
  const [setTheme, theme] = useState("light")
  const [follows, setFollows] = useState<any>({});
  const [windowWidth, setWindowWidth] = useState(Number);

  useEffect(() => {
    function handleResize() {
        setWindowWidth(window.innerWidth);
    }
    window.addEventListener('resize', handleResize);
    handleResize();
    return () => window.removeEventListener('resize', handleResize);
}, []);

  function LoginOrSetting(){
    if(windowWidth < 768){
      Login ? isSetting? setIsSetting(false) : setIsSetting(true) : setShowLoginModal(true)
    }
    else{
      Login ? setshowPCAlert(true) : setShowLoginModal(true)
    }
  }

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
    if(windowWidth > 768){
      setIsSetting(false)
    }
  }, [windowWidth])
  useEffect(() => {
    if(status != "loading"){
        const item: any = window.localStorage.getItem('isLoggedIn')
        if(!item){
          const addItem = () => window.localStorage.setItem('isLoggedIn', 'false');
          addItem();
          setLogin(false)
          setIsLoding(false)
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
        <button style={{marginLeft: "auto", marginRight: "1rem", background: "none", border: "none", color: "#999999"}} className="material-symbols-rounded"  onClick={() => {LoginOrSetting()}}>{isSetting? <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24"><path fill="#999999" d="m424-408-86-86q-11-11-28-11t-28 11q-11 11-11 28t11 28l114 114q12 12 28 12t28-12l226-226q11-11 11-28t-11-28q-11-11-28-11t-28 11L424-408Zm56 328q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Zm0-320Z"/></svg>: <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24"><path fill="#999999" d="M433-80q-27 0-46.5-18T363-142l-9-66q-13-5-24.5-12T307-235l-62 26q-25 11-50 2t-39-32l-47-82q-14-23-8-49t27-43l53-40q-1-7-1-13.5v-27q0-6.5 1-13.5l-53-40q-21-17-27-43t8-49l47-82q14-23 39-32t50 2l62 26q11-8 23-15t24-12l9-66q4-26 23.5-44t46.5-18h94q27 0 46.5 18t23.5 44l9 66q13 5 24.5 12t22.5 15l62-26q25-11 50-2t39 32l47 82q14 23 8 49t-27 43l-53 40q1 7 1 13.5v27q0 6.5-2 13.5l53 40q21 17 27 43t-8 49l-48 82q-14 23-39 32t-50-2l-60-26q-11 8-23 15t-24 12l-9 66q-4 26-23.5 44T527-80h-94Zm7-80h79l14-106q31-8 57.5-23.5T639-327l99 41 39-68-86-65q5-14 7-29.5t2-31.5q0-16-2-31.5t-7-29.5l86-65-39-68-99 42q-22-23-48.5-38.5T533-694l-13-106h-79l-14 106q-31 8-57.5 23.5T321-633l-99-41-39 68 86 64q-5 15-7 30t-2 32q0 16 2 31t7 30l-86 65 39 68 99-42q22 23 48.5 38.5T427-266l13 106Zm42-180q58 0 99-41t41-99q0-58-41-99t-99-41q-59 0-99.5 41T342-480q0 58 40.5 99t99.5 41Zm-2-140Z"/></svg>}</button>
      </header>
      <main style={{margin: "1rem", display: "flex", justifyContent: "center"}}>
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
            <button className="modal-bottom-button autotextcolor" style={{fontSize: "0.875rem", height: '21.43%', float: "left"}} onClick={() => {setShowModal(false); setTimeout(() => {setId(""); setColor("#164532"); setIsdataediting(false)}, 300)}}>취소</button>
            <button className="modal-bottom-button" style={{fontSize: "0.875rem", height: '21.43%', backgroundColor: color, float: "left", marginLeft: "8px", color: textColor}} onClick={save}>저장</button>
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
            <button className="modal-bottom-button autotextcolor" style={{fontSize: "0.875rem", height: '10.17%', width: '48.91%', float: "left", padding: "0px",}} onClick={() => {setColor(oldColor); setShowColorpicker(false)}}>취소</button>
            <button className="modal-bottom-button" style={{fontSize: "0.875rem", height: '10.17%', backgroundColor: color, width: '48.91%', float: "left", marginLeft: "8px", color: textColor, padding: "0px"}} onClick={() => setShowColorpicker(false)}>저장</button>
        </div>
        </div>
      </div>
      {/* 로그인 모달 */}
      <div className={showLoginModal ? 'modal_3 active' : 'modal_3'} onClick={() => {setShowLoginModal(false)}}>
        <div className="modal-content" onClick={e => e.stopPropagation()} style={{justifyContent: 'space-between', alignItems: 'center', textAlign: "center"}}>
          <div style={{display: 'flex', flexDirection: 'column'}}>
            <span className="autotextcolor" style={{fontSize: "0.875rem", paddingTop: "24px"}}>Google로 로그인해서 설정을 저장하세요</span>
          </div>
            <button className="modal-button container" style={{fontSize: "0.875rem", paddingInline: "none", marginTop: "1.75rem"}} onClick={() => signIn('google')}>
                <img style={{marginLeft:"1rem"}} src="google.svg" alt="" />
                <span className="autotextcolor" style={{marginLeft: "auto", marginRight: "20px"}}>Google로 로그인</span>
            </button>
          <button className="modal-bottom-button autotextcolor" style={{fontSize: "0.875rem", height: '3rem', width: '48.91%', float: "left", padding: "0px",}} onClick={() => {setShowLoginModal(false)}}>취소</button>
          <button className="modal-bottom-button" style={{fontSize: "0.875rem", height: '3rem', backgroundColor: color, width: '48.91%', float: "left", marginLeft: "2.18%", color: textColor, padding: "0px"}} onClick={() => {setShowLoginModal(false)}}>확인</button>
          <a href="/privacypolicy.html" style={{fontSize: "0.875rem", color: "#999999", textDecoration: "none"}}>개인정보처리방침</a>
        </div>
      </div>
      {/* 알림 모달 */}
      <div className={showPCAlert ? 'modal_3 active' : 'modal_3'} onClick={() => {setshowPCAlert(false)}}>
        <div className="modal-content" onClick={e => e.stopPropagation()} style={{height: "9.5rem", display: "revert", justifyContent: 'center', alignItems: 'center', textAlign: "center", justifyItems: "center"}}>
          <div style={{display: 'flex', flexDirection: 'column'}}>
            <span className="autotextcolor" style={{fontSize: "0.875rem", paddingTop: "24px"}}>설정 변경은 모바일에서 진행해주세요</span>
          </div>
          <button className="modal-bottom-button autotextcolor" style={{marginBottom: "1rem", fontSize: "0.875rem", height: '3rem', float: "left", padding: "0px", width: "91.1111111111111%", position: "absolute", left: "1rem", bottom: 0}} onClick={() => {setshowPCAlert(false)}}>확인</button>
        </div>
      </div>
      {/* 삭제 모달 */}
      <div className={showDelteModal ? 'modal_3 active' : 'modal_3'} onClick={() => {setshowDelteModal(false); setName(""); setId(""); setColor("#164532")}}>
        <div className="modal-content" onClick={e => e.stopPropagation()} style={{justifyContent: 'space-between', alignItems: 'center', textAlign: "center"}}>
          <div style={{display: 'flex', flexDirection: 'column'}}>
            <span className="autotextcolor" style={{fontSize: "0.875rem", paddingTop: "24px"}}>이 바로가기를 삭제하실건가요?</span>
          </div>
          <div className='list_con' style={{marginTop: "27px"}}>
                <div style={{display: "flex",}} >
                    <img src={`https://profile.img.afreecatv.com/LOGO/${id.substring(0,2)}/${id}/${id}.jpg`} alt="" style={{width: "40px", borderRadius: "8px", marginRight: "0.5rem"}} />
                    <span>
                    <span style={{color: color}}>{name}</span> <span style={{color: "#999999"}}>({id})</span><br/>
                       <div style={{marginTop: "0.25rem", display: "flex", alignItems: "center", color: "#999999"}}>
                          <svg xmlns="http://www.w3.org/2000/svg" height="16" viewBox="0 -960 960 960" width="16"><path fill="#999999" d="m480-362 111 84q12 8 24 .5t7-21.5l-42-139 109-78q12-9 7-22.5T677-552H544l-45-146q-5-14-19-14t-19 14l-45 146H283q-14 0-19 13.5t7 22.5l109 78-42 139q-5 14 7 21.5t24-.5l111-84Zm0 282q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Z"/></svg>
                          <span style={{fontSize: "0.75rem", marginLeft: "0.1875rem"}}>{follows[id]}</span>
                       </div>
                    </span>
                </div>
                <div style={{display: "flex"}}>
                    <button style={{alignSelf: 'center', border: "none", background: "none", color: color, fontSize: "1.25rem", width: "2.5rem", height: "100%"}}><svg xmlns="http://www.w3.org/2000/svg" height="20" viewBox="0 -960 960 960" width="20"><path fill={color} d="m426-330 195-125q14-9 14-25t-14-25L426-630q-15-10-30.5-1.5T380-605v250q0 18 15.5 26.5T426-330Zm54 250q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Zm0-320Z"/></svg></button>
                    <button style={{alignSelf: 'center', border: "none", background: "none", color: color, fontSize: "1.25rem", width: "2.5rem", height: "100%"}}><svg xmlns="http://www.w3.org/2000/svg" height="20" viewBox="0 -960 960 960" width="20"><path fill={color} d="M234-276q51-39 114-61.5T480-360q69 0 132 22.5T726-276q35-41 54.5-93T800-480q0-133-93.5-226.5T480-800q-133 0-226.5 93.5T160-480q0 59 19.5 111t54.5 93Zm246-164q-59 0-99.5-40.5T340-580q0-59 40.5-99.5T480-720q59 0 99.5 40.5T620-580q0 59-40.5 99.5T480-440Zm0 360q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q53 0 100-15.5t86-44.5q-39-29-86-44.5T480-280q-53 0-100 15.5T294-220q39 29 86 44.5T480-160Zm0-360q26 0 43-17t17-43q0-26-17-43t-43-17q-26 0-43 17t-17 43q0 26 17 43t43 17Zm0-60Zm0 360Z"/></svg></button>
                </div>
            </div>
          <div style={{display: "flex", justifyContent: "space-between", height: "3rem"}}>
            <button className="modal-bottom-button autotextcolor" style={{fontSize: "0.875rem", height: '100%', float: "left", padding: "0px",}} onClick={() => {setshowDelteModal(false)}}>취소</button>
            <button className="modal-bottom-button" style={{fontSize: "0.875rem", height: '100%', backgroundColor: color, float: "left", marginLeft: "8px", color: textColor, padding: "0px"}} onClick={del}>-관-</button>
          </div>
        </div>
      </div>
    </>
  )
}