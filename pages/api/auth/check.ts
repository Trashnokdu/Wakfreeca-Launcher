import type { NextApiRequest, NextApiResponse } from 'next'
import { getToken, decode } from "next-auth/jwt";
require('dotenv').config();
const secret = process.env.Secret;


export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    // GET POST PUT DELETE UPDATE   
    if (req.method == "GET"){
        const session = await getToken({ req, secret, raw: true });
        if(!session){
            res.status(401).send("401 Unauthorized")
        }
        try{
            const decoded = await decode({
                token: session,
                secret: secret ? secret : '',
            });
            res.send("")
        }
        catch{
            res.status(401).send("401 Unauthorized")
        }
    } 
}