declare var window: any;
import { browser }  from './browser';
import { template } from './template';

export function embedIMAGE(page: HTMLElement, imgSrc: SVGSVGElement)
{
    // let dataURLPrefix = 'data:image/svg+xml';
    // let svgContainerTemplate = '<svg version="1.1" xmlns="http://www.w3.org/2000/svg"></svg>'; // <script><![CDATA[('+PROXY_SVG+')()]]></script>
    // let svgEl: any = document.createElement('svg')
    // svgEl.src = imgSrc

    let pageSvg: HTMLElement = document.createElement('div')
    pageSvg.setAttribute('class', 'crocodoc-page-img-custom')

    let imgDoc: any = document.createElement('img')
    imgDoc.src = imgSrc


    pageSvg.appendChild(imgDoc)
    page.appendChild(pageSvg)
}
