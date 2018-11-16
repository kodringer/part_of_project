
let color = require('css-color-converter') //for convert rgba to hex
let pxEm = require('px-em') //for convert px to em

function toHex(colorPromise) {
    return colorPromise.then(value => color(value).toHexString() )
}

function toPx(pxPromise) {
    return pxPromise.then(pxEm)
}

function CSScheck (data, item)  {
            
    try {
        if (data.width) {item.getSize().then( (val) => {
            let deviation = data.deviation || 1
            let width = val.width
            expect(width).toBeWithinRange((width-deviation), (width+deviation), `Expected width to be ${data.width} `)
        })}

        if (data.height) {item.getSize().then( (value) => {expect(value.height).toBeWithinRange((data.height-2), (data.height+2), `Expected height to be ${data.height} `)})}
        data.background_color && expect(toHex(item.getCssValue('background-color'))).toEqual(data.background_color, `Expected background color to be ${data.background_color} `)
        data.background_image && expect(item.getCssValue('background-image')).toContain(data.background_image, `Expected background image to be ${data.background_image} `)
        data.border && expect(item.getCssValue('border')).toEqual(data.border, `Expected border to be ${data.border} `)
        data.font_family && expect(item.getCssValue('font-family')).toContain(data.font_family, `Expected font family to be ${data.font_family} `)
        data.font_size && expect(item.getCssValue('font-size')).toEqual(data.font_size, `Expected font size to be ${data.font_size} `)
        data.font_weight && expect(item.getCssValue('font-weight')).toEqual(data.font_weight, `Expected font weight to be ${data.font_weight} `)
        data.font_style && expect(item.getCssValue('font-style')).toEqual(data.font_style, `Expected font style to be ${data.font_style} `)
        data.font_stretch && expect(item.getCssValue('font-stretch')).toEqual(data.font_stretch, `Expected font stretch to be ${data.font_stretch} `)
        data.line_height && expect(toPx(item.getCssValue('line-height'))).toEqual(data.line_height, `Expected line height to be ${data.line_height} `)
        data.color && expect(toHex(item.getCssValue('color'))).toEqual(data.color, `Expected color to be ${data.color} `)
        if (data.x) {item.getLocation().then( (val) => {
            let deviation = data.deviation || 1
            let x = val.x
            expect(x).toBeWithinRange((data.x-deviation), (data.x+deviation), `Expected x to be: ${data.x} `)
        })}
        if (data.y) {item.getLocation().then( (y) => {expect(y.y).toBeWithinRange((data.y-2), (data.y+2), `Expected y to be: ${data.y} `)})}
        data.placeholder && expect(item.getAttribute('placeholder')).toEqual(data.placeholder, `Expected placeholder to be: ${data.placeholder} `)
    } catch(e) {
        expect(false).toBe(true, 'Test crashed with error: ' + e);
    }
}
module.exports = CSScheck