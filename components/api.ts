import axios, { AxiosError, AxiosRequestConfig, RawAxiosRequestHeaders } from 'axios';

/** initlize axios request configuration
 *
 * @returns AxiosRequestConfig
 */
function init_request_config(): AxiosRequestConfig {
    const config: AxiosRequestConfig = {
        headers: {
        } as RawAxiosRequestHeaders,
        params: {
        }
    };
    return config;
}

/** return axiosError as string
 *
 * @param error to be transformed into string
 * @returns string
 */
export function axiosErrortoString( error: AxiosError ): string {
    let message = "";
    // The request was made and the server responded with a status code
    if (error.response) {
        message += "Axios request recieved a status code as a response:\n";
        message += "status:\t" + error.response.status + "\n";  
        message += "data:\t" + error.response.data + "\n";  
    } else if (error.request) { // The request was made but no response was received
        message += "Axios request recievied no response:\n";
    } else {
        // Something happened in setting up the request that triggered an Error
        message += error.message + "\n";
    }
    return message;    
}
/** call GET request using Axios
 *
 * @param url get request url
 * @returns Promise
 */
export async function axios_request( url: string ){
    return await axios.get( url, init_request_config());
}