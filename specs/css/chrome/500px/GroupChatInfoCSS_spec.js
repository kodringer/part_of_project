let CSScheck = require('../../../../utils/CSScheck.js')
let gc_info = require('../../../../testdata/css/chrome/gc_info.json')
let extraMatchers = require('jasmine-expect') //matcher for range

describe('CXXX GROUPCHAT INFO CSS TEST WITH 1366x1000', () =>{
    
    beforeAll(() => {
        jasmine.addMatchers(extraMatchers);
        BD1.actions().mouseMove($(gc_info.ctrl[0].recent_item))
        //Open USERINFO Panel
        $(gc_info.ctrl[0].three_dots).click()
        $(gc_info.ctrl[0].open).click()
        
    })

    //USERINFO tests 
    gc_info.form.map(data => {
        
        it(data.description, () => {
                 CSScheck(data, $(data.dclass)) 
        })
    
    })
}) 
