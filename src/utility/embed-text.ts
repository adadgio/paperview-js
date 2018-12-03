declare var window: any;
import { browser }  from './browser';
import { template } from './template';

export function embedText(page: HTMLElement, textHtml: string)
{
    // let innerBodyHtml = textHtml.match(/<body[^>]*>[\s\S]*<\/body>/gi)
    // let documentElement: any = document.createElement('html')
    // documentElement.innerHTML = textHtml // includes the html, head and body tags (see xhr request)
    
    let pageText = document.createElement('div')
    pageText.setAttribute('class', 'crocodoc-page-text-custom')
    pageText.setAttribute('style', `width:100%`)
    pageText.setAttribute('style', `height:100%`)

    pageText.innerHTML = textHtml;
    page.appendChild(pageText)
}
