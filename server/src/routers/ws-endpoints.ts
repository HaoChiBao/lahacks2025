
import express from 'express'

import { wss } from '../services/websocket'

const router = express.Router() 

// random post request
// router.post('/startGame', async (req, res) => {
//     try {

//         const data = req.body
//         const { room_id } = data

//         wss.startGame(room_id)

//         res.status(200).json({status: 'game started'})

//     } catch (e:any) {
//         console.warn("Error", e)
//         res.status(500).json({error: e.message || "server error"})
//     }
// })

router.get('/getRooms', async (req, res) => {
    try {
        res.status(200).json({rooms: wss.getRooms()})
    } catch (e:any) {
        console.warn("Error", e)
        res.status(500).json({error: e.message || "server error"})
    }
})

export const ws_endpoints = router