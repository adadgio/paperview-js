import { support } from './support';

export function fetchSVG(url: string, handler: Function = () => {}): Promise<SVGSVGElement>
{
    return new Promise((resolve, reject) => {
        let xhr = support.getXHR()
        
        xhr.responseType = 'document';
        xhr.overrideMimeType('image/svg+xml')
        xhr.open('GET', url, true)

        xhr.onreadystatechange = function () {
            if (xhr.readyState == 4) {
                let status = xhr.status;

                // remove the onreadystatechange handler,
                // because it could be called again
                // @NOTE: we replace it with a noop function, because
                // IE8 will throw an error if the value is not of type
                // 'function' when using ActiveXObject
                xhr.onreadystatechange = function(){};

                // status is 0 for successful local file requests, so assume 200
                if (status === 0) {
                    status = 200;
                }

                if (status === 200) {

                    resolve(xhr.responseXML.documentElement)
                    // if (type === 'document') {
                    //
                    // } else {
                    //     resolve(xhr.responseText)
                    // }

                } else {
                    reject(xhr)
                }
            }
        }

        // this needs to be after the open call and before the send call
        xhr.withCredentials = true;
        xhr.send()
    })
}
