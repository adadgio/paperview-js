import { support } from './support';

export function fetchSVG(url: string, handler: Function = () => {}, responseType: 'type/text'|'type/document' = 'type/document'): Promise<SVGSVGElement>
{
    function newSVGElement(svgStr: string) {
        // const SVG_CONTAINER_TEMPLATE = '<svg version="1.1" xmlns="http://www.w3.org/2000/svg"><script><![CDATA[('+PROXY_SVG+')()]]></script></svg>'
        let placeholder = document.createElement('div')
        placeholder.innerHTML = svgStr;
        let svgElement = placeholder.firstChild

        return svgElement
    }

    return new Promise((resolve, reject) => {
        let xhr = support.getXHR()

        if (responseType === 'type/document') {
            xhr.responseType = 'document';
        } else if (responseType === 'type/text')  {
            xhr.responseType = 'text';
        }

        // xhr.respectType = 'application/json;charset:utf-8'
        xhr.overrideMimeType('image/svg+xml')
        xhr.open('GET', url, true)

        xhr.onreadystatechange = function() {
            if (xhr.readyState == 4) {
                let status = xhr.status;

                // remove the onreadystatechange handler,
                // because it could be called again
                // @NOTE: we replace it with a noop function, because
                // IE8 will throw an error if the value is not of type
                // 'function' when using ActiveXObject
                xhr.onreadystatechange = function(){}

                // status is 0 for successful local file requests, so assume 200
                if (status === 0) {
                    status = 200;
                }
                
                if (status === 200) {

                    if (responseType === 'type/document') {
                        resolve(xhr.responseXML.documentElement)

                    } else if (responseType === 'type/text')  {

                        // let svgText = encodeURIComponent(xhr.responseText)
                        let svgText = xhr.responseText

                        svgText = svgText.replace(/&#x2019;/g, "'")
                        svgText = svgText.replace(/&#xe002;/g, ' ')
                        let svgDoc: any = newSVGElement(svgText)
                        resolve(svgDoc)
                    }


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
