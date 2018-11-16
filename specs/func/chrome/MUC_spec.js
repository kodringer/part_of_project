let LoginFormNew = require('../../../pageObjects/LoginFormNew.js').LoginFormNew
let ChatWindow = require('../../../pageObjects/Chat.js').Chat
let users = require('../../../testdata/users.json')
let chat = require('../../../testdata/css/chrome/chat.json')
let muc = require('../../../testdata/css/chrome/groupchat.json')
let messages = require('../../../testdata/messages.json')
let uniq_id = require('../../../utils/util.js').uniq_id
let openNewTab = require('../../../utils/util.js').openNewTab
let switchToTab = require('../../../utils/util.js').switchToTab
let contacts = require('../../../testdata/css/chrome/contacts.json')

describe('CXXX MUC FUNC TEST', () =>{

    let bd1loginForm = new LoginFormNew(BD1)
    let dialog1 = new ChatWindow(BD1)
    let ID_sent = uniq_id(6)
    let ID_answer = uniq_id(5)
    let ID_topic = uniq_id(2)


    beforeAll(() => {
        BD1.get('')
        expect(EC.visibilityOf($(".maxine-logo"))).toBeTruthy()
        bd1loginForm.login(users.valid[0])
        BD1.wait(EC.presenceOf($(users.ctrl[0].loaded)), waitTime, 'site not loaded') 
        //choosed logo as event that "site loaded". 
    })

     it('Create MUC', () => {

        $('[data-for*="' + users.valid[1].user1 + '"]').click()
        dialog1.send(ID_sent+messages.string[3].value) // send message
        expect($$(chat.ctrl[0].content).last().getText()).toEqual(ID_sent+messages.string[3].value) //check sent message in chat window
        expect($(contacts.ctrl[0].recentMessage).getText()).toStartWith(ID_sent) //check message in recent tab

        if (EC.invisibilityOf($(chat.ctrl[0].muc))) { $(chat.ctrl[0].add_contact).click() }
        BD1.wait(EC.presenceOf($(chat.ctrl[0].create_muc)), waitTime, 'Add contact not opened')
        BD1.actions().mouseMove($(chat.ctrl[0].create_muc)).perform()
        $(chat.ctrl[0].create_muc).click()
        BD1.wait(EC.presenceOf($("[class*=hasFocus]")), waitTime, 'chat editor is not active')

        })

    it('Change topic', ()=> {

        dialog1.changeTopic(ID_topic+messages.string[4].value)
        expect(dialog1.getTopic()).toEqual(ID_topic+messages.string[4].value)

    })

    it('Add user', ()=> {

        dialog1.addParticipant(users.muc[0].ncoreid)
        expect(dialog1.checkParticipant(users.muc[0].ncoreid)).toBe(true, "user was not added")
        expect($$(muc.ctrl[0].users).count()).toEqual(2, 'Count of users after adding is not valid')

    })

    it('Login in other tab and check that participant', () => {

        openNewTab().then(switchToTab(1))
            .then(() => { //the focus moves on new tab
                BD1.get('')
                bd1loginForm.login(users.valid[1]) //login other user
                BD1.wait(EC.presenceOf($(users.ctrl[0].loaded)), waitTime, 'site not loaded')
                BD1.wait(EC.presenceOf($('[title*="' + ID_topic+messages.string[4].value + '"]')), waitTime, 'Chat was not found') 
                $('[title*="' + ID_topic+messages.string[4].value + '"]').click()
                dialog1.send(ID_answer+messages.string[1].value) // send message
                $(muc.ctrl[0].edit_participants_list).click()
                BD1.wait(EC.presenceOf($('[class*=chosenUser] [data-for]')))
                expect($$(muc.ctrl[0].users).count()).toEqual(2, 'Count of users is not valid')
                }).then(() => {
                    switchToTab(0)
                    })
        })

    it('Remove user', ()=> {

        dialog1.removeParticipant(users.muc[0].ncoreid)
        $(muc.ctrl[0].edit_participants_list).click()
        expect($$(muc.ctrl[0].users).count()).toEqual(1, 'Count of users after remove is not valid')
        
    })

    it('Leave chat', ()=> {

        $(muc.ctrl[0].leave_chat).click()
        BD1.wait(EC.presenceOf($(muc.ctrl[0].edit_participants_list_disabled)), waitTime, 'Participant list was not disabled')
        expect(EC.presenceOf($(muc.ctrl[0].edit_participants_list_disabled))).toBeTruthy('Participant list was not disabled')
        expect(EC.presenceOf($(muc.ctrl[0].after_leave_icon))).toBeTruthy('Leave button was not disabled')
        expect(EC.invisibilityOf($(chat.ctrl[0].editor))).toBeTruthy('Chat editor was not disabled')
        BD1.wait(()=> {return dialog1.serviceMessages().then((arr) => arr.some(str=>str.includes(muc.ctrl[0].service_message_removed)))}, waitTime, 'message was not sent') 
        expect($$(chat.ctrl[0].service_message).last().getText()).toEqual(muc.ctrl[0].service_message_removed) //check service message in chat window

        switchToTab(1)
        $(muc.ctrl[0].recent_item).click()
        $(muc.ctrl[0].edit_participants_list).click()
        expect($$(muc.ctrl[0].users).count()).toEqual(0, 'Users list is not empty').then(BD1.close()).then(() => {
            switchToTab(0)
            })
    })

})