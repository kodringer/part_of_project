let LoginFormNew = require('../../../../pageObjects/LoginFormNew.js').LoginFormNew
let ChatWindow = require('../../../../pageObjects/Chat.js').Chat
let users = require('../../../../testdata/users.json')
let chat = require('../../../../testdata/css/chrome/chat.json')
let addContact = require('../../../../testdata/css/chrome/add_contacts.json')
let extraMatchers = require('jasmine-expect') //matcher for range
let messages = require('../../../../testdata/messages.json')
let uniq_id = require('../../../../utils/util.js').uniq_id
let OpenUserMenu = require('../../../../utils/util.js').OpenUserMenu
let openNewTab = require('../../../../utils/util.js').openNewTab
let switchToTab = require('../../../../utils/util.js').switchToTab
let contacts = require('../../../../testdata/css/chrome/contacts.json')
let presence = require('../../../../testdata/menu/presence.json')
let prepare = require('../../../../testdata/prepare.json')
let request = require('request');


describe('Data prepare', () =>{

    let bd1loginForm = new LoginFormNew(BD1)
    let dialog1 = new ChatWindow(BD1)
    let ID_sent = uniq_id(6)
    let ID_answer = uniq_id(5)
    let ID_message = uniq_id(4)

    beforeAll(() => {
        //mysql_restore()
        jasmine.addMatchers(extraMatchers);
        BD1.get('')
        expect(EC.visibilityOf($(".maxine-logo"))).toBeTruthy()
        bd1loginForm.login(users.valid[0])
        BD1.wait(EC.presenceOf($(users.ctrl[0].loaded)), waitTime, 'site not loaded') 
        //choosed logo as event that "site loaded". 
    })

    it("Calls module is not in Dashboard", (done) => {
    
        request("http://ncore2:8282/chunks.json", {
            json: true,
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/70.0.3538.77 Safari/537.36'
            }
        }, (err, res, body) => {
            if (err) { return console.log(err) }
            const {chunks} = body
            const getChunkModules = (name) => chunks.find(chunk => chunk.name == name)['includes']
            const callModules = getChunkModules('calls')
            const dashboardModules = getChunkModules('dashboard')
            const jitsi = callModules.find(item => item.endsWith('lib-jitsi-meet/dist/index.js'))
            expect(callModules.includes(jitsi)).toBe(true, "jitsi is absent in callModules")
            expect(dashboardModules.includes(jitsi)).toBe(false, "jitsi is present in dashboardModules")
            done()
        })
    })

     it('Add contact if not in list and start chat', () => {

        $(prepare.ctrl[0].add_contact).click() 
        $(addContact.ctrl[0].search).sendKeys(users.valid[1].user1) //search contact
        BD1.wait(EC.presenceOf($(prepare.ctrl[0].contact_name)), waitTime, 'call popup is not loaded')
        OpenUserMenu()
        $(prepare.ctrl[0].delete_contact).isPresent().then(present=> {
            if (present == true) {$(prepare.ctrl[0].start_chat).click()} 
            else { $(prepare.ctrl[0].add_contact_menu).click()
 //               OpenUserMenu()
                $(prepare.ctrl[0].start_chat).click() }
                })
                dialog1.send(ID_message+messages.string[3].value) // send message
        expect(dialog1.chatContent().then((arr) => arr.some(str=>str.includes(ID_message+messages.string[3].value)))).toBeTruthy() //check message in chat window
        expect($(contacts.ctrl[0].recentMessage).getText()).toStartWith(ID_message) //check message in recent tab
        })
    
    it('Audio call popup open', () => {
        $(chat.ctrl[0].call).click() //open call popup
        BD1.wait(EC.presenceOf($(chat.ctrl[0].CallPanel)), waitTime, 'call popup is not loaded')
        $(chat.ctrl[0].close_call).click()
        })

    it('Create MUC and back home', () => {

        if (EC.invisibilityOf($(chat.ctrl[0].muc))) { $(chat.ctrl[0].add_contact).click() }
        BD1.wait(EC.presenceOf($(chat.ctrl[0].create_muc)), waitTime, 'Add contact not opened')
//        BD1.actions().mouseMove($(chat.ctrl[0].create_muc)).perform()
        $(chat.ctrl[0].create_muc).click()
        BD1.wait(EC.presenceOf($("[class*=hasFocus]")), waitTime, 'chat editor is not active')
        dialog1.send(ID_sent+messages.string[0].value) // send message to groupchat
        BD1.wait(()=> {return dialog1.chatContent().then((arr) => arr.some(str=>str.includes(ID_sent+messages.string[0].value)))}, waitTime, 'message was not sent')
        expect(dialog1.chatContent().then((arr) => arr.some(str=>str.includes(ID_sent+messages.string[0].value)))).toBeTruthy()
        expect($(contacts.ctrl[0].recentMessage).getText()).toStartWith(ID_sent) //check message in recent tab
        $(prepare.ctrl[0].home).click()
        })

    it('Login as other user in other tab', () => {

        openNewTab().then(switchToTab(1))
                .then(() => { //the focus moves on new tab
                BD1.get('')
                bd1loginForm.login(users.valid[1]) //login other user
                BD1.wait(EC.presenceOf($(users.ctrl[0].loaded)), waitTime, 'site not loaded') 
                $(`[data-for*=testuser1] [data-id=avatar-presence]`).isPresent()
                    .then(present=> {
                        if (present == true) {$(`[data-for*=testuser1]`).click()} 
                        else { $(prepare.ctrl[0].pending_contacts).click()
                        OpenUserMenu()
                        $(prepare.ctrl[0].accept_contact).click()
                        $(contacts.ctrl[0].recentMessage).click() }
                        })
        dialog1.send(ID_answer+messages.string[1].value) // send message
        expect(dialog1.chatContent().then((arr) => arr.some(str=>str.includes(ID_answer+messages.string[1].value)))).toBeTruthy() //check message in chat window
             })  
    })

    it('set custom presence', ()=>{
            if (EC.invisibilityOf($(presence.ctrl[0].pop_up))) { $(presence.ctrl[0].dclass).click() }
            $(presence.ctrl[0].dclass_custom).sendKeys(presence.ctrl[0].status)
            $(presence.ctrl[0].dclass_custom).sendKeys(protractor.Key.ENTER)
        })
}) 

