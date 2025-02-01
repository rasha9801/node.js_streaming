import { Transform } from "stream";
import { ReadStream, WriteStream } from 'fs';
import { info, error as winstonError } from 'winston';

import * as config  from '../default.json';
import { init_writer } from "../streams/writer";
import { init_reader } from "../streams/reader";
import { axios_request, axiosErrortoString } from "./api";
import { init_prefix_transformer } from "../streams/transformer";

const public_path: string   = "./public/";
let input_file: string, output_file: string, prefix: string, url: string;

function init_parameters() {
    input_file    = config.input;
    output_file   = config.output;
    prefix        = config.prefix;
    url           = config.url;
};

/** stream pipline to transform streams
 *
 * @param reader        input file ReadStream
 * @param transformer   stream Transform
 * @param t_end         Transform end boolean option
 * @param writer        output file WriteStream
 * @param w_end         WriteStream end boolean option, if false keeping the write file open
 */
function process_data( reader: ReadStream, 
                        transformer: Transform, 
                        t_end:boolean,
                        writer: WriteStream, 
                        w_end: boolean ) {
    reader.pipe(transformer, { end: t_end }).pipe(writer, { end: w_end });
}

/** initlize the prefix transform instance used in stream pipeline
 * 
 * @param reader        input file ReadStream
 * @param writer        output file WriteStream
 * @returns Transform
 */
function add_prefix( reader: ReadStream, writer: WriteStream ): Transform {
    const transformer: Transform    = init_prefix_transformer(prefix);
    process_data( reader, transformer, true, writer, false );
    return transformer;
}

/** send axios request and write the response on the output file
 * 
 * @param writer        output file WriteStream
 */
async function write_api_response( writer: WriteStream ) {
    axios_request(url).then((response)=>{
            writer.write("\n");
            writer.write("\nAPI Response:\n");
            writer.write(JSON.stringify(response?.data, null, "\t"));
            writer.close();
    }).catch((error) => {
        winstonError( axiosErrortoString(error)); //convert error to string and log it to error.log
    });
}

/** writing output file with prefix and api response
 *
 * @returns WriteStream | null
 */
export function init_output(): WriteStream | null {
    init_parameters();
    const reader: ReadStream | null     = init_reader( public_path, input_file );  //initilize ReadStream
    const writer: WriteStream | null    = init_writer( public_path, output_file ); //initilize WriteStream
    if( reader == null || writer == null ) {
        info( "Processing Stream has stopped" );
        return null;
    }
    const transformer           = add_prefix( reader, writer ); //add prefix and returns transform
    transformer.on('finish', () => write_api_response( writer));//when the transformer finishes, request api and write its response on the file
    return writer;
}