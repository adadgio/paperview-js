declare var lightrange: any;
import './scss/viewer.scss';
import './scss/toolbar.scss';
import './scss/comment.scss';
import './scss/animations.scss';

import { px, scale }        from './utility/scale';
import { support }          from './utility/support';
import { both }             from './utility/both';
import { fetchURL }         from './utility/fetch';
import { fetchSVG }         from './utility/fetch-svg';
import { fetchTEXT }        from './utility/fetch-text';
import { embedSVG }         from './utility/embed-svg';
import { embedText }        from './utility/embed-text';
import { embedComment }     from './utility/embed-comment';
import { embedToolbar }     from './utility/embed-toolbar';
import { commentEditor }    from './utility/comment-editor';
import { JsonComment }      from './utility/comment-json.type';
import { Mouse }            from './utility/mouse';

export class PaperView
{
    options: any = {};
    loaded: boolean = false;

    container: HTMLElement;     // usually #viewer
    viewport: HTMLElement;      // usually .crocodoc-viewport
    doc: HTMLElement;           // usually .crocodoc.doc
    pages: Array<HTMLElement> = []

    PAGES_DIMS: Array<any> = []
    DOC_DIM: any = { width: 0, height: 0 }
    VIEWPORT_DIM: any = { width: 0, height: 0 }

    VERSION: string = '1.0.3';
    SCROLL_NEXT: string = 'next';
    SCROLL_PREVIOUS: string = 'previous';
    ZOOM_FIT_WIDTH: string = 'fitwidth';

    listeners: any = { ready: () => {} }

    constructor()
    {

    }

    createViewer(selector: string, opts?: any)
    {
        this.options = opts;
        this.options.url = opts.url.replace(/\/$/, '')
        this.container = document.getElementById(selector.replace('#', ''))

        this.options.comments = (typeof opts.comments !== 'undefined') ? both(opts.comments, { view: true, edit: true }) : { view: true, edit: true }

        this.viewport = document.createElement('div')
        this.doc = document.createElement('div')

        this.viewport.setAttribute('class', 'crocodoc-viewport')
        this.doc.setAttribute('class', 'crocodoc-doc')

        this.container.appendChild(this.viewport)
        this.viewport.appendChild(this.doc)

        // temp debug
        const debugElement = document.createElement('div')
        debugElement.setAttribute('class', 'debug')
        debugElement.innerHTML = `paperview-js v${this.VERSION} <span id="scroll-pos"></span>`;
        this.container.appendChild(debugElement)

        this.VIEWPORT_DIM.width = this.viewport.offsetWidth
        this.VIEWPORT_DIM.height = this.viewport.offsetHeight

        return this;
    }

    load(): void
    {
        this.pages = []
        let pagesLoaded: Array<Promise<SVGSVGElement>> = []
        let textsLoaded: Array<Promise<any>> = []
        // let promises: Array<Promise<any>> = []

        fetchURL(`${this.options.url}/info.json`, 'json').then(info => {
            let scaling = scale(this.VIEWPORT_DIM, info.dimensions)

            // create requests for each pages (svg + text elements)
            for (var i = 0; i < info.numpages; i++) {
                // create pages containers
                let page: HTMLElement = document.createElement('div')

                page.setAttribute('class', 'crocodoc-page-custom')
                page.setAttribute('style', `width:${px(info.dimensions.width, scaling)};height:${px(info.dimensions.height, scaling)}`)
                this.pages.push(page)

                pagesLoaded.push(fetchSVG(`${this.options.url}/page-${i+1}.svg`))
                // @TODO uncomment to load dirty text layer
                // textsLoaded.push(fetchTEXT(`${this.options.url}/text-${i+1}.html`))
            }

            // @TODO uncomment to render dirty text layer
            // Promise.all(textsLoaded).then(res => {
            //     for (var i=0; i < info.numpages; i++) {
            //         const bodyElement: HTMLElement = res[i]
            //         const html = bodyElement.innerHTML;
            //         const page: HTMLElement = this.pages[i]
            //
            //         embedText(page, html)
            //     }
            // })

            Promise.all(pagesLoaded).then(res => {

                for (var i=0; i < info.numpages; i++) {
                    const svgDoc: SVGSVGElement = res[i]
                    const page: HTMLElement = this.pages[i]

                    this.doc.appendChild(page)
                    embedSVG(page, svgDoc)
                    this.PAGES_DIMS[i] = { width: (page.offsetWidth), height: page.offsetHeight, offsetTop: ((i+1) * page.offsetHeight) - page.offsetHeight }
                }

                // set sizes (height in particular) when all pages are loaded
                this.loaded = true
                this.DOC_DIM.width = this.getDocWidth()
                this.DOC_DIM.height = this.getDocHeight()

                if (typeof this.listeners['ready'] === 'function') {
                    const event = { eventName: 'ready', numPages: this.pages.length, dimensions: {  viewportSize: this.VIEWPORT_DIM, docSize: this.DOC_DIM } }
                    this.listeners['ready'](event)
                }

                // attach scroll event
                this.viewport.onscroll = (e) => {
                    if (typeof this.listeners['scroll'] === 'function') {

                        const scrollPos = this.getScrollPos()
                        const currPageNum = this.getCurrentPageNum()

                        document.getElementById('scroll-pos').innerText = `${scrollPos}`
                        const event = { eventName: 'scroll', scrollTop: scrollPos, numPages: this.pages.length, currentPage: currPageNum }
                        this.listeners['scroll'](event)
                    }
                }

                if (true === this.options.comments.view) {
                    this.loadComments()
                }
                if (true === this.options.comments.edit) {
                    this.enableComments()
                }

                // display toolbar when document is loaded
                embedToolbar(this)
                
                // @TODO To remove
                // this.placeMarkers()

            }).catch(error => { console.log(error) })
        })
    }

