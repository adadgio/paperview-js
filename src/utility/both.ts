export function both(value: any, fallbacks: any)
{
    let result: any = fallbacks;
    
    if (typeof value === 'boolean') {
        for (let prop of Object.keys(fallbacks)) {
            result[prop] = value;
        }
    } else if (typeof value === 'object') {
        result = value
    }

    return result
}
