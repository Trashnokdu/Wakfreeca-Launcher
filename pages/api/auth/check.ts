import type { NextApiRequest, NextApiResponse } from 'next'
import { decode } from "next-auth/jwt";
import { getSession } from 'next-auth/react';
require('dotenv').config();
const secret = process.env.Secret;


export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    // GET POST PUT DELETE UPDATE   
    if (req.method == "GET"){
        const session = await getSession({ req })
        if(!session){
            res.status(401).send("401 Unauthorized123")
        }
        else{
            res.send("")
        }
    }
    else{
        res.status(405).send("405 Method Not Allowed")
    }
}