    loadComments()
    {
        fetchURL(`${this.options.url}/comments.json`, 'json').then((comments: Array<JsonComment>) => {
            for (let i in comments) {
                const comment = comments[i]
                const page: HTMLElement = this.pages[comment.numPage]
                embedComment(page, comment, this.VIEWPORT_DIM.width)
            }
        })
    }

    getDocHeight()
    {
        if (!this.loaded) {
            console.warn(`All pages are not loaded yet and you are calling ::getDocHeight before: height value could be flawed.`)
        }

        return this.doc.offsetHeight
    }

    getDocWidth()
    {
        if (!this.loaded) {
            console.warn(`All pages are not loaded yet and you are calling ::getDocWidth before: width value could be flawed.`)
        }

        return this.doc.offsetWidth
    }

    getScrollPos()
    {
        return this.viewport.scrollTop
    }

    getPageOffset(pageNum: number)
    {
        return this.PAGES_DIMS[pageNum - 1].offsetTop
    }

    getCurrentPageNum()
    {
        const scrollPos = this.getScrollPos()
        // page num would be the page currently at 2/3 of viewport
        const scrollPosFixed = scrollPos + (this.VIEWPORT_DIM.height * 0.666)

        let pageHeightTotal = 0,
            pageNum = 0;

        for (let i in this.PAGES_DIMS) {

            let pageInfo = this.PAGES_DIMS[i]
            pageHeightTotal += pageInfo.height

            if (scrollPosFixed >= pageHeightTotal) {
                pageNum++;
            }
        }

        return pageNum;
    }

    scrollTo(pixels: number|string)
    {
        pixels = (typeof pixels === 'string') ? parseInt(pixels) : pixels
        this.viewport.scrollTop = pixels
        return this
    }

    scrollToPage(number: number)
    {
        let pixels: number = this.getPageTopDistFromTop(number);

        if (null !== pixels) {
            this.scrollTo(pixels)
        } else {
            console.warn(`::scrollToPage() Cannot scroll because this page number does not exist)`)
        }

        return this
    }

    scrollTop()
    {
        this.viewport.scrollTop = 0
        return this
    }

    scrollBy(pixels: number|string)
    {
        pixels = (typeof pixels === 'string') ? parseInt(pixels) : pixels
        this.viewport.scrollTop += pixels
        return this
    }

    on(eventName: string, callback: Function)
    {
        this.listeners[eventName] = callback
        return this;
    }

    addPlugin(name: string): void
    {

    }

    // private guessHeight(element: HTMLElement)
    // {
    //     let test = element.cloneNode(true)
    //     element.style.visibility = 'hidden'
    //     document.body.appendChild(element)
    //
    // }

    private getPageTopDistFromTop(number: number)
    {
        let pixels: number = 0;

        for (let i in this.PAGES_DIMS) {
            let index = parseInt(i) + 1

            if (index === number) {
                return pixels;
            }

            pixels += this.PAGES_DIMS[i].height;
        }

        return null;
    }

    // @TODO Method to remove
    private placeMarkers()
    {
        let line1 = document.createElement('div')
        line1.setAttribute('class', 'line1')
        document.body.appendChild(line1)

        let line2 = document.createElement('div')
        line2.setAttribute('class', 'line2')
        this.pages[1].appendChild(line2)
    }

    private enableComments()
    {
        commentEditor().onSave((comment: JsonComment) => {
            console.log(comment, JSON.stringify(comment))
        })

        Mouse.enable().up((e, coords) => {

            commentEditor().hide()

            let selection = lightrange.getSelectionInfo()

            // let selection = window.getSelection()
            // let oRange = selection.getRangeAt(0) // get text range
            // let oRect = oRange.getBoundingClientRect()
            // let pageNum = this.getCurrentPageNum()
            //
            // let jsonComment: JsonComment = {
            //     pageNum: pageNum,
            //     top: oRect.top,
            //     left: oRect.left,
            //     text: selection.toString(),
            //     scrollPos: this.getScrollPos(),
            //     viewportDimension: this.VIEWPORT_DIM,
            // }

            if (selection.characters === 0) {
                return;
            }

            let jsonComment: JsonComment = {
                pageNum: this.getCurrentPageNum(),
                top: selection.yStart,
                left: selection.xStart,
                text: selection.text,
                scrollPos: this.getScrollPos(),
                viewportDimension: this.VIEWPORT_DIM,
            }

            commentEditor().show(jsonComment, coords)
        })
    }
}
