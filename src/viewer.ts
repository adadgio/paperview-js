import './scss/style.scss';
import { px, scale }    from './utility/scale';
import { support }      from './utility/support';
import { fetchURL }     from './utility/fetch';
import { fetchSVG }     from './utility/fetch-svg';
import { embedSVG }     from './utility/embed-svg';
import { embedText }    from './utility/embed-text';

export class PaperView
{
    options: any = {}
    container: HTMLElement;
    viewport: HTMLElement;
    doc: HTMLElement;

    VIEWPORT_DIM: any = {
        width: 0,
        height: 0,
    }

    listeners: any = {
        ready: () => {}
    }

    SCROLL_PREVIOUS = 'previous';
    SCROLL_NEXT = 'next';
    ZOOM_FIT_WIDTH = 'fitwidth';
    VERSION: string = '1.0.2';

    constructor()
    {

    }

    createViewer(selector: string, opts?: any)
    {
        this.options = opts;
        this.options.url = opts.url.replace(/\/$/, '')
        this.container = document.getElementById(selector.replace('#', ''))

        this.viewport = document.createElement('div')
        this.doc = document.createElement('div')

        this.viewport.setAttribute('class', 'crocodoc-viewport')
        this.doc.setAttribute('class', 'crocodoc-doc')

        this.container.appendChild(this.viewport)
        this.viewport.appendChild(this.doc)

        // temp debug
        const debugElement = document.createElement('div')
        debugElement.setAttribute('class', 'debug')
        debugElement.innerText = `paperview-js v${this.VERSION}`;
        this.container.appendChild(debugElement)

        this.VIEWPORT_DIM.width = this.viewport.offsetWidth
        this.VIEWPORT_DIM.height = this.viewport.offsetHeight

        return this;
    }

    load(): void
    {
        let pages: Array<HTMLElement> = []
        let pagesLoaded: Array<Promise<SVGSVGElement>> = []

        fetchURL(`${this.options.url}/info.json`, 'json').then(info => {
            let scaling = scale(this.VIEWPORT_DIM, info.dimensions)

            // create requests for each pages (svg + text elements)
            for (var i = 0; i < info.numpages; i++) {
                // create pages containers
                let page: HTMLElement = document.createElement('div')

                page.setAttribute('class', 'crocodoc-page-custom')
                page.setAttribute('style', `width:${px(info.dimensions.width, scaling)};height:${px(info.dimensions.height, scaling)}`)
                pages.push(page)

                pagesLoaded.push(fetchSVG(`${this.options.url}/page-${i+1}.svg`))
            }

            Promise.all(pagesLoaded).then(res => {

                for (var i=0; i < info.numpages; i++) {
                    const svgDoc: SVGSVGElement = res[i]
                    const page: HTMLElement = pages[i]

                    this.doc.appendChild(page)
                    embedSVG(page, svgDoc)
                }

                if (typeof this.listeners['ready'] === 'function') {
                    this.listeners['ready']()
                }

            }).catch(error => { console.log(error) })
        })
    }

    scrollTo(value: string)
    {

    }

    scrollTop()
    {

    }

    scrollBy(from: number, pixels: number)
    {

    }

    on(eventName: string, callback: Function)
    {
        this.listeners[eventName] = callback
        return this;
    }

    addPlugin(name: string): void
    {

    }
}
