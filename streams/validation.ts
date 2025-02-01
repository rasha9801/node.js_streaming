import { existsSync, writeFileSync } from 'fs';
import { info, error as winstonError } from 'winston';

/** create new file, return true if the file was created correctly 
 *
 * @param path      file path 
 * @param filename  created file name
 * @returns boolean
 */
function create_file( path: string, filename: string ): boolean {
    try {
        writeFileSync( path + filename , "", { flag: "w" } )
    } catch( error ) {
        winstonError( "Failed creating " + filename + " inside " + path + " directory\n");
    }
    info( "Created " + filename + " sucessfully" );
    return true;
}

/** check if the file exist, if not the file creats it
 *
 * @param path      file path 
 * @param filename  checked file
 * @returns boolean
 */
export function exist( path: string, filename: string ): boolean {
    //file exist
    if(existsSync( path + filename))
        return true;
    
    //create file
    info( filename + " doesn't exist" );
    try {
        create_file( path , filename );
    }catch( error ) {
        return false;
    }
    return true;
}