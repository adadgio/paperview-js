declare var window: any;
import { browser }  from './browser';
import { template } from './template';

export function embedSVG(page: HTMLElement, svgDoc: SVGSVGElement)
{
    let pageSvg: HTMLElement = document.createElement('div')
    pageSvg.setAttribute('class', 'crocodoc-page-svg-custom')

    // scale the svg image to fit the page container
    // viewBox="0 0 800 1136.38722716249"
    svgDoc.setAttribute('preserveAspectRatio', 'xMinYMin slice') // slice|meet
    // svgDoc.setAttribute('width', `${page.offsetWidth}px`)
    // svgDoc.setAttribute('height', `${page.offsetHeight}px`)
    svgDoc.setAttribute('width', `100%`)
    svgDoc.setAttribute('height', `100%`)
    // svgDoc.setAttribute('viewBox', `0 0 ${page.offsetWidth} ${page.offsetHeight}`)
    
    pageSvg.appendChild(svgDoc)
    page.appendChild(pageSvg)
}
