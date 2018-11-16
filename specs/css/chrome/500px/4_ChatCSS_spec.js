let CSScheck = require('../../../../utils/CSScheck.js')
let chat = require('../../../../testdata/css/chrome/chat.json')
let extraMatchers = require('jasmine-expect') //matcher for range

describe('CXXX CHAT CSS TEST - with vertical scrollbar', () =>{
    
    beforeAll(() => {
        jasmine.addMatchers(extraMatchers)

        //Open CHAT Panel
        BD1.wait(EC.presenceOf($(chat.ctrl[0].open)), waitTime, 'NO Contacts')
        if ($(chat.ctrl[0].open)) {
            $(chat.ctrl[0].open).click()
        }
        else {console.log('NO Contacts')}
        BD1.actions().mouseMove($(chat.ctrl[0].scrollup)).perform()
        $(chat.ctrl[0].scrollup).click()
        $(chat.ctrl[0].FilesButton).click()
    });

    //CHAT tests 
    chat.form.map(data => {
        
        it(data.description, () => {
                 CSScheck(data, $(data.dclass)) 
        })
    })
}) 