declare var window: any;
import { browser }  from './browser';
import { template } from './template';

export function embedText(page: HTMLElement, textHtml: string)
{
    let pageText = document.createElement('div')
    pageText.setAttribute('class', 'crocodoc-page-text')
    pageText.setAttribute('style', `width:100%`)

    pageText.innerHTML = textHtml;
    page.appendChild(pageText)
}
