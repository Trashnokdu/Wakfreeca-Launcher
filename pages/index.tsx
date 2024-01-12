import { useEffect, useRef, useState } from "react"
import { HexColorPicker } from 'react-colorful';

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

function newbrowser(){
  fetch("/api/new")
    .then((response) => response.json())
    .then((data) => console.log(data))
}

export default function Home() {
  const [textColor, setTextcolor] = useState("#000000")
  const [id, setId] = useState("")
  const [color, setColor] = useState("#164532")
  const [oldColor, setOldColor] = useState("#164532")
  const [showModal, setShowModal] = useState(false)
  const [showColorpicker, setShowColorpicker] = useState(false)

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
      const item = localStorage.getItem('key')
      if(!item){
        newbrowser()
      }
    }, [])
  return (
    <main>
      <header className="container" style={{height: "7.917vh", backgroundColor: "white"}}>
        <span style={{marginLeft:"4.444444444444445%", fontSize: '0.75rem', fontWeight: '700'}}><p style={{margin: 0, fontWeight: '700'}}>WAKFREECA</p>LAUNCHER</span>
        <button style={{marginLeft: "auto", marginRight: "4.444444444444445%", background: "none", border: "none", color: "#999999"}} className="material-symbols-rounded"  onClick={() => setShowModal(true)}>settings</button>
      </header>

      {/* 추가 모달 */}
      <div className={showModal ? 'modal active' : 'modal'} onClick={() => setShowModal(false)}>
        <div className="modal-content" onClick={e => e.stopPropagation()}>
          <div className="modal-button container" style={{fontSize: "0.875rem"}}>
            <input placeholder="아이디" style={{ height: "100%", background: "none", border: "none", paddingLeft:"4.444444444444445%"}} value={id} onChange={onChange}></input>
            <span style={{marginLeft: "auto", marginRight: "16px", background: "none", border: "none", color: "#999999"}} className="material-symbols-rounded" onClick={() => setId("")}>cancel</span>
          </div>
          <button className="modal-button container" style={{fontSize: "0.875rem", paddingInline: "none"}} onClick={() => {setOldColor(color); setShowColorpicker(true);}}>
            <span style={{marginLeft:"4.444444444444445%"}}>{color}</span>
            <span style={{marginLeft: "auto", marginRight: "16px", background: "none", outline: "2px solid #F2F2F7", backgroundColor: color, width: "24px", height: "24px", borderRadius: "32px"}}></span>
          </button>
          <button className="modal-bottom-button" style={{fontSize: "0.875rem", height: '21.43%', width: '48.91%', float: "left", color: "#000000"}}>취소</button>
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
        <div className="modal-button container" style={{fontSize: "0.875rem", height: "11.865%", marginTop: "8px"}}><input style={{paddingLeft:"4.444444444444445%", width: "100%", height: "100%", border: "none", background: "none", paddingTop: "0px", paddingBottom: "0px"}} value={color} onChange={handleChange}></input></div>
        <div style={{ width: '100%', height: "100%", display: 'flex', justifyContent: 'space-between'}}>
            <button className="modal-bottom-button" style={{fontSize: "0.875rem", height: '10.17%', width: '48.91%', float: "left", padding: "0px",}} onClick={() => {setColor(oldColor); setShowColorpicker(false)}}>취소</button>
            <button className="modal-bottom-button" style={{fontSize: "0.875rem", height: '10.17%', backgroundColor: color, width: '48.91%', float: "left", marginLeft: "2.18%", color: textColor, padding: "0px"}} onClick={() => setShowColorpicker(false)}>저장</button>
        </div>
        </div>
      </div>
    </main>
  )
}