import { calc }         from '../utility/scale';
import { embedSVG }     from '../utility/embed-svg';
import { embedCANVAS }  from '../utility/embed-canvas';
import { embedIMAGE }   from '../utility/embed-image';
import { Size }         from './size.interface';

export class Page
{
    private baseWidth: number;
    private baseHeight: number;
    private scale: number = 1;

    public width: number;
    public height: number;
    public nativeElement: HTMLElement;
    public loader: HTMLElement;

    constructor(size: Size, scale: number = 1)
    {
        this.scale = scale
        this.baseWidth = size.width
        this.baseHeight = size.height
    }

    appendTo(doc: HTMLElement)
    {
        doc.appendChild(this.nativeElement)

        return this
    }

    render(imgDoc: SVGSVGElement|any, index?: number, rendering: string = 'svg')
    {
        this.nativeElement = document.createElement('div')
        this.nativeElement.setAttribute('class', 'crocodoc-page-custom')
        this.nativeElement.setAttribute('data-index', `${index}`)

        // scale the width and height according to scale
        this.width = calc(this.baseWidth, this.scale)
        this.height = calc(this.baseHeight, this.scale)

        this.nativeElement.setAttribute('style', `width: ${this.width}px; height:${this.height}px`)

        this.loader = document.createElement('div')
        this.loader.setAttribute('class', 'page-loading-gif visible')
        this.nativeElement.appendChild(this.loader)

        if (rendering === 'canvas') {
            embedCANVAS(this.nativeElement, imgDoc)
        } else if (rendering === 'svg') {
            embedSVG(this.nativeElement, imgDoc)
        }  else if (rendering === 'png') {
            embedIMAGE(this.nativeElement, imgDoc)
        }

        return this
    }

    hideLoader()
    {
        this.loader.style.display = 'none'
        return this
    }

    offsetTop(index: number|string)
    {
        index = (typeof index === 'string') ? parseInt(index) : index;
        return ((index + 1) * this.height) - this.height
    }
}
