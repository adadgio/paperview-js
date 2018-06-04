declare var window: any;
import { browser }  from './browser';
import { template } from './template';

export type JsonEntry = {
    numPage: number;
    top: number;
    left: number;
    text: string;
    scrollPos: number;
    viewportDimension: any;
}

function correctPositionY()
{

}

export function embedComment(page: HTMLElement, comment: JsonEntry, newViewportHeight: number)
{
    let element = document.createElement('div')
    element.setAttribute('class', 'comment')
    element.innerHTML = `<span class="comment-text">${comment.text}</span>`

    page.appendChild(element)

    const computedStyles = getComputedStyle(element)

    // let height = parseInt(compStyles.height)
    // let paddingX = parseInt(computedStyles.paddingLeft) + parseInt(compStyles.paddingRight)
    // let paddingY = parseInt(computedStyles.paddingTop) + parseInt(compStyles.paddingBottom)

    // let topRelToPageTop = comment.top + element.offsetHeight + paddingYFix;

    // scale the comment top position from stored values considering (règle de trois...)
    let scaledTopPos = (newViewportHeight * comment.top) / comment.viewportDimension.height
    let paddingTopFix = scaledTopPos + element.offsetHeight
    
    console.log(comment.viewportDimension.height, comment.top, newViewportHeight)
    // correct the position given the element padding and height
    // scaledTopPos = scaledTopPos + paddingTopFix

    // console.log(this.getPageOffset(comment.numPage) + comment.yStart)
    // height and width only exist when the element exists in the DOM
    element.style.top = `${comment.top}px` //  - (element.offsetHeight + paddingX)
    element.style.left = `${comment.left}px`
}
