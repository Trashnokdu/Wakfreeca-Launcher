"use client"
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { DragDropContext, Draggable, DropResult, Droppable } from 'react-beautiful-dnd';
var MobileDetect = require('mobile-detect')

// 저게 아마 맞을걸요 저게 시스템 테마 따라가는거고 토글은 버튼에서 컨트롤하거나 해야할것 같아요 일단 삽질 조금 해보고 올게요
var md: any

interface data_type {
    sequence: number,
    id: string,
    name: string,
    color: string
  }
function openchnnel(id: string){
    if (md.mobile()) {
      location.href = `https://bj.afreecatv.com/${id}`
    }
    else{
      window.open(`https://bj.afreecatv.com/${id}`, "_blank") 
    }
}
function openlive(id: string){
    if (md.mobile()) {
        location.href = `afreeca://player/live?user_id=${id}`
    }
    else{
        window.open(`https://play.afreecatv.com/${id}`, "_blank")
    }
}

const onDragEnd = (result:any, columns:any, setColumns:any) => {
    if (!result.destination) return;
    const { source, destination } = result;
  
    if (source.droppableId !== destination.droppableId) {
    } else {
      const column = columns[source.droppableId];
      const copiedItems = [...column.items];
      const [removed] = copiedItems.splice(source.index, 1);
      copiedItems.splice(destination.index, 0, removed);
      
      // 상태 업데이트
      setColumns({
        ...columns,
        [source.droppableId]: {
          ...column,
          items: copiedItems,
        },
      });
    }
  };
  
