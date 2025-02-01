import { info, error as winstonError  } from 'winston';
import { createWriteStream, WriteStream } from 'fs';
import { exist } from './validation';

/** return an initlized WriteStream instance
 *  or null if the file doesn't exist 
 *  difine the instance event listener actions 
 *
 * @param path      file path 
 * @param filename  the file to open
 * @returns WriteStream | null
 */
export function init_writer( path: string, filename: string ): WriteStream | null {
    if( !exist( path, filename ))
        return null;
    
    const writer: WriteStream = createWriteStream( path + filename , {flush: true});//instance flush option to flush file descriptor prior closing

    writer.on('finish', ()=>{
        info( "Writer finished" );
        writer.close();
    });
    writer.on('close', ()=>{
        info( filename + " closing..." );
    });
    writer.on('error', (error)=>{
        winstonError( "Error fired while writting stream on " + filename );
    });

    return writer;
}