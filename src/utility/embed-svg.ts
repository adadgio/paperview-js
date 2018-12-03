declare var window: any;
import { browser }  from './browser';
import { template } from './template';

export function embedSVG(page: HTMLElement, svgDoc: SVGSVGElement)
{
    // let dataURLPrefix = 'data:image/svg+xml';
    // let svgContainerTemplate = '<svg version="1.1" xmlns="http://www.w3.org/2000/svg"></svg>'; // <script><![CDATA[('+PROXY_SVG+')()]]></script>
    // let svgEl: any = document.createElement('svg')
    // svgEl.src = svgDoc
    
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

// case EMBED_STRATEGY_DATA_URL_IMG:
//     svgEl = $svg[0];
//     dataURLPrefix = 'data:' + SVG_MIME_TYPE;
//     if (!browser.ie && window.btoa) {
//         svgEl.src = dataURLPrefix + ';base64,' + window.btoa(svgText);
//     } else {
//         svgEl.src = dataURLPrefix + ',' + encodeURIComponent(svgText);
//     }
//     break;

// var SVG_MIME_TYPE = 'image/svg+xml',
//     HTML_TEMPLATE = '<style>html,body{width:100%;height:100%;margin:0;overflow:hidden;}</style>',
//     SVG_CONTAINER_TEMPLATE = '<svg version="1.1" xmlns="http://www.w3.org/2000/svg"><script><![CDATA[('+PROXY_SVG+')()]]></script></svg>',
