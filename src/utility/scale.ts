type Dimension = {
    width: number;
    height: number;
}

export function scale(viewport: Dimension, original: Dimension)
{
    return viewport.width / original.width
}

export function px(floatVal: any, scale: number = 1)
{
    return `${Math.round((floatVal * scale))}px`
}
