import { support } from './support';

export function fetchURL(url: string, type: string = 'text', handler: Function = () => {}): Promise<any>
{
    return new Promise((resolve, reject) => {
        let xhr = support.getXHR()

        xhr.responseType = type;    //'arraybuffer|string'. seel also https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest/responseType
        xhr.open('GET', url, true)  // let true be async request

        xhr.onreadystatechange = function () {
            if (xhr.readyState == 4) {
                let status = xhr.status;

                // remove the onreadystatechange handler,
                // because it could be called again
                // @NOTE: we replace it with a noop function, because
                // IE8 will throw an error if the value is not of type
                // 'function' when using ActiveXObject
                xhr.onreadystatechange = function () {};

                // status is 0 for successful local file requests, so assume 200
                if (status === 0) {
                    status = 200;
                }

                if (status === 200) {
                    resolve(xhr.response)
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
