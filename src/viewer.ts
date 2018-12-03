declare var lightrange: any;
import './scss/viewer.scss';
import './scss/toolbar.scss';
import './scss/comment.scss';
import './scss/animations.scss';

import { px, scale }        from './utility/scale';
import { support }          from './utility/support';
import { width, height }    from './utility/support';
import { getComputedStyle } from './utility/support';
import { both }             from './utility/both';
import { fetchURL }         from './utility/fetch';
import { fetchSVG }         from './utility/fetch-svg';
import { fetchPNG }         from './utility/fetch-png';
import { fetchTEXT }        from './utility/fetch-text';
import { embedText }        from './utility/embed-text';
import { embedToolbar }     from './utility/embed-toolbar';
import { updateToolbar }    from './utility/embed-toolbar';
import { commentEditor }    from './utility/comment-editor';
import { Mouse }            from './utility/mouse';

import { Page, Comment  }   from './model';
import { safariFix }        from './safari.fix';

export class PaperView
{
    options: any = {};
    loaded: boolean = false;
    safariFix: Function;

    container: HTMLElement;     // usually #viewer
    viewport: HTMLElement;      // usually .crocodoc-viewport
    doc: HTMLElement;           // usually .crocodoc.doc
    pages: Array<Page> = []
    comments: Array<Comment> = []

    DOC_DIM: any = { width: 0, height: 0 }
    VIEWPORT_DIM: any = { width: 0, height: 0 }
    VIEWPORT_DIM_FORCED: boolean = false

    VERSION: string = '1.0.5';
    SCROLL_NEXT: string = 'next';
    SCROLL_PREVIOUS: string = 'previous';
    ZOOM_FIT_WIDTH: string = 'fitwidth';

    listeners: any = { ready: () => {} }

    constructor()
    {
        this.safariFix = safariFix
    }

    // helper to fix Android window height/width on mobile browsers
    // https://stackoverflow.com/questions/10610743/android-browsers-screen-width-screen-height-window-innerwidth-window-inner
    forceViewerSize(width: number, height: number)
    {
        this.VIEWPORT_DIM_FORCED = true
        this.VIEWPORT_DIM.width = width
        this.VIEWPORT_DIM.height = height

        return this
    }

    createViewer(selector: string, opts?: any)
    {
        this.options = opts;
        this.options.url = opts.url.replace(/\/$/, '')
        this.container = document.getElementById(selector.replace('#', ''))

        this.options.mode = (typeof opts.mode !== 'undefined') ? opts.mode : 'svg';
        this.options.comments = (typeof opts.comments !== 'undefined') ? both(opts.comments, { view: true, edit: true }) : { view: true, edit: true }
        this.options.svgFetchMode = (typeof opts.svgFetchMode === 'undefined') ? 'response/document' : opts.svgFetchMode;
        this.options.toolbar = (typeof opts.toolbar === 'undefined') ? false : opts.toolbar;
        this.options.debug = (typeof opts.debug === 'undefined') ? false : opts.debug;
        this.options.onError = (typeof opts.onError === 'undefined') ? (()=>{}) : opts.onError;

        this.viewport = document.createElement('div')
        this.doc = document.createElement('div')

        this.viewport.setAttribute('id', 'crocodoc-viewport')
        this.viewport.setAttribute('class', 'crocodoc-viewport')
        this.doc.setAttribute('class', 'crocodoc-doc')

        this.container.appendChild(this.viewport)
        this.viewport.appendChild(this.doc)

        // temp debug
        if (true === this.options.debug) {
            const debugElement = document.createElement('div')
            debugElement.setAttribute('class', 'debug')
            debugElement.innerHTML = `paperview-js v${this.VERSION} <span id="scroll-pos"></span>`;
            this.container.appendChild(debugElement)
        }

        if (!this.VIEWPORT_DIM_FORCED) {
            this.VIEWPORT_DIM.width = this.viewport.offsetWidth
            this.VIEWPORT_DIM.height = this.viewport.offsetHeight
        }

        return this;
    }

