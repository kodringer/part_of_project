class BDwindow {

    constructor (browserFromParam = BD1) {

            this._browser = browserFromParam
            this.$ = this._browser.$
            this.$$ = this._browser.$$
            this.element = this._browser.element
    }  

}

module.exports.BDwindow = BDwindow