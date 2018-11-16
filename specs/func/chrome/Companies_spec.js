let LoginFormNew = require('../../../pageObjects/LoginFormNew.js').LoginFormNew
let bd1loginForm = new LoginFormNew(BD1)
let users = require('../../../testdata/users.json')
let companies = require('../../../testdata/css/chrome/companies.json')
let companies_func = require('../../../testdata/companies_func.json')
let extraMatchers = require('jasmine-expect') //matcher for range


describe('CXXX COMPANIES FUNC TEST', () =>{
    
    beforeAll(() => {
        jasmine.addMatchers(extraMatchers);

        BD1.get('')
        bd1loginForm.login(users.valid[0])
        BD1.wait(EC.presenceOf($(users.ctrl[0].loaded)), waitTime, 'site not loaded')
        //Open COMPANIES Panel
        $(companies.ctrl[0].open).click()
        
    });

    afterAll(() => {
        //Close COMPANIES panel
        $(companies.ctrl[0].close).click()
    });  
    
    //COMPANIES tests 

    it(companies_func.buttons[0].description, (done) => {
        
        $$(companies.ctrl[0].button).each( (button) => {

            button.click()
            BD1.wait(EC.invisibilityOf($(companies.ctrl[0].spinner)), waitTime, "Companies was not loaded")
            button.getText().then(
                button_name => {
                    const quantity = companies_func.buttons.find(button=>button.name == button_name)
                    expect($$(companies.ctrl[0].card).count()).toEqual(quantity.companies)
                })
        })
    done()
    })

    it(companies_func.input[0].description, (done) => {

        $$(companies.ctrl[0].button).first().click()
        BD1.wait(EC.invisibilityOf($(companies.ctrl[0].spinner)), waitTime, "Companies was not loaded")
        $(companies.ctrl[0].filter_input).sendKeys(companies_func.input[0].string)
        BD1.wait(EC.invisibilityOf($(companies.ctrl[0].spinner)), waitTime, "Companies was not loaded")
        expect($$(companies.ctrl[0].company_name).count()).toEqual(companies_func.input[0].quantity)
        expect($(companies.ctrl[0].company_name).getText()).toEqual(companies_func.input[0].company_name)
        done()
    })

    it(companies_func.clear_input[0].description, (done) => {

        $$(companies.ctrl[0].button).first().click()
        BD1.wait(EC.invisibilityOf($(companies.ctrl[0].spinner)), waitTime, "Companies was not loaded")
        $(companies.ctrl[0].filter_input).sendKeys(companies_func.input[0].string)
        BD1.wait(EC.invisibilityOf($(companies.ctrl[0].spinner)), waitTime, "Companies was not loaded")
        expect($$(companies.ctrl[0].company_name).count()).toEqual(companies_func.input[0].quantity)
        $(companies.ctrl[0].clear_search).click()
        expect($$(companies.ctrl[0].company_name).count()).toEqual(companies_func.clear_input[0].quantity)
        done()
    })    
    
}) 