    load(): void
    {
        let imgsFetched: Array<Promise<SVGSVGElement|string|any>> = []
        let textsLoaded: Array<Promise<any>> = []

        fetchURL(`${this.options.url}/info.json`, 'json').then(info => {

            let scaling = scale(this.VIEWPORT_DIM, info.dimensions)

            // create requests for each pages (svg + text elements)
            for (var i = 0; i < info.numpages; i++) {
                this.pages.push(new Page(info.dimensions, scaling))

                if (this.options.mode === 'svg') {

                    imgsFetched.push(fetchSVG(`${this.options.url}/page-${i+1}.svg`, this.options.svgFetchMode))

                }  else if (this.options.mode === 'canvas') {

                    console.warn('Canvas mode is not yet supported')
                    let url = `${this.options.url}/page-${i+1}.png`
                    imgsFetched.push(Promise.resolve(url))

                } else if (this.options.mode === 'png') {

                    let url = `${this.options.url}/page-${i+1}.png`
                    imgsFetched.push(Promise.resolve(url))
                }

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

            Promise.all(imgsFetched).then((imgDocs: Array<SVGSVGElement|string>) => {

                for (var i=0; i < info.numpages; i++) {
                    const page = this.pages[i]
                    page.render(imgDocs[i], i, this.options.mode).appendTo(this.doc)
                    page.hideLoader()
                }

                this.loaded = true

                // set sizes only when all pages are loaded
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

                        // show current page and other info in toolbar
                        if (this.options.toolbar) {
                            // for debug onlyy!
                            let debugScrollPosElement = document.getElementById('debug-scroll-pos')
                            if (debugScrollPosElement) {
                                debugScrollPosElement.innerText = `${scrollPos}`
                            }

                            updateToolbar(currPageNum)
                        }

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
                // display the bottom toolbar when document is loaded
                if (true === this.options.toolbar) {
                    embedToolbar(this)
                }

            }).catch(error => {
                this.options.onError(error)
            })

        }).catch(error => {
            this.options.onError(error)
        })
    }

    loadComments()
    {
        fetchURL(`${this.options.url}/comments.json`, 'json').then((comments: Array<Comment>) => {
            comments = (null === comments) ? [] : comments
            this.comments = comments.map(data => new Comment(data))
            this.renderComments()
        })
    }

    renderComments()
    {
        for (let i in this.comments) {
            const page = this.pages[this.comments[i].pageNum]
            this.comments[i].render().appendTo(page, this.VIEWPORT_DIM.width)
        }
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
        return this.pages[pageNum - 1].offsetTop(pageNum)
    }

    getCurrentPageNum()
    {
        const scrollPos = this.getScrollPos()

        // page num would be the page currently at 2/3 of viewport
        const scrollPosFixed = scrollPos + (this.VIEWPORT_DIM.height * 0.666)

        let pageNum = 1;
        let pagesTotalHeight = 0;

        for (let i in this.pages) {
            pagesTotalHeight += this.pages[i].height

            if (scrollPosFixed >= pagesTotalHeight) {
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

        return this
    }

    addPlugin(name: string): void
    {

    }

    private getPageDistFromTop(number: number)
    {
        let pixels: number = 0;
        let scrollTop = this.viewport.scrollTop;


        for (let i in this.pages) {
            let index = parseInt(i)

            let pageHeight = this.pages[i].height;
            // pixels +=
            // @TODO
            // if ((index === number)) {
            //
            // }
        }

        return null;
    }

    private getPageTopDistFromTop(number: number)
    {
        let pixels: number = 0;

        for (let i in this.pages) {

            if ((parseInt(i) + 1) === number) {
                return pixels;
            }

            pixels += this.pages[i].height;
        }

        return pixels;
    }

    private enableComments()
    {
        commentEditor().onSave((comment: Comment) => {
            this.comments.push(comment)
            this.renderComments()
        })

        Mouse.enable().up((e, coords) => {
            commentEditor().hide()

            let selection = lightrange.getSelectionInfo()

            let currPageNum = this.getCurrentPageNum()
            // let pageTopDist = this.getPageDistFromTop(currPageNum)
            // let topFromPage = selection.yStart + pageTopDist

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
            // let realPageSelected = e.target;

            // let comment: Comment = new Comment({
            //     pageNum: currPageNum,
            //     top: topFromPage,
            //     left: selection.xStart,
            //     text: selection.text,
            //     scrollPos: this.getScrollPos(),
            //     viewportDimension: this.VIEWPORT_DIM,
            // })

            // commentEditor().show(comment, coords)
        })
    }
}
