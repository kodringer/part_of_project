let CSScheck = require('../../../utils/CSScheck.js')
let signup = require('../../../testdata/css/chrome/signup.json')
let extraMatchers = require('jasmine-expect') //matcher for range
let uniq_username = require('../../../utils/util.js').uniq_username


describe('Signup Page Error Func TEST', () =>{

    let login = uniq_username(7)

        beforeAll(() =>{
        jasmine.addMatchers(extraMatchers)
        BD1.get('http://ncore2:8282/signup')
        $(signup.ctrl[0].submit).click()
        });

        signup.error.map(data => {
            it(data.description, () => {
            CSScheck(data, $(data.dclass)) 
            })
        })

        it('Signup Page Error - Fill out warning', () => {
            expect($(signup.warnings[0].dclass).getText()).toEqual(signup.warnings[0].value, `Expected text to be ${signup.warnings[0].value} `)
            BD1.wait(EC.elementToBeClickable($(".bottom a")), 5000, '"Sign in" is not clickable')
        })

        it('Signup Page Error - All fields are mandatory', () => {
           expect($$(signup.error[0].dclass).count()).toEqual(7, '7 fields has to be mandatory')
        })

        it('Signup Page Error - Phone warning', () => {
            $(signup.ctrl[0].phone).sendKeys('a')
            $(signup.ctrl[0].phone).sendKeys(protractor.Key.TAB)
            expect($(signup.warnings[1].dclass).getText()).toEqual(signup.warnings[1].value, `Expected text to be ${signup.warnings[1].value} `).then($(signup.ctrl[0].phone).clear())
         })

         it('Signup Page Error - Error border disappears after input', () => {
            $(signup.ctrl[0].name).sendKeys('a')
            $(signup.ctrl[0].name).sendKeys(protractor.Key.TAB)
            expect($(signup.ctrl[0].name).getCssValue('border')).toEqual(signup.form[1].border, `Expected border to be ${signup.form[1].border} `).then($(signup.ctrl[0].name).clear())
         })

         it('Signup Page Error - Too short username message', () => {
            $(signup.ctrl[0].username).sendKeys(signup.warnings[3].short)
            $(signup.ctrl[0].username).sendKeys(protractor.Key.TAB)
            expect($(signup.warnings[3].dclass).getText()).toEqual(signup.warnings[3].value, `Expected text to be ${signup.warnings[3].value} `).then($(signup.ctrl[0].username).clear())
         })

         it('Signup Page Error - Too long username message', () => {
            $(signup.ctrl[0].username).sendKeys(signup.warnings[4].long)
            $(signup.ctrl[0].username).sendKeys(protractor.Key.TAB)
            expect($(signup.warnings[4].dclass).getText()).toEqual(signup.warnings[4].value, `Expected text to be ${signup.warnings[4].value} `).then($(signup.ctrl[0].username).clear())
         })

         it('Signup Page Error - Mail warning', () => {
            
            $(signup.ctrl[0].name).sendKeys('a')
            $(signup.ctrl[0].last_name).sendKeys('b')
            $(signup.ctrl[0].company).sendKeys('c')
            $(signup.ctrl[0].title).sendKeys('title')
            $(signup.ctrl[0].email).sendKeys('a')
            $(signup.ctrl[0].phone).sendKeys('1234567890')
            $(signup.ctrl[0].username).sendKeys(login)
            $(signup.ctrl[0].submit).click()
            BD1.wait(EC.textToBePresentInElement($(signup.warnings[2].dclass), signup.warnings[2].value), 5000)
            expect($(signup.warnings[2].dclass).getText()).toEqual(signup.warnings[2].value, `Expected text to be ${signup.warnings[2].value} `)
         })
}) 