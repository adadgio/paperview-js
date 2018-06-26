type SizeTuple = {
    width: number;
    height: number;
}

const DEFAULT_ZOOM: number = 1.0;
let ZOOM: number = 1.0;
let ORIGINAL_SIZE: SizeTuple;

export function zoomSize(tuple: SizeTuple, scale: number): SizeTuple
{
    return { width: (tuple.width * scale), height: tuple.height * scale }
}

export function zoomInOrOut(viewer: any, zoomCoef: number)
{
    // ZOOM = Math.round(ZOOM * zoomCoef)

    // let originalSize = viewer.getDocHeight()
    if (zoomCoef === 1) {
        // @TODO Not finding satisfiying solution to rever to default zoom
        // revert to original zoom level (coef = 1)
    }

    for (let i in viewer.pages) {

        let width = parseInt(viewer.pages[i].width) * zoomCoef
        let height = parseInt(viewer.pages[i].height) * zoomCoef

        viewer.pages[i].width = Math.round(width)
        viewer.pages[i].height = Math.round(height)
        viewer.pages[i].nativeElement.width = `${Math.round(width)}px`
        viewer.pages[i].nativeElement.height = `${Math.round(height)}px`

        // @TODO Tried to adjust scroll when zoom is modified
        // but this does not yield satisfing results
        // let heightDiff = originalHeight - Math.round(originalHeight * zoomCoef)
        // height diff will automatically be negative when zoomed
        // if (zoomCoef < 1) {
        //     viewer.scrollBy(-100 * zoomCoef)
        // } else if (zoomCoef > 1) {
        //     viewer.scrollBy(100)
        // }
    }
}

export function updateToolbar(currentPage: number)
{
    let element: any = document.getElementById('crocodoc-toolbar-pages')
    
    if (element) {
        element.innerText = `${currentPage}`
    }
}

export function embedToolbar(viewer: any)
{
    let element = document.createElement('div')
    element.setAttribute('class', 'crocodoc-toolbar')

    if (element == null)  {
        return;
    }

    element.innerHTML = `<div class="crocodoc-toolbar">
        <div class="crocodoc-toolbar-inner">
            <a class="crocodoc-toolbar-element" href="" id="crodococ-btn-zoom-in">In</a>
            <a class="crocodoc-toolbar-element" href="" id="crodococ-btn-zoom-out">Out</a>
            <a class="crocodoc-toolbar-element" href="" id="crodococ-btn-zoom-fit">Fit</a>
            <span id="crocodoc-toolbar-pages" class="crocodoc-toolbar-element crocodoc-toolbar-pages"></span>
        </div>
    </div>`;

    document.body.appendChild(element)

    let zoomInBtn = document.getElementById('crodococ-btn-zoom-in')
    let zoomOutBtn = document.getElementById('crodococ-btn-zoom-out')
    let zoomFitBtn = document.getElementById('crodococ-btn-zoom-fit')

    // ORIGINAL_SIZE.width = parseInt(viewer.pages[0].style.width)
    // ORIGINAL_SIZE.height = parseInt(viewer.pages[0].style.height)

    zoomInBtn.onclick = (e) => {
        e.preventDefault()
        e.stopPropagation()
        zoomInOrOut(viewer, DEFAULT_ZOOM + 0.15)
    }

    zoomOutBtn.onclick = (e) => {
        e.preventDefault()
        e.stopPropagation()
        zoomInOrOut(viewer, DEFAULT_ZOOM - 0.15)
    }

    zoomFitBtn.onclick = (e) => {
        e.preventDefault()
        e.stopPropagation()
        zoomInOrOut(viewer, DEFAULT_ZOOM)
    }
}
