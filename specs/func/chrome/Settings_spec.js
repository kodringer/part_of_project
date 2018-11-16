let LoginFormNew = require('../../../pageObjects/LoginFormNew.js').LoginFormNew
let users = require('../../../testdata/users.json')
let settings = require('../../../testdata/menu/settings.json')
let extraMatchers = require('jasmine-expect') //matcher for range
let invitation = settings.privacy[1]
let password_change = settings.password[1]
let av_set = settings.av_block[1]
let bd1loginForm = new LoginFormNew(BD1)


describe('CXXX SETTINGS FUNC TEST ', () =>{
    

    beforeAll(() => {
        jasmine.addMatchers(extraMatchers);

        BD1.get('')
        bd1loginForm.login(users.valid[0])
        BD1.wait(EC.presenceOf($(users.ctrl[0].loaded)), 20000, 'site not loaded')
        
    });


    it('Settings - Privacy block - Change invitation setting', () => {
        
        $(settings.ctrl[0].dclass).click()
        $(settings.ctrl[0].open).click()
        $(invitation.current_view).getText().then(fn0)
        })

    it('Settings - Password block - "Save" is disabled', () => {
        
        $(settings.ctrl[0].home).click()
        $(settings.ctrl[0].dclass).click()
        $(settings.ctrl[0].open).click()
        $(settings.ctrl[0].password).click()
        BD1.wait(EC.visibilityOf($(settings.password[0].ctrl[0].edit)), 20000, 'Edit button is not displayed')
        BD1.actions().mouseMove($(settings.password[0].ctrl[0].edit)).perform()
        $(settings.password[0].ctrl[0].edit).click()
        expect($(password_change.save_disabled).isPresent()).toBe(true, 'Button "Save" is not disabled')

    })

    it('Settings - Password block - Error messages', () => {
        
        //send 6 symbols
        $(password_change.new_field).sendKeys(password_change.input_6symbols)
        expect($(password_change.error_message_new).getText()).toContain(password_change.error_8symbols, 'Should be shown message about 8 symbols')
        resetFields()

        //send lowercase
        $(password_change.new_field).sendKeys(password_change.input_upper)
        expect($(password_change.error_message_new).getText()).toContain(password_change.error_upper, 'Should be shown message about uppercase')
        resetFields()

        //send uppercase
        $(password_change.new_field).sendKeys(password_change.input_lower)
        expect($(password_change.error_message_new).getText()).toContain(password_change.error_lower, 'Should be shown message about lowercase')
        resetFields()

        //send only letters
        $(password_change.new_field).sendKeys(password_change.input_number)
        expect($(password_change.error_message_new).getText()).toContain(password_change.error_number, 'Should be shown message about number')
        resetFields()

        //send different pass
        $(password_change.new_field).sendKeys(password_change.valid_pass)
        $(password_change.repeat_new_field).sendKeys('a')
        expect($(password_change.error_message_repeat).getText()).toContain(password_change.error_same, 'Should be shown message about the same new password for repeat field')
        resetFields()

        $(password_change.current_field).sendKeys('a')
        $(password_change.current_field).sendKeys(protractor.Key.BACK_SPACE)
        expect($(password_change.error_message_current).getText()).toContain(password_change.error_empty, 'Should be shown message about fill out field')
    })   

    it('Settings - AudioVideo block - Possibility to change', () => {
        
        $(settings.ctrl[0].av_set).click()
        BD1.wait(EC.visibilityOf($(settings.av_block[0].ctrl[0].edit)), 20000, 'Edit button is not displayed')
        BD1.actions().mouseMove($(settings.av_block[0].ctrl[0].edit)).perform()
        $(settings.av_block[0].ctrl[0].edit).click()
        BD1.wait(EC.visibilityOf($(av_set.select)), 20000, 'Field for choice is not active')
        expect($(av_set.select).isPresent()).toBe(true, 'Field for choice is not active')
        $(settings.av_block[0].ctrl[0].save).click()
        BD1.wait(EC.visibilityOf($(settings.ctrl[0].toast)), 20000, 'Field for choice is not active')
        expect($(settings.ctrl[0].toast).isPresent()).toBe(true, 'Toast pop-up does not appear')

    })

}) 


//Additional functions
//-------------------- Privacy Invitations block ---------------------

//get list of options and send current option to the next function
function fn0(currentOption) {
    BD1.wait(EC.presenceOf($(settings.privacy[0].ctrl[0].edit)), 20000, 'no edit button')
    BD1.actions().mouseMove($(settings.privacy[0].ctrl[0].edit)).perform()
    $(settings.privacy[0].ctrl[0].edit).click()
    BD1.wait(EC.presenceOf($(invitation.select)), 20000, 'option list is absent')
    BD1.actions().mouseMove($(invitation.select)).perform()
    $(invitation.select).click()
    $(invitation.list).getText().then(fn1.bind(null, currentOption))
}

function fn1(currentOption, selectList) {
    
    selectList = selectList.split('\n') //get array of the options list
    expect(selectList.length).toEqual(2, 'Number of list options is wrong')
    expect(selectList).toContain(invitation.manual_invitation, 'Manual option should me')
    expect(selectList).toContain(invitation.auto_invitation, 'Auto option should me')
    let otherOption = selectList.find((item) => item != currentOption) //choose other option
    BD1.actions().mouseMove($(invitation.select)).perform()
    $('[aria-label="' + otherOption + '"]').click() //click to other option
    BD1.wait(EC.visibilityOf(element(by.cssContainingText(invitation.selected, otherOption))), 20000, 'option is not choosed')
    BD1.actions().mouseMove($(settings.privacy[0].ctrl[0].save)).perform()
    $(settings.privacy[0].ctrl[0].save).click()
    BD1.wait(EC.presenceOf($(settings.ctrl[0].toast)), 20000, 'toast message does not appear')
    expect($(settings.ctrl[0].toast).isPresent()).toBe(true, 'Toast pop-up does not appear')
    $(settings.ctrl[0].home).click()
    
//reload page and login again
    BD1.get('')
    bd1loginForm.login(users.valid[0])
    BD1.wait(EC.presenceOf($(users.ctrl[0].loaded)), 20000, 'site not loaded')

//open settings and verified that option was changed
        $(settings.ctrl[0].dclass).click()
        $(settings.ctrl[0].open).click()
        expect($(invitation.current_view).getText()).toContain(otherOption, 'Option should be saved after reload')
}


//-------------------- Password block ---------------------

function resetFields() {
    $(settings.password[0].ctrl[0].cancel).click()
    $(settings.password[0].ctrl[0].edit).click()
}