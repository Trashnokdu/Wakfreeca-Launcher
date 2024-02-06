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

// 그냥 /api/data/get 으로 아무런 쿼리스트링이나 파라미터없이 보내시면 얘가 알잘딱하게 뱉스빈다

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    // GET POST PUT DELETE UPDATE   
    if (req.method == "GET"){
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
                const email = decoded?.email
                if(!email){
                    return res.status(500).send("500 Internal Server Error")
                }
                connection.query('SELECT email from user WHERE email=?', [email], (error:any, rows:string[]) => {
                    if(error){
                        console.log(error)
                        return res.status(500).send("500 Internal Server Error")
                    }
                    if(rows.length === 0){
                        connection.query('INSERT INTO user VALUES (?)', [email], (error:any, rows:string[]) => {
                            if (error) {
                                console.log(error);
                            }
                        });
                        const default_data = [[0, "ecvhao", "우왁굳"], [1, "inehine", "아이네♪"], [2, "jingburger1", "징버거☆"], [3, "lilpa0309", "릴파♥"], [4, "cotton1217", "주르르_"], [5, "gosegu2", "고세구!"], [6, "viichan6", "_비챤"]];
                        let bulkData: any = [];
                        default_data.forEach(item => {
                            item.unshift(email);
                            bulkData.push(item);
                        });
                        let placeholders = bulkData.map((item: any) => '(?, ?, ?, ?)').join(',');
                        let flatData = [].concat(...bulkData);
                        let bulkInsertQuery = `INSERT INTO data VALUES ${placeholders}`;
                        connection.query(bulkInsertQuery, flatData, (error:any, rows:string[]) => {
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
                                    "name": data.name
                                }
                            })
                            return res.send(result)
                        })
                        connection.release()
                    }
                    else{
                        connection.query('SELECT * from data WHERE email=?', [email], (error:any, rows:string[]) => {
                            if (error) {
                                console.log(error);
                            }
                            const result = rows.map((data:any) => {
                                return {
                                    "sequence": data.sequence,
                                    "id": data.id,
                                    "name": data.name
                                }
                            })
                            return res.send(result)
                        })
                        connection.release()
                    }
                })
            }
            catch{
                res.status(401).send("401 Unauthorized")
            }
        })
    } 
  }
  