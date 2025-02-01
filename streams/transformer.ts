import LineTransformStream from 'line-transform-stream';
import { info, error as winstonError  } from 'winston';

/** return an initlized line Transform instance
 *  difine the instance event listener actions 
 *
 * @param prefix string to be added befor every line
 * @returns LineTransformStream
 */
export function init_prefix_transformer(prefix: string) {
    const filter:LineTransformStream = new LineTransformStream( ( line: string ) => {
        //add prefix before every line
        return prefix + " " + line;
    });
    filter.on('finish', ()=>{
        info( "transformer finished processing data");
    });
    filter.on('error', ( error )=>{
        winstonError( "Error fired while transforming stream" );
    });
    return filter;
}