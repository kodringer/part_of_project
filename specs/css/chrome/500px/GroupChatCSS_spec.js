let LoginFormNew = require('../../../../pageObjects/LoginFormNew.js').LoginFormNew
let CSScheck = require('../../../../utils/CSScheck.js')
let groupchat = require('../../../../testdata/css/chrome/groupchat.json')
let users = require('../../../../testdata/users.json')
let extraMatchers = require('jasmine-expect') //matcher for range

describe('CXXX GROUPCHAT CSS TEST - with vertical scrollbar', () =>{
    let bd1loginForm = new LoginFormNew(BD1)

    beforeAll(() => {
        jasmine.addMatchers(extraMatchers)
        BD1.driver.manage().window().setSize(1366, 500)
        BD1.get('')
        bd1loginForm.login(users.valid[1]) //login other user
        BD1.wait(EC.presenceOf($(users.ctrl[0].loaded)), waitTime, 'site not loaded')
        //Open CHAT Panel
        BD1.wait(EC.presenceOf($(groupchat.ctrl[0].open)), waitTime, 'NO Contacts')
        if ($(groupchat.ctrl[0].open)) {
            $(groupchat.ctrl[0].open).click()
        }
        else {console.log('NO Contacts')}
        $(groupchat.ctrl[0].scrollup).click()
//        BD1.sleep(3000)
        $(groupchat.ctrl[0].FilesButton).click()
    });

    //CHAT tests 
    groupchat.form.map(data => {
        
        it(data.description, () => {
                 CSScheck(data, $(data.dclass)) 
        })
    })
}) 