const ListView = (props: any) => {
    const [columns, setColumns] = useState({
        ['items']: {
          name: 'Items',
          items: props.sortedChData
        }
      });
    useEffect(() => {
      setColumns({        
        ['items']: {
        name: 'Items',
        items: props.sortedChData
      }})
    }, [props.sortedChData])
    useEffect(() => {
        for (let i = 0; i < columns.items.items.length; i++) {
            columns.items.items[i].sequence = i;
          }
        props.setChData(columns.items.items)
    }, [columns])
    useEffect(() => {
      md = new MobileDetect(navigator.userAgent);
    }, [])
    if(props.isSetting) return(
        <DragDropContext
          onDragEnd={result => onDragEnd(result, columns, setColumns)}
        >
          {Object.entries(columns).map(([columnId, column], index) => {
            return (
              <Droppable droppableId={columnId} key={columnId}>
                {(provided, snapshot) => {
                  return (
                    <div className='list_m' {...provided.droppableProps} ref={provided.innerRef} style={{paddingBottom: "10svh"}}>
                      {column.items.map((item:any, index:any) => {
                        return (
                          <Draggable draggableId={item.id} index={index} key={item.id}>
                            {(provided, snapshot) => {
                              return (
                                <div className='list_con' ref={provided.innerRef} {...provided.draggableProps}>
                                    <div style={{display: "flex", alignItems: 'center'}}>
                                        <span style={{alignSelf: 'center', border: "none", background: "none", color: "#999999", marginLeft: "1.125rem", marginRight: "1.125rem"}} {...provided.dragHandleProps}><svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24"><path fill="#999999" d="M160-240q-17 0-28.5-11.5T120-280q0-17 11.5-28.5T160-320h640q17 0 28.5 11.5T840-280q0 17-11.5 28.5T800-240H160Zm0-200q-17 0-28.5-11.5T120-480q0-17 11.5-28.5T160-520h640q17 0 28.5 11.5T840-480q0 17-11.5 28.5T800-440H160Zm0-200q-17 0-28.5-11.5T120-680q0-17 11.5-28.5T160-720h640q17 0 28.5 11.5T840-680q0 17-11.5 28.5T800-640H160Z"/></svg></span>
                                        <span style={{color: item.color, fontSize: "0.875rem"}}>{item.name}</span> <span style={{color: "#999999", fontSize: "0.875rem"}}>({item.id})</span><br/>
                                    </div>
                                    <div style={{display: "flex"}}>
                                      <button className='material-symbols-rounded' style={{alignSelf: 'center', border: "none", background: "none", color: item.color, width: "2.5rem", height: "100%", fontSize: "1.25rem"}} onClick={() => {props.setIsdataediting(true); props.setColor(item.color); props.setId(item.id); props.setShowModal(true)}}><svg xmlns="http://www.w3.org/2000/svg" height="20" viewBox="0 -960 960 960" width="20"><path fill={item.color} d="M200-200h57l391-391-57-57-391 391v57Zm-40 80q-17 0-28.5-11.5T120-160v-97q0-16 6-30.5t17-25.5l505-504q12-11 26.5-17t30.5-6q16 0 31 6t26 18l55 56q12 11 17.5 26t5.5 30q0 16-5.5 30.5T817-647L313-143q-11 11-25.5 17t-30.5 6h-97Zm600-584-56-56 56 56Zm-141 85-28-29 57 57-29-28Z"/></svg></button>
                                      <button className='material-symbols-rounded' style={{alignSelf: 'center', border: "none", background: "none", color: item.color, width: "2.5rem", height: "100%", fontSize: "1.25rem"}} onClick={() => {props.setId(item.id); props.setColor(item.color); props.setName(item.name); props.setshowDelteModal(true)}}><svg xmlns="http://www.w3.org/2000/svg" height="20" viewBox="0 -960 960 960" width="20"><path fill={item.color} d="M280-120q-33 0-56.5-23.5T200-200v-520q-17 0-28.5-11.5T160-760q0-17 11.5-28.5T200-800h160q0-17 11.5-28.5T400-840h160q17 0 28.5 11.5T600-800h160q17 0 28.5 11.5T800-760q0 17-11.5 28.5T760-720v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520Zm-400 0v520-520Zm200 316 76 76q11 11 28 11t28-11q11-11 11-28t-11-28l-76-76 76-76q11-11 11-28t-11-28q-11-11-28-11t-28 11l-76 76-76-76q-11-11-28-11t-28 11q-11 11-11 28t11 28l76 76-76 76q-11 11-11 28t11 28q11 11 28 11t28-11l76-76Z"/></svg></button>
                                    </div>
                                </div>
                              );
                            }}
                          </Draggable>
                        );
                      })}
                      {provided.placeholder}
                        <button className='list_con' style={{border: "none", display: "flex", justifyContent: "center"}} ref={provided.innerRef} onClick={() => props.setShowModal(true)}>
                            <span className='material-symbols-rounded' style={{alignSelf: 'center', border: "none", background: "none", color: "#999999", marginRight: "0.625rem", fontSize: "1.25rem"}}><svg xmlns="http://www.w3.org/2000/svg" height="20" viewBox="0 -960 960 960" width="20"><path fill='#999999' d="M440-440v120q0 17 11.5 28.5T480-280q17 0 28.5-11.5T520-320v-120h120q17 0 28.5-11.5T680-480q0-17-11.5-28.5T640-520H520v-120q0-17-11.5-28.5T480-680q-17 0-28.5 11.5T440-640v120H320q-17 0-28.5 11.5T280-480q0 17 11.5 28.5T320-440h120Zm40 360q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Zm0-320Z"/></svg></span>
                        </button>
                    </div>
                  );
                }}
              </Droppable>
            );
          })}
        </DragDropContext>
    )
    return (
        <div className='list_m' style={{fontSize: "0.875rem"}}>
            {props.sortedChData && props.sortedChData.map((item: data_type) => (
              <div className='list_con' key={item.sequence} onClick={() => openlive(item.id)}>
                <div style={{display: "flex",}} >
                    <img src={`https://profile.img.afreecatv.com/LOGO/${item.id.substring(0,2)}/${item.id}/${item.id}.jpg`} alt="" style={{width: "40px", borderRadius: "8px", marginRight: "0.5rem"}} />
                    <span>
                    <span style={{color: item.color}}>{item.name}</span> <span style={{color: "#999999"}}>({item.id})</span><br/>
                       <div style={{marginTop: "0.25rem", display: "flex", alignItems: "center", color: "#999999"}}>
                       <svg xmlns="http://www.w3.org/2000/svg" height="16" viewBox="0 -960 960 960" width="16"><path fill="#999999" d="m480-362 111 84q12 8 24 .5t7-21.5l-42-139 109-78q12-9 7-22.5T677-552H544l-45-146q-5-14-19-14t-19 14l-45 146H283q-14 0-19 13.5t7 22.5l109 78-42 139q-5 14 7 21.5t24-.5l111-84Zm0 282q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Z"/></svg>
                          <span style={{fontSize: "0.75rem", marginLeft: "0.1875rem"}}>{props.follows[item.id]}</span>
                       </div>
                    </span>
                </div>
                <div style={{display: "flex"}}>
                    <button className='material-symbols-rounded' style={{alignSelf: 'center', border: "none", background: "none", color: item.color, fontSize: "1.25rem", width: "2.5rem", height: "100%"}}><svg xmlns="http://www.w3.org/2000/svg" height="20" viewBox="0 -960 960 960" width="20"><path fill={item.color} d="m426-330 195-125q14-9 14-25t-14-25L426-630q-15-10-30.5-1.5T380-605v250q0 18 15.5 26.5T426-330Zm54 250q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Zm0-320Z"/></svg></button>
                    <button className='material-symbols-rounded' style={{alignSelf: 'center', border: "none", background: "none", color: item.color, fontSize: "1.25rem", width: "2.5rem", height: "100%"}} onClick={(e) => {e.stopPropagation(); openchnnel(item.id);}}><svg xmlns="http://www.w3.org/2000/svg" height="20" viewBox="0 -960 960 960" width="20"><path fill={item.color} d="M234-276q51-39 114-61.5T480-360q69 0 132 22.5T726-276q35-41 54.5-93T800-480q0-133-93.5-226.5T480-800q-133 0-226.5 93.5T160-480q0 59 19.5 111t54.5 93Zm246-164q-59 0-99.5-40.5T340-580q0-59 40.5-99.5T480-720q59 0 99.5 40.5T620-580q0 59-40.5 99.5T480-440Zm0 360q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q53 0 100-15.5t86-44.5q-39-29-86-44.5T480-280q-53 0-100 15.5T294-220q39 29 86 44.5T480-160Zm0-360q26 0 43-17t17-43q0-26-17-43t-43-17q-26 0-43 17t-17 43q0 26 17 43t43 17Zm0-60Zm0 360Z"/></svg></button>
                </div>
              </div>
            ))}
        </div>
                
    );
};

export default ListView;