declare var window: any;
import { browser }  from './browser';
import { template } from './template';

export function embedCANVAS(page: HTMLElement, imgUrl: string)
{
    let pageCanvas: HTMLElement = document.createElement('div')
    pageCanvas.setAttribute('class', 'crocodoc-page-canvas-custom')

    page.appendChild(pageCanvas)

    let image = new Image()
    let canvas = document.createElement('canvas')

    image.onload = () => {

        let scaleFactor = 1.8
        canvas.width = page.offsetWidth / scaleFactor
        canvas.height = page.offsetHeight / scaleFactor

        // let w = page.offsetWidth * scaleFactor
        // let h = page.offsetHeight * scaleFactor
        
        let ctx = canvas.getContext('2d')
        ctx.drawImage(image, 0, 0, canvas.width , canvas.height) //

        pageCanvas.appendChild(canvas)
    }

    image.src = imgUrl
}
