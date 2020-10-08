import { support } from './support';

export function fetchPNG(url: string, handler: Function = () => {}): Promise<string>
{
    return new Promise((resolve, reject) => {
        let xhr = support.getXHR()

        // xhr.responseType = 'arraybuffer';
        xhr.overrideMimeType('image/png')
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

                    // var arr = new Uint8Array(this.response);
                    // Convert the int array to a binary string
                    // We have to use apply() as we are converting an *array*
                    // and String.fromCharCode() takes one or more single values, not
                    // an array.
                    // var raw = '';
                    // var i,j,subArray,chunk = 5000;
                    // for (i=0,j=arr.length; i<j; i+=chunk) {
                    //    subArray = arr.subarray(i,i+chunk);
                    //    raw += String.fromCharCode.apply(null, subArray);
                    // }
                    //
                    // // This works!!!
                    // var b64=btoa(raw);
                    // var dataURL="data:image/png;base64,"+ b64;
                    resolve(this.responseText)
                    // var binary = '';
                    // var responseText = xhr.responseText;
                    // var responseTextLen = xhr.responseText.length;
                    //
                    // for ( let i = 0; i < responseTextLen; i++ ) {
                    //     binary += String.fromCharCode(responseText.charCodeAt(i) & 255)
                    // }
                    //
                    // let src = "data:image/png;base64," + btoa(binary)
                    // resolve(src)
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
        xhr.withCredentials = false;
        xhr.send()
    })
}
