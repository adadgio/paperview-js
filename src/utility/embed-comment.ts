declare var window: any;
import { browser }  from './browser';
import { template } from './template';
import { CommentJson } from './comment-json.type';

export function embedComment(page: HTMLElement, comment: CommentJson, newViewportWidth: number)
{
    let element = document.createElement('div')
    element.setAttribute('class', 'crocodoc-comment') // toggle visible/hidden comments  hidden
    element.innerHTML = `<span>${comment.text}</span>`

    page.appendChild(element)

    const computedStyles = getComputedStyle(element)

    // scale the comment top/left positions from stored values and possibly
    // different viewport size (with width diff because height does not affect scaling
    let scaledTopPos = (newViewportWidth * comment.top) / comment.viewportDimension.width
    let scaledLeftPos = (newViewportWidth * comment.left) / comment.viewportDimension.width

    let paddingTopFix;
    let  paddingLeftFix;

    // console.log(this.getPageOffset(comment.numPage) + comment.yStart)
    // height and width only exist when the element exists in the DOM
    element.style.top = `${scaledTopPos}px`
    element.style.left = `${scaledLeftPos}px`
}
