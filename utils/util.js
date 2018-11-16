let toolbar = require('../testdata/css/chrome/toolbar.json')
let home = require('../testdata/css/chrome/home.json')
let add_contacts = require('../testdata/css/chrome/add_contacts.json')
let brief_profile = require('../testdata/brief_profile.json')
let profile_brief = require('../testdata/css/chrome/profile_brief.json')
let chat = require('../testdata/css/chrome/chat.json')
let prepare = require('../testdata/prepare.json')
let history = require('../testdata/css/chrome/history.json')
let remote = require('selenium-webdriver/remote')
let path = require('path')
let uploads = require('../testdata/uploads.json')
let searchbar = require('../testdata/css/chrome/searchbar.json')


function openPopupMenu (item) {
    //workaround to close pop-up if it was opened
    $(searchbar.ctrl[0].field).click()

     return BD1.wait(EC.elementToBeClickable($(item.dclass)), waitTime).then(() => {
        $(item.dclass).click()
    })
}

function delay (ms) {
   ms += new Date().getTime();
   while (new Date() < ms){}
}


function uniq_id (length) {
var string = '';
var letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz1234567890' //Include numbers if you want
        for (i = 0; i < length; i++) {
            string += letters.charAt(Math.floor(Math.random() * letters.length));
        }
        return string;
    }

function uniq_username (length) {
var string = '';
var letters = 'abcdefghijklmnopqrstuvwxyz' //
        for (i = 0; i < length; i++) {
            string += letters.charAt(Math.floor(Math.random() * letters.length));
        }
        return string;
    }

function OpenUserMenu () {

    BD1.actions().mouseMove($(prepare.ctrl[0].contact_name)).perform()
    $(prepare.ctrl[0].contact_name).click()
    BD1.wait(EC.visibilityOf($(prepare.ctrl[0].start_chat)), 15000)
    }

function quoteLastMessage () {

    BD1.actions().mouseMove($$(chat.ctrl[0].three_dots_message).last()).perform()
    BD1.sleep(500)
    BD1.$$(chat.ctrl[0].three_dots_message).last().click()
    BD1.wait(EC.visibilityOf($(chat.ctrl[0].three_dots_message_menu)), waitTime, '3 dots menu is not displayed')
    BD1.$(chat.ctrl[0].quote).click() //click to quote-link
    
}

//-------------------- Additional functions ---------------------

//open Search and add new contacts from Home
function openAddContactsHome() {
    openHome()
    return openAddContacts()
}

//open Home
function openHome() {
    $(toolbar.controls[1].dclass).click()
    return BD1.wait(EC.visibilityOf($(home.ctrl[0].dclass)), 20000, 'NO Chat Now!')
}

//open Search and add new contacts
function openAddContacts() {
    $(home.ctrl[0].dclass).click()
    return BD1.wait(EC.visibilityOf($(add_contacts.ctrl[0].search)), 20000, 'NO Search and add new contacts')
}

//search contact
function searchContacts(clear, item, value) {
    $(clear).click()
    $(item).sendKeys(value)
}

//close Search and add new contacts
function closeAddContacts() {
    $(add_contacts.ctrl[0].close).click()
}

//open Brief profile
function openBriefProfile() {
//    BD1.sleep(5000)
    BD1.wait(EC.presenceOf($(profile_brief.ctrl_addContacts[0].avatar)), waitTime, 'No avatar')
    BD1.actions().mouseMove($$(profile_brief.ctrl_addContacts[0].avatar).first()).perform()
    return BD1.wait(EC.visibilityOf($(profile_brief.ctrl_addContacts[0].opened)), waitTime, 'Brief Profile not shows')
    //BD1.sleep(500)
}

function openNewTab () {
    return BD1.executeScript('window.open()')
}

function switchToTab (tab_number) {
    BD1.getAllWindowHandles().then((handles) => {
    BD1.switchTo().window(handles[tab_number])
    }) 
}

//show Widget
function showWidget(item, opened) {
    BD1.wait(EC.visibilityOf($(item)), waitTime, 'no user-item').then(() => {
        BD1.actions().mouseMove($(item)).perform()
    })
    return BD1.wait(EC.visibilityOf($(opened)), waitTime, 'Widget does not get displayed')
}

//check showing Toast pop-up
function isToast() {
    return BD1.wait(EC.visibilityOf($(brief_profile.ctrl[0].toast)), 2500, 'Toast pop-up does not appear').then(() => {
//        expect($(brief_profile.ctrl[0].toast)).toBe(true, 'Toast pop-up does not get opened')
    }).catch((e) => {fail('NO Toast pop-up!')})
}

//close Toast pop-up
function closeToast() {
    return BD1.wait(EC.visibilityOf($(brief_profile.ctrl[0].toast_close)), 2500, 'NO Close Toast pop-up Button!').then(() => {
        $$(brief_profile.ctrl[0].toast_close).each(() => {
            $(brief_profile.ctrl[0].toast_close).click()
        })
    })
}

//open Three Dots Menu
function openThreeDotsMenu(item) {
    $(item).click()
}

//open History
function openHistory() {
    $(history.ctrl[0].open).click()
}

function fileUpload(item) {

    BD1.setFileDetector(new remote.FileDetector())
    let absolutePath = path.join(__dirname, `` + item.value + ``)
    let fileElem = BD1.$(uploads.ctrl[0].input)
    let noProgressBar = EC.invisibilityOf(BD1.$$('[class*=progressbar]').last())
    let noError = EC.invisibilityOf(BD1.$('[class*=left] [class*=errorText]'))
    BD1.executeScript(uploads.ctrl[0].visible, fileElem.getWebElement())
    fileElem.sendKeys(absolutePath)
    BD1.wait(EC.and(noProgressBar, noError), waitTime, 'file is not uploaded')

}

function textInput(item, text) {
    item.clear()
    .then(() => {
        for (let i=0; i < text.length; i += maxInputKeys) {
        const part = text.substring(i, i + maxInputKeys)
        item.sendKeys(part)
        }
    })
}

function getHeight(item) {
    return item.getSize().then((result) => {return result.height})
}

module.exports.openAddContactsHome = openAddContactsHome;
module.exports.openBriefProfile = openBriefProfile;
module.exports.showWidget = showWidget;
module.exports.isToast = isToast;
module.exports.closeToast = closeToast;
module.exports.openThreeDotsMenu = openThreeDotsMenu;
module.exports.openHistory = openHistory;
module.exports.searchContacts = searchContacts;

module.exports.openPopupMenu = openPopupMenu;
module.exports.delay = delay;
module.exports.uniq_id = uniq_id;
module.exports.uniq_username = uniq_username;
module.exports.mysqlRestore = mysqlRestore;
module.exports.OpenUserMenu = OpenUserMenu;
module.exports.quoteLastMessage = quoteLastMessage;
module.exports.openNewTab = openNewTab;
module.exports.switchToTab = switchToTab;
module.exports.fileUpload = fileUpload;
module.exports.textInput = textInput;
module.exports.getHeight = getHeight;