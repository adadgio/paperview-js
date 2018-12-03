import { Size } from '../model/size.interface';

export function scale(viewport: Size, original: Size): number
{
    return viewport.width / original.width
}

export function calc(floatVal: any, scale: number = 1)
{
    return Math.round((floatVal * scale))
}

export function px(floatVal: any, scale: number = 1)
{
    return `${calc(floatVal, scale)}px`
}
