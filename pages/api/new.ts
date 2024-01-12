import type { NextApiRequest, NextApiResponse } from 'next'
const mongoose = require('mongoose')
const { v4 } = require('uuid');

export default function handler(req: NextApiRequest,res: NextApiResponse
    ) {
        const uuid = v4()
        res.json({"key": uuid})
  }
  