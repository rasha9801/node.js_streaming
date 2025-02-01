import express, { Request, Response, Router } from "express";
import { init_output } from "../components/processer";
import { WriteStream } from "fs";
import { info } from 'winston';

const router: Router = express.Router();

//define Express Router GET request to trigger file tranformation
router.get("/", (req: Request, res: Response)=>{
    const writer: WriteStream | null = init_output();
    //Error was thrown and writeStream is not initialized
    if( writer == null ) {
        res.status(500).send( "Error ... Check Errors in log file" );
        return;
    }

    info("Stream Tranformer has been started");
    writer.on('close', () => {
        //the stream is written on file, closing event listener sends success status
        if( !res.headersSent )
            res.status(200).send("SUCCESS ... stream has been processed, check log file for details")
    });
    writer.on('error', (error) => {
        //error while writting stream, error event listener sends fail status
        res.status(500).send( "Error ... Check Errors in log file" )
    });
    
});

export = router;