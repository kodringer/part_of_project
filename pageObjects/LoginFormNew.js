let BDwindow = require('./BDwindow.js').BDwindow
let loginpage = require('../testdata/css/chrome/loginpage.json')

class LoginFormNew extends BDwindow {

    constructor (browser) {

        super(browser)

        this.ncoreid = this._browser.$(loginpage.ctrl[0].ncoreid)
        this.password = this._browser.$(loginpage.ctrl[0].password)
        this.login_button = this._browser.$(loginpage.ctrl[0].login_button)
        this.forgot_pass = this._browser.$(loginpage.ctrl[0].forgot_pass)
        this.loggedin = this._browser.$(loginpage.ctrl[0].loggedin)
        this.nameOkta = this._browser.$(loginpage.ctrl[0].nameOkta)
        this.passOkta = this._browser.$(loginpage.ctrl[0].passOkta)
        this.okta_login_button = this._browser.$(loginpage.ctrl[0].okta_login_button)
   
    }  
    
    login(user) {
       
       this._browser.wait(EC.visibilityOf(this.login_button), waitTime, 'Login button is not exists')
       this.ncoreid.sendKeys(user.ncoreid) //send nCore ID
       this.password.sendKeys(user.password) //send password
       this.login_button.click()

    }

    oktaLogin(user) {
       
       this._browser.wait(EC.visibilityOf(this.okta_login_button), waitTime, 'Login button is not exists')
       this.nameOkta.sendKeys(user.ncoreid) //send nCore ID
       this.passOkta.sendKeys(user.password) //send password
       this.okta_login_button.click()       

    }

    isLoggedIn() {

        this._browser.wait(EC.visibilityOf(this.loggedin), waitTime, 'not logged in')
        return this.loggedin.isDisplayed()
    }

}
module.exports.LoginFormNew = LoginFormNew