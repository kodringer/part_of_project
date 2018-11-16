let LoginFormNew = require('../../../pageObjects/LoginFormNew.js').LoginFormNew
let ChatWindow = require('../../../pageObjects/Chat.js').Chat
let users = require('../../../testdata/users.json')
let chat = require('../../../testdata/css/chrome/chat.json')
let messages = require('../../../testdata/messages.json')
let uniq_id = require('../../../utils/util.js').uniq_id
let getHeight = require('../../../utils/util.js').getHeight
//let quoteLastMessage = require('../../../utils/util.js').quoteLastMessage
let openNewTab = require('../../../utils/util.js').openNewTab
let switchToTab = require('../../../utils/util.js').switchToTab
let fileUpload = require('../../../utils/util.js').fileUpload
let contacts = require('../../../testdata/css/chrome/contacts.json')
let uploads = require('../../../testdata/uploads.json')

describe('CXXX CHAT FUNC TEST', () =>{

    let bd1loginForm = new LoginFormNew(BD1)
    let dialog1 = new ChatWindow(BD1)
    let ID_sent = uniq_id(6)
    let ID_answer = uniq_id(5)
    let ID_quote = uniq_id(7)
    let ID_row = uniq_id(8)
//    let ID_allSmiles = uniq_id(3)
    let ID_randomSmile = uniq_id(4)

    beforeAll(() => {
        BD1.get('')
        BD1.wait(EC.presenceOf($(".maxine-logo")), waitTime, "logo is not loaded")
        bd1loginForm.login(users.valid[0])
        BD1.wait(EC.presenceOf($(users.ctrl[0].loaded)), waitTime, 'site not loaded') 
        //choosed logo as event that "site loaded". 
    })

     it(' Check start chat', (done) => {

        $('[data-for*="' + users.valid[1].user1 + '"]').click()
        dialog1.send(ID_sent+messages.string[3].value) // send message
        expect($$(chat.ctrl[0].content).last().getText()).toEqual(ID_sent+messages.string[3].value) //check sent message in chat window
        expect($(contacts.ctrl[0].recentMessage).getText()).toStartWith(ID_sent) //check message in recent tab
        done()
        })

    it(' Check login as other user in other tab and answer', (done) => {

        openNewTab().then(switchToTab(1))
            .then(() => { //the focus moves on new tab
                BD1.get('')
                bd1loginForm.login(users.valid[1]) //login other user
                BD1.wait(EC.presenceOf($(users.ctrl[0].loaded)), waitTime, 'site not loaded') 
                $('[data-for*="' + users.valid[0].user0 + '"]').click()
                dialog1.send(ID_answer+messages.string[1].value) // send message
                expect($$(chat.ctrl[0].content).last().getText()).toEqual(ID_answer+messages.string[1].value) //check answer message in chat window
                expect($(contacts.ctrl[0].recentMessage).getText()).toStartWith(ID_answer) //check message in recent tab
                expect($$(chat.ctrl[0].message_time).last().getText()).not.toBe('', "Message time is empty") 
                dialog1.send(messages.string[1].value)
                expect($$(chat.ctrl[0].message_time).last().getText()).toBe('', "Message time is not empty") 
                BD1.close()
                }).then(() => {
                    switchToTab(0)
                    })
        done()
        })

    it('Check quoting', (done) => {
        $$('[data-for*="' + users.valid[1].user1 + '"]').first().click()
        dialog1.quoteLast()
        dialog1.send(ID_quote) //sending quote to chat
        expect(dialog1.chatContent().then((arr) => arr.some(str=>str.includes(ID_quote)))).toBe(true, "Quote was not sent") //check message in chat window
        done()
    })

    it('Check random Smile', (done) => {
        $(chat.ctrl[0].smiles).click() //open smile popup
        $(`` + chat.ctrl[0].all_smiles + `:nth-child(${Math.floor(Math.random() * 110)})`).click() //choosing random smile
        dialog1.just_input(' '+ID_randomSmile) //adding uniq id to random smile
        $(chat.ctrl[0].editor).sendKeys(protractor.Key.ENTER)
        BD1.wait(()=> {return dialog1.chatContent().then((arr) => arr.some(str=>str.includes(ID_randomSmile)))}, waitTime, 'message was not sent not loaded') 
        //BD1.wait(EC.presenceOf($(chat.ctrl[0].smile_in_message)), waitTime, "smile is not displayed")      
        expect(dialog1.chatContent().then((arr) => arr.some(str=>str.includes(ID_randomSmile)))).toBe(true, "Smile ID is not displayed")
        expect($(chat.ctrl[0].smile_in_message).isDisplayed()).toBe(true, "Smile is not displayed")
        done()
        })
        
    // it('All Smiles', () => {
    //     $$(chat.ctrl[0].message).last().click()
    //     $$(chat.ctrl[0].all_smiles).map((smile)=> {
    //         BD1.$(chat.ctrl[0].smiles).click()
    //         smile.click()
    //         }) //inserting all smiles to chat editor
    //     dialog1.send(' '+ID_allSmiles) //send smiles with uniq id
    //     BD1.sleep(1000)
    //     expect(dialog1.chatContent().then((arr) => arr.some(str=>str.includes(ID_allSmiles)))).toBeTruthy()
    //     })

    uploads.files.map(item => {
        
        it(item.description, (done) => {
            fileUpload(item)
            done()
        })
    })

    it('Check message status icon for offline user', (done) => {
        dialog1.send(messages.status[0].offline)
        expect($(chat.ctrl[0].message_status_icon).isPresent()).toBe(true, "status message icon was not displayed") //check status icon in chat window
        done()
    })

    it('Check mentions', (done) => {
        dialog1.just_input(messages.mention[0].symbol)
        BD1.wait(EC.presenceOf($(chat.ctrl[0].mentions_list)), waitTime, 'site not loaded')
        expect($$(chat.ctrl[0].mentions_list).count()).toEqual(10, "Quantity of the mentions is wrong")
        $$(chat.ctrl[0].mentions_list).first().click()
        expect($(chat.ctrl[0].mention_input).isPresent()).toBe(true, "Mention is not inserted to editor")
        done()
     })

    it('Check max 5 rows before scroll appears', (done) => {

        expect($(chat.ctrl[0].editor_form).getCssValue('overflow-y')).toEqual("auto") //verify css value for scroll
        
        dialog1.just_input_five_rows(ID_row+messages.string[1].value)
        expect(getHeight($(chat.ctrl[0].editor_form))).toEqual(getHeight($(chat.ctrl[0].editor_content)), "Height is not the same")

        $(chat.ctrl[0].editor).sendKeys(protractor.Key.SHIFT, protractor.Key.ENTER)
        dialog1.just_input(ID_row)
        expect(getHeight($(chat.ctrl[0].editor_form))).toBeLessThan(getHeight($(chat.ctrl[0].editor_content)), "Height is the same or greater")

        $(chat.ctrl[0].editor).sendKeys(protractor.Key.ENTER)

        $$(chat.ctrl[0].message).last().getText().then((result) => {
            result = result.split('\n')
            expect(result.length).toEqual(6, "Rows count is not equal 6")
        })
        
        done()
    })

})


