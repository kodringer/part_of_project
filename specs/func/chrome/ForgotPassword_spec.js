let CSScheck = require('../../../utils/CSScheck.js')
let forgot = require('../../../testdata/css/chrome/forgot.json')
let extraMatchers = require('jasmine-expect') //matcher for range


describe('Forgot Password Page Error TEST', () =>{

        beforeAll(() =>{
        jasmine.addMatchers(extraMatchers)
        BD1.get('http://ncore2:8282/forgotPassword')
        $(forgot.ctrl[0].submit).click()
        });

        it('Forgot Password Page Error - Fill out warning', () => {
            expect($(forgot.warnings[0].dclass).getText()).toEqual(forgot.warnings[0].value, `Expected text to be ${forgot.warnings[0].value} `)
            BD1.wait(EC.elementToBeClickable($(".bottom a")), 5000, '"Sign in" is not clickable')
        })

        forgot.error.map(data => {
            it(data.description, () => {
            CSScheck(data, $(data.dclass)) 
            })
        })
}) 