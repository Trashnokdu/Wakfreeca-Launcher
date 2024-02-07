import axios from 'axios';
import type { NextApiRequest, NextApiResponse } from 'next'
const mysql = require("mysql")
import { getToken, decode } from "next-auth/jwt";
require('dotenv').config();
const secret = process.env.Secret;
const pool = mysql.createPool({
    host : process.env.mysql_URL,
    user : process.env.mysql_ID,
    password : process.env.mysql_PASSWORD,
    database : "wakfreeca"
})

interface ListItem {
    sequence: number;
    id: string;
    name: string;
    color: string;
}

function isValidList(list: ListItem[]): boolean {
    for (let i = 0; i < list.length; i++) {
        const item = list[i];
        if (item.sequence !== i) {
            return false;
        }
        if (typeof item.id !== 'string' || typeof item.name !== 'string' || typeof item.color !== 'string' || !/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/i.test(item.color)) {
            return false;
        }
    }
    return true;
}


export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method == "POST"){
        const data = req.body
        if(!data){
            return res.status(400).send("400 Bad Request")
        }
        var email: string | null | undefined
        pool.getConnection(async function(err:any, connection: any) {
            if (err) {
                console.error('Error connecting: ' + err.stack);
                return res.status(500).send("500 Internal Server Error");
            }
            const session = await getToken({ req, secret, raw: true });
            if(!session){
                res.status(401).send("401 Unauthorized")
            }
            try{
                const decoded = await decode({
                    token: session,
                    secret: secret ? secret : '',
                  });
                email = decoded?.email
                if(!email){
                    return res.status(500).send("500 Internal Server Error")
                }
            }
            catch{
                res.status(401).send("401 Unauthorized")
            }
            if(data.length == 0){
                connection.query("DELETE from data WHERE email=?", [email], (error:any) => {
                    if (error) {
                        console.log(error);
                    }
                })
                return res.send([])
            }
            if(isValidList(data)){
                var nicknames: string[] = []
                var bulkData = [];
                for (let i = 0; i < data.length; i++) {
                    const item: ListItem = data[i];
                    try{
                        const response = await axios({
                            url: `https://bjapi.afreecatv.com/api/${item.id}/station`,
                            headers: {"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Whale/3.24.223.21 Safari/537.36"}
                        })
                        nicknames.push(response.data.station.user_nick)
                        bulkData.push([email, item.sequence, item.id, response.data.station.user_nick, item.color]);
                    }
                    catch (error) {
                        if (axios.isAxiosError(error)) {
                            if(error.response?.status === 515){
                                return res.status(400).send("400 Bad Request")
                            }
                            else{
                                return res.status(500).send("500 Internal Server Error");
                            }
                        }
                    }
                }
                connection.query("DELETE from data WHERE email=?", [email], (error:any) => {
                    if (error) {
                        console.log(error);
                    }
                })
                connection.query("INSERT INTO data (email, sequence, id, name, color) VALUES ?", [bulkData], (error:any, rows:string[]) => {
                    if (error) {
                        console.log(error);
                    }
                });
                connection.commit()
                connection.query('SELECT * from data WHERE email=?', [email], (error:any, rows:string[]) => {
                    if (error) {
                        console.log(error);
                    }
                    const result = rows.map((data:any) => {
                        return {
                            "sequence": data.sequence,
                            "id": data.id,
                            "name": data.name,
                            "color": data.color
                        }
                    })
                    
                    return res.send(result)
                })
                connection.release()
            }
            else{
                return res.status(400).send("400 Bad Request")
            }
        })
    }
    else{
        res.status(405).send("405 Method Not Allowed")
    }
}