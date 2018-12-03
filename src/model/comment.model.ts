import { Page }             from './page.model';
import { embedComment }     from '../utility/embed-comment';

export class Comment
{
    top: number;
    left: number;
    text: string;
    pageNum: number;
    scrollPos: number;
    viewportDimension: any;
    author?: any;

    nativeElement: HTMLElement;

    constructor(data: any)
    {
        this.top = data.top
        this.left = data.left
        this.text = data.text
        this.pageNum = data.pageNum
        this.scrollPos = data.scrollPos
        this.viewportDimension = data.viewportDimension
        this.author = data.author
    }

    render()
    {
        this.nativeElement = document.createElement('div')
        this.nativeElement.setAttribute('class', 'crocodoc-comment')
        this.nativeElement.innerHTML = `<div class="crocodoc-comment-underline"></div>
            <div class="crocodoc-comment-text"><div class="crocodoc-comment-text-inner">${this.text}</div></div>`

        return this
    }

    appendTo(page: Page, newViewportWidth: number)
    {
        page.nativeElement.appendChild(this.nativeElement)

        // real positions can only be calculated when the element is effecitvely
        // appended to the dom (because such values come from browser rendering btw)
        const computedStyles = getComputedStyle(this.nativeElement)

        // scale the comment top/left positions from stored values and possibly
        // different viewport size (with width diff because height does not affect scaling
        let scaledTopPos = (newViewportWidth * this.top) / this.viewportDimension.width
        let scaledLeftPos = (newViewportWidth * this.left) / this.viewportDimension.width
        
        // let topFix = 25;

        // height and width only exist when the element exists in the DOM
        this.nativeElement.style.top = `${(scaledTopPos + 28)}px`
        this.nativeElement.style.left = `${scaledLeftPos}px`

        return this
    }

    removeFrom(page: Page)
    {
        this.nativeElement.remove()

        return this
    }

    serialize()
    {
        return {
            top: this.top,
            left: this.left,
            text: this.text,
            pageNum: this.pageNum,
            scrollPos: this.scrollPos,
            viiewportDimension: this.viewportDimension,
            author: this.author,
        }
    }
}
