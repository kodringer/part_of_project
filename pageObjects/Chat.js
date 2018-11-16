let BDwindow = require('./BDwindow.js').BDwindow
let chat_css = require('../testdata/css/chrome/chat.json')
let muc_css = require('../testdata/css/chrome/groupchat.json')

class Chat extends BDwindow {

    constructor (browser) {

        super(browser)

       this.chatform = this._browser.$(chat_css.ctrl[0].editor)
       this.history = this._browser.$$(chat_css.ctrl[0].content)
       this.service_messages = this._browser.$$(chat_css.ctrl[0].service_message)
       this.muc_users_list = this._browser.$(muc_css.ctrl[0].edit_participants_list)
       this.edit_users_list = this._browser.$(muc_css.ctrl[0].edit_users_list_button)
       this.search_users = this._browser.$(muc_css.ctrl[0].search_users_input)
       this.save_users = this._browser.$(muc_css.ctrl[0].save_users)
       this.cancel_save_users = this._browser.$(muc_css.ctrl[0].cancel_save_users)
       this.chat_topic = this._browser.$(muc_css.ctrl[0].chat_topic)
       this.chat_topic_input = this._browser.$(muc_css.ctrl[0].chat_topic_input)
       this.topic_editable = this._browser.$(muc_css.ctrl[0].topic_editable)
       this.topic_not_editable = this._browser.$(muc_css.ctrl[0].topic_not_editable)
       this.leave_chat = this._browser.$(muc_css.ctrl[0].leave_chat)
       this.participants_list = this._browser.$(muc_css.ctrl[0].view_participants_list)
       this.chat_header = this._browser.$(muc_css.ctrl[0].chat_header)
       this.close_muc_users_list = this._browser.$(muc_css.ctrl[0].closeChatInfo)
       this.recent = this._browser.$(muc_css.ctrl[0].recent_item)

    }  
    
    send (text) {
        
        this._browser.wait(EC.visibilityOf(this.chatform), waitTime, 'Chatform is not exists')
        this.chatform.sendKeys(protractor.Key.CONTROL, 'a')
        this.chatform.sendKeys(protractor.Key.DELETE)      
        this.chatform.sendKeys(text)
        this.chatform.sendKeys(protractor.Key.ENTER)
        
    }

    just_input (text) {
        
        this._browser.wait(EC.visibilityOf(this.chatform), waitTime, 'Chatform is not exists')
        this.chatform.sendKeys(text)
    }

    just_input_five_rows (text) {
        
        this._browser.wait(EC.visibilityOf(this.chatform), waitTime, 'Chatform is not exists')
        this.chatform.sendKeys(protractor.Key.CONTROL, 'a')
        this.chatform.sendKeys(protractor.Key.DELETE)
        this.chatform.sendKeys(text)
        this.chatform.sendKeys(protractor.Key.SHIFT, protractor.Key.ENTER)
        this.chatform.sendKeys(text)
        this.chatform.sendKeys(protractor.Key.SHIFT, protractor.Key.ENTER)
        this.chatform.sendKeys(text)
        this.chatform.sendKeys(protractor.Key.SHIFT, protractor.Key.ENTER)
        this.chatform.sendKeys(text)
        this.chatform.sendKeys(protractor.Key.SHIFT, protractor.Key.ENTER)
        this.chatform.sendKeys(text)
    
    }

    chatContent () {

        return this.history.getText()
    }

    quoteLast () {

        this._browser.actions().mouseMove($$(chat_css.ctrl[0].three_dots_message).last()).perform()
        this._browser.sleep(500)
        this._browser.$$(chat_css.ctrl[0].three_dots_message).last().click()
        this._browser.wait(EC.visibilityOf($(chat_css.ctrl[0].three_dots_message_menu)), waitTime, '3 dots menu is not displayed')
        this._browser.$(chat_css.ctrl[0].quote).click() //click to quote-link
    } 

// for group chat block    
    changeTopic (text) {
        this._browser.wait(EC.presenceOf(this.topic_not_editable), waitTime, 'Chat topic is not exist')
        this.chat_topic.click()
        this._browser.wait(EC.presenceOf(this.topic_editable), waitTime, 'Chat topic is not editable')
        this.chat_topic_input.clear().then(()=>{
            this.chat_topic_input.sendKeys(text)
            })
        this.chat_topic_input.sendKeys(protractor.Key.ENTER)
        this.chat_header.click()
        this._browser.wait(EC.presenceOf(this.topic_not_editable), waitTime, 'Chat topic is editable')
    }
    
    getTopic () {

        return this.chat_topic.getText()
    }

    addParticipant (user) {

        this.first_user_item = this._browser.$$(muc_css.ctrl[0].user_item).first()
        this.first_user_item_add = this._browser.$(muc_css.ctrl[0].user_item_add)

        this.muc_users_list.click()
        this._browser.wait(EC.visibilityOf(this.participants_list), waitTime, 'User list is not opened')
        this._browser.wait(EC.visibilityOf(this.edit_users_list), waitTime, 'Edit button is not visible')
        this.edit_users_list.click()
        this._browser.wait(EC.visibilityOf(this.search_users), waitTime, 'Search string is not visible')
        this.search_users.sendKeys(user)
        this._browser.actions().mouseMove(this.first_user_item).perform()
        this._browser.wait(EC.visibilityOf(this.first_user_item_add), waitTime, 'Add button is not visible')
        this.first_user_item_add.click()
        this.save_users.click()

    }

    checkParticipant (user) {

        this.participant = this._browser.$('[class*=chosenUser] [data-for*="' + user + '"]')

        this.recent.click()
        this.muc_users_list.click()
        return this._browser.wait(EC.presenceOf(this.participant), waitTime, 'user is absent in list')
        
    }

    removeParticipant (user) {

        this.participant = this._browser.$('[class*=chosenUser] [data-for*="' + user + '"]')
        this.remove_user = this._browser.$('[class*=chosenUser] [data-for*="' + user + '"]+[class*=vbox]+[class] '+ muc_css.ctrl[0].remove_icon +'')
        
        this.recent.click()
        this.muc_users_list.click()
        this._browser.wait(EC.visibilityOf(this.participants_list), waitTime, 'User list is not opened')
        this.edit_users_list.click()
        this._browser.wait(EC.visibilityOf(this.search_users), waitTime, 'Search string is not visible')
        this._browser.actions().mouseMove(this.participant).perform()
        this._browser.wait(EC.visibilityOf(this.remove_user), waitTime, 'Remove button is not visible')
        this.remove_user.click()
        this.save_users.click()

    }

    serviceMessages () {

        return this.service_messages.getText()
    }
    
}
module.exports.Chat = Chat