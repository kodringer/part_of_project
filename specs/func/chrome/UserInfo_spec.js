let userinfo = require('../../../testdata/css/chrome/userinfo.json')
let LoginFormNew = require('../../../pageObjects/LoginFormNew.js').LoginFormNew
let users = require('../../../testdata/users.json')
let uniq_id = require('../../../utils/util.js').uniq_id
let extraMatchers = require('jasmine-expect') //matcher for range
let isToast = require('../../../utils/util.js').isToast
let closeToast = require('../../../utils/util.js').closeToast
let gc_info = require('../../../testdata/css/chrome/gc_info.json')

describe('CXXX USERINFO FUNC TEST', () =>{

    let bd1loginForm = new LoginFormNew(BD1)
    let nickname = uniq_id(6)
    
    beforeAll(() => {
        jasmine.addMatchers(extraMatchers);
        BD1.get('')
        expect(EC.visibilityOf($(".maxine-logo"))).toBeTruthy()
        bd1loginForm.login(users.valid[0])
        BD1.wait(EC.presenceOf($(users.ctrl[0].loaded)), waitTime, 'site not loaded') 

        //Open USERINFO Panel
        BD1.actions().mouseMove($(userinfo.ctrl[0].recent_three_dots))
        $(userinfo.ctrl[0].recent_three_dots).click()
        //BD1.wait(EC.presenceOf($(userinfo.ctrl[0].three_dots_active)), waitTime, 'Three dots is not opened')
        BD1.wait(EC.presenceOf($(userinfo.ctrl[0].open)), waitTime, 'Three dots is not opened')
        $(userinfo.ctrl[0].open).click()
    })
    
    it(userinfo.cases[0].nickname_set, (done) => {

        $(userinfo.ctrl[0].edit_nickname).click()
        BD1.wait(EC.presenceOf($(userinfo.ctrl[0].nickname_edit_mode)), waitTime, 'Input is not active')
        $(userinfo.ctrl[0].nickname_input).sendKeys(nickname)
        $(userinfo.ctrl[0].nickname_input).sendKeys(protractor.Key.ENTER)
        BD1.wait(EC.invisibilityOf($(userinfo.ctrl[0].nickname_edit_mode)), waitTime, 'Input is still active')
        //BD1.wait(EC.textToBePresentInElement($(userinfo.ctrl[0].nickname_text), nickname), waitTime, "Nickname was not changed")
        expect($(userinfo.ctrl[0].nickname_text).getText()).toEqual(nickname, "Nickname was not shown in the nick-field")
        expect($(userinfo.ctrl[0].title).getText()).toEqual(nickname, "Nickname was not shown in the User info title")
        expect($(userinfo.ctrl[0].nickname_recent).getText()).toEqual(nickname, "Nickname was not shown in the recent")
        done()
    })

    it(userinfo.cases[0].nickname_remove, (done) => {

        $(userinfo.ctrl[0].edit_nickname).click()
        BD1.wait(EC.presenceOf($(userinfo.ctrl[0].nickname_edit_mode)), waitTime, 'Input is not active')
        $(userinfo.ctrl[0].nickname_input).sendKeys(protractor.Key.DELETE)
        $(userinfo.ctrl[0].nickname_input).sendKeys(protractor.Key.ENTER)
        BD1.wait(EC.invisibilityOf($(userinfo.ctrl[0].nickname_edit_mode)), waitTime, 'Input is still active')
        BD1.wait(EC.not(EC.textToBePresentInElement($(userinfo.ctrl[0].title), nickname), waitTime, "Nickname was not removed"))
        expect($(userinfo.ctrl[0].title).getText()).toContain($(userinfo.ctrl[0].lastname).getText())
        done()
    })
    
    it(userinfo.cases[0].chat, (done) => {

        $(userinfo.ctrl[0].three_dots_info).click()
        BD1.wait(EC.presenceOf($(gc_info.ctrl[0].three_dots_active)), waitTime, 'three dots is not active')
        $(userinfo.ctrl[0].start_chat).click()
        BD1.wait(EC.presenceOf($(gc_info.ctrl[0].chat_focus)), waitTime, 'chat editor is not active')
        //Open USERINFO Panel
        BD1.actions().mouseMove($(userinfo.ctrl[0].recent_three_dots))
        $(userinfo.ctrl[0].recent_three_dots).click()
        BD1.wait(EC.presenceOf($(userinfo.ctrl[0].open)), waitTime, 'Three dots is not opened')
        $(userinfo.ctrl[0].open).click()
        done()
    })

    it(userinfo.cases[0].refresh_presence, (done) => {

        $(userinfo.ctrl[0].three_dots_info).click()
        BD1.wait(EC.presenceOf($(gc_info.ctrl[0].three_dots_active)), waitTime, 'three dots is not active')
        $(userinfo.ctrl[0].refresh_presence).click()
        isToast().then(closeToast)
        done()
    })


    it(userinfo.cases[0].delete_contact, (done) => {

        $(userinfo.ctrl[0].delete_contact).click()
        BD1.wait(EC.presenceOf($(userinfo.ctrl[0].delete_confirm)), waitTime, 'Delete confirmation was not appeared')
        $(userinfo.ctrl[0].delete_contact_no).click()
        BD1.wait(EC.invisibilityOf($(userinfo.ctrl[0].delete_confirm)), waitTime, 'Delete confirmation was not disappeared')
        expect($(userinfo.ctrl[0].status_unknown).isPresent()).toBe(false, "Contact was deleted")
        $(userinfo.ctrl[0].delete_contact).click()
        BD1.wait(EC.presenceOf($(userinfo.ctrl[0].delete_confirm)), waitTime, 'Delete confirmation was not appeared')
        $(userinfo.ctrl[0].delete_contact_yes).click()
        BD1.wait(EC.invisibilityOf($(userinfo.ctrl[0].delete_confirm)), waitTime, 'Delete confirmation was not disappeared')
        isToast().then(closeToast)
        BD1.wait(EC.presenceOf($(userinfo.ctrl[0].status_unknown)), waitTime, 'contact was not deleted')
        expect($(userinfo.ctrl[0].status_unknown).isPresent()).toBe(true, "Contact was not deleted")
        done()
    })

}) 