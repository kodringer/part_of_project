let LoginFormNew = require('../../../pageObjects/LoginFormNew.js').LoginFormNew
let users = require('../../../testdata/users.json')
let invite = require('../../../testdata/css/chrome/invite.json')
let extraMatchers = require('jasmine-expect') //matcher for range
//let EC = protractor.ExpectedConditions

describe('CXXX INVITE FUNC TEST', () =>{
    
    let bd1loginForm = new LoginFormNew(BD1)
   
    beforeAll(() =>{
        jasmine.addMatchers(extraMatchers);
        BD1.get('')
        bd1loginForm.login(users.valid[0])
        BD1.wait(EC.presenceOf($(users.ctrl[0].loaded)), 20000, 'site not loaded')

        //Open INVITE Panel
 
        $(invite.ctrl[0].toolbar).click()
        $(invite.ctrl[0].invite).click()
        
     //   BD1.sleep(5000)

    });

    afterAll(() =>{
        //Close INVITE panel
        $(invite.ctrl[0].close).click()
    }); 

    it('Invite page - Default 3 mail fields', () => {
        expect($$(invite.ctrl[0].removeMail).count()).toEqual(3, '3 mail fields by default')
    })

    it('Invite page - Mail field is mandatory', () => {
        $(invite.ctrl[0].inviteButton).click()
        expect(EC.visibilityOf($(invite.ctrl[0].errorMessage))).toBeTruthy()
    })

    it('Invite page - Error if not mail format', () => {
        //Close and open INVITE panel
        $(invite.ctrl[0].close).click()
        $(invite.ctrl[0].toolbar).click()
        $(invite.ctrl[0].invite).click()
        //Input not valid mail
        $(invite.ctrl[0].inputMail).sendKeys('aaa')
        $(invite.ctrl[0].inviteButton).click()
        expect(EC.visibilityOf($(invite.ctrl[0].errorMessage))).toBeTruthy()
    })

    it('Invite page - Invite message field is mandatory', () => {

        let ctrlA = protractor.Key.chord(protractor.Key.CONTROL, 'a')
        //Close and open INVITE panel
        $(invite.ctrl[0].close).click()
        $(invite.ctrl[0].toolbar).click()
        $(invite.ctrl[0].invite).click()
        //Clear message area
        $(invite.ctrl[0].message).sendKeys(ctrlA)
        $(invite.ctrl[0].message).sendKeys(protractor.Key.ENTER)
        //Mail input
        $(invite.ctrl[0].inputMail).sendKeys('aaa@mail.com')
        $(invite.ctrl[0].inviteButton).click()
        expect(EC.visibilityOf($(invite.ctrl[0].errorMessage))).toBeTruthy()
    })

    it('Invite - Add mail', () => {
        $(invite.ctrl[0].addAnother).click()
        expect($$(invite.ctrl[0].removeMail).count()).toEqual(4, '1 mail field added')
    })

    it('Invite - Remove mail', () => {
        $(invite.ctrl[0].removeMail).click()
        expect($$(invite.ctrl[0].removeMail).count()).toEqual(3, '1 mail field removed')
    })

    it('Invite - Max 10 mail fields', () => {
        for (i = 0; i<8; i++) {
            $(invite.ctrl[0].addAnother).click()
        }
        expect($$(invite.ctrl[0].removeMail).count()).toEqual(10, '10 mail fields max')
        expect(EC.visibilityOf($(invite.ctrl[0].addDisabled))).toBeTruthy()
    })

}) 