import type { NextApiRequest, NextApiResponse } from 'next'


export default function handler(req: NextApiRequest, res: NextApiResponse) {
    // GET POST PUT DELETE UPDATE   
    if (req.method == "GET"){
        const { email } = req.query

    } 
  }
  