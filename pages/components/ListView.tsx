import axios from 'axios';
import React, { useEffect, useState } from 'react';

interface data_type {
    sequence: number,
    id: string,
    name: string,
    color: string
  }
function openchnnel(id: string){
    if (/Mobi/i.test(window.navigator.userAgent)) {
        location.href = `https://bj.afreecatv.com/${id}`
    }
    else{
        location.href = `https://bj.afreecatv.com/${id}`
    }
}
function openlive(id: string){
    if (/Mobi/i.test(window.navigator.userAgent)) {
        location.href = `afreeca://player/live?user_id=${id}`
    }
    else{
        location.href = `https://play.afreecatv.com/${id}`
    }
}
const getFollow = async (id: string) => {
    const response = await axios({
        url: `https://bjapi.afreecatv.com/api/${id}/station`,
    })
    return (response.data.station.upd.fan_cnt / 10000).toFixed(1) + '만';
}

const ListView = (props: any) => {
    const [follows, setFollows] = useState<any>({});
    useEffect(() => {
        const fetchFollows = async () => {
            const newFollows: any = {};

            for (const item of props.chData) {
                const follow = await getFollow(item.id);
                newFollows[item.id] = follow;
            }

            setFollows(newFollows);
        };

        fetchFollows();
    }, [props.chData]);
    const sortedChData = [...props.chData].sort((a: data_type, b: data_type) => a.sequence - b.sequence);
    return (
        <div style={{fontSize: "0.875rem"}}>
            {sortedChData.map((item: data_type) => (
              <div className='list_con' key={item.sequence}>
                    <div style={{display: "flex",}}>
                        <img src={`https://profile.img.afreecatv.com/LOGO/${item.id.substring(0,2)}/${item.id}/${item.id}.jpg`} alt="" style={{width: "40px", borderRadius: "8px", marginRight: "0.5rem"}} />
                        <span>
                        <span style={{color: item.color}}>{item.name}</span> <span style={{color: "#999999"}}>({item.id})</span><br/>
                           <div style={{marginTop: "0.25rem", display: "flex", alignItems: "center", color: "#999999"}}>
                               <span className="material-symbols-rounded infill" style={{fontSize: "1rem"}}>stars</span>
                               <span style={{fontSize: "0.75rem", marginLeft: "0.1875rem"}}>{follows[item.id]}</span>
                           </div>
                        </span>
                    </div>
                    <div style={{display: "flex"}}>
                        <button className='material-symbols-rounded' style={{alignSelf: 'center', border: "none", background: "none", color: item.color, marginRight: "1.25rem"}} onClick={() => openlive(item.id)}>play_circle</button>
                        <button className='material-symbols-rounded' style={{alignSelf: 'center', border: "none", background: "none", color: item.color, marginRight: "0.625rem"}} onClick={() => openchnnel(item.id)}>account_circle</button>
                    </div>
              </div>
            ))}
        </div>
    );
};

export default ListView;