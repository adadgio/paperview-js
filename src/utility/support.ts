declare var window: any;
declare var ActiveXObject: any;
let xhrSupported = null, xhrCORSSupported = null;

export let support: any = {
    /**
     * Return true if XHR is supported
     * @returns {boolean}
     */
    isXHRSupported: () => {
        if (xhrSupported === null) {
            xhrSupported = !!this.getXHR();
        }
        return xhrSupported;
    },

    /**
     * Return true if XHR is supported and is CORS-enabled
     * @returns {boolean}
     */
    isCORSSupported: () => {
        if (xhrCORSSupported === null) {
            xhrCORSSupported = this.isXHRSupported() &&
                               ('withCredentials' in this.getXHR());
        }
        return xhrCORSSupported;
    },

    /**
     * Return true if XDR is supported
     * @returns {boolean}
     */
    isXDRSupported: () => {
        return typeof window.XDomainRequest !== 'undefined';
    },

    /**
     * Get a XHR object
     * @returns {XMLHttpRequest} An XHR object
     */
    getXHR: () => {
        if (window.XMLHttpRequest) {
            return new window.XMLHttpRequest();
        } else {
            try {
                return new ActiveXObject('MSXML2.XMLHTTP.3.0');
            }
            catch(ex) {
                return null;
            }
        }
    },

    /**
     * Get a CORS-enabled request object
     * @returns {XMLHttpRequest|XDomainRequest} The request object
     */
    getXDR: () => {
        if (this.isXDRSupported()) {
            return new window.XDomainRequest();
        }
        return null;
    },

}
