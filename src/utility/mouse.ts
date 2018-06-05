export type MouseCoords = {
    x: number;
    y: number;
}

class MouseClass
{
    coordinates: MouseCoords = { x: null, y: null }

    enable()
    {
        document.onmousemove = (e) => {
            this.coordinates = { x: e.pageX, y: e.pageY }
        }

        return this
    }
    
    up(then: Function)
    {
        document.onmouseup = (e) => {
            then(e, this.getCoords())
        }
    }

    getCoords(): MouseCoords
    {
        return this.coordinates;
    }
}

export let Mouse = new MouseClass()
