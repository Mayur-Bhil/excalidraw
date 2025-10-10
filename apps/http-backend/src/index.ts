    import  express from "express";
    import jwt from "jsonwebtoken"
    import {JWT_SECRET} from "@repo/backend-common/config"
    import { middlware } from "./middlware";
    import {createUserSchama} from "@repo/common/types"

    const app = express();
    const port  = 3001;


    app.post("/signup",()=>{
        const data  = createUserSchama;
    })

    app.post("/signin",(req,res)=>{
        const userId = 1;

        const  token = jwt.sign({   
            userId
        },JWT_SECRET)

        res.json({

        })
    })

    app.post("/room",middlware,(req,res)=>{
        res.json({
            roomId:132
        })
    })

    app.listen(port,()=>{
        console.log(`server is listening on Port ${port}`);
    
    })