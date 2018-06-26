function cleanArray(actual) {
    let newArray = new Array()

    for (let i = 0; i < actual.length; i++) {
        if (actual[i]) {
            newArray.push(actual[i]);
        }
    }
    return newArray;
}

function compare(a, b) {
    let diff = (b-a)
    if (diff > 5 && diff <= 10) {

    }

    return [a, b+5]
}

export function safariFix()
{
    let svgs = document.querySelectorAll('tspan')

    for (var i=0; i < svgs.length; i++) {
        const svgElement = svgs[i]
        const attr = svgElement.getAttribute('x')

        let xAttrs = attr.split(' ').map(val => { return (val == '') ? null : parseFloat(val.trim()) })
        // attrs = attrs.filter(val => { return val != '' })

        if (xAttrs.length <= 1) {
            continue;
        }

        // console.log(xAttrs)
        let list = []

        for (let i in xAttrs) {
            const value = xAttrs[i]

            if (parseInt(i) >= xAttrs.length) {
                continue;
            }

            const nextValue = xAttrs[i+1]
            xAttrs[i+1] = nextValue
            list.push(value)
        }
        
    }
}
