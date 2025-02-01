import { info, error as winstonError  } from 'winston';
import { createReadStream, ReadStream } from 'fs';
import { exist } from './validation';

/** return an initlized ReadStream instance
 *  or null if the file doesn't exist 
 *  difine the instance event listener actions 
 *
 * @param path      file path 
 * @param filename  the file to open
 * @returns ReadStream | null 
 */
export function init_reader( path: string , filename: string ): ReadStream | null {
    if( !exist( path, filename ))
        return null;
    
    const reader: ReadStream = createReadStream( path + filename, {encoding: 'utf-8'});
    
    reader.on('finish', ()=>{
        info( "Reader finished" );
        reader.close();
    });
    reader.on('close', ()=>{
        info( filename + " closing..." );
    });
    reader.on('error', (error)=>{
        winstonError( "Error fired while reading stream from " + filename );
    });

    return reader;
}