import type { NextApiRequest, NextApiResponse } from 'next'
import fetch from 'node-fetch'

export default function handler(req: NextApiRequest,res: NextApiResponse
    ) {
        const Id = req.query.id
        fetch(`https://bjapi.afreecatv.com/api/${Id}/station`, {headers: {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/116.0.0.0 Whale/3.22.205.18 Safari/537.36'}})
            .then((response) => {
                if (response.status === 515){
                    res.send(false)
                }
                else{
                    res.send(true)
                }
            })
            
            
  }