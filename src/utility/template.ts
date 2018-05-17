export function template(template, data) {
    let p: any;

    for (p in data) {
        if (data.hasOwnProperty(p)) {
            template = template.replace(new RegExp('\\{\\{' + p + '\\}\\}', 'g'), data[p])
        }
    }

    return template
}
