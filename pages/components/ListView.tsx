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
                    <div {...provided.droppableProps} ref={provided.innerRef} style={{paddingBottom: "10svh"}}>
                      {column.items.map((item:any, index:any) => {
                        return (
                          <Draggable draggableId={item.id} index={index} key={item.id}>
                            {(provided, snapshot) => {
                              return (
                                <div className='list_con' ref={provided.innerRef} {...provided.draggableProps}>
                                    <div style={{display: "flex", alignItems: 'center'}}>
                                        <span className='material-symbols-rounded' style={{alignSelf: 'center', border: "none", background: "none", color: "#999999", marginLeft: "1.125rem", marginRight: "1.125rem"}} {...provided.dragHandleProps}>menu</span>
                                        <span style={{color: item.color, fontSize: "0.875rem"}}>{item.name}</span> <span style={{color: "#999999", fontSize: "0.875rem"}}>({item.id})</span><br/>
                                    </div>
                                    <div style={{display: "flex"}}>
                                      <button className='material-symbols-rounded' style={{alignSelf: 'center', border: "none", background: "none", color: item.color, width: "2.5rem", height: "100%", fontSize: "1.25rem"}} onClick={() => {props.setIsdataediting(true); props.setColor(item.color); props.setId(item.id); props.setShowModal(true)}}>edit</button>
                                      <button className='material-symbols-rounded' style={{alignSelf: 'center', border: "none", background: "none", color: item.color, width: "2.5rem", height: "100%", fontSize: "1.25rem"}} onClick={() => {props.setId(item.id); props.setColor(item.color); props.setName(item.name); props.setshowDelteModal(true)}}>delete_forever</button>
                                    </div>
                                </div>
                              );
                            }}
                          </Draggable>
                        );
                      })}
                      {provided.placeholder}
                        <button className='list_con' style={{border: "none", display: "flex", justifyContent: "center"}} ref={provided.innerRef} onClick={() => props.setShowModal(true)}>
                            <span className='material-symbols-rounded' style={{alignSelf: 'center', border: "none", background: "none", color: "#999999", marginRight: "0.625rem", fontSize: "1.25rem"}}>add_circle</span>
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
        <div style={{fontSize: "0.875rem"}}>
            {props.sortedChData && props.sortedChData.map((item: data_type) => (
              <div className='list_con' key={item.sequence} onClick={() => openlive(item.id)}>
                <div style={{display: "flex",}} >
                    <img src={`https://profile.img.afreecatv.com/LOGO/${item.id.substring(0,2)}/${item.id}/${item.id}.jpg`} alt="" style={{width: "40px", borderRadius: "8px", marginRight: "0.5rem"}} />
                    <span>
                    <span style={{color: item.color}}>{item.name}</span> <span style={{color: "#999999"}}>({item.id})</span><br/>
                       <div style={{marginTop: "0.25rem", display: "flex", alignItems: "center", color: "#999999"}}>
                           <span className="material-symbols-rounded infill" style={{fontSize: "1rem"}}>stars</span>
                           <span style={{fontSize: "0.75rem", marginLeft: "0.1875rem"}}>{props.follows[item.id]}</span>
                       </div>
                    </span>
                </div>
                <div style={{display: "flex"}}>
                    <button className='material-symbols-rounded' style={{alignSelf: 'center', border: "none", background: "none", color: item.color, fontSize: "1.25rem", width: "2.5rem", height: "100%"}}>play_circle</button>
                    <button className='material-symbols-rounded' style={{alignSelf: 'center', border: "none", background: "none", color: item.color, fontSize: "1.25rem", width: "2.5rem", height: "100%"}} onClick={(e) => {e.stopPropagation(); openchnnel(item.id);}}>account_circle</button>
                </div>
              </div>
            ))}
        </div>
                
    );
};

export default ListView;