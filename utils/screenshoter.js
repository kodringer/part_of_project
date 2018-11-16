class ScreenShotOnFailureReporter {
    constructor(configObj) {
        this.config = configObj
    }
    /**
     * @param {String} data The base64-encoded string to write to file
     * @param {String} filename The name of the file to create (do not specify directory)
     */
    _writeScreenShot (data, filename) {
        let screenShotDirectory = this.config.screenShotDirectory
        let fs = require('fs');
        let stream = fs.createWriteStream(screenShotDirectory + filename)
        stream.write(new Buffer(data, 'base64'))
        stream.end()
    }

    /**
     * Executed after each test.
     */
    specDone(result) {
        console.log(result.status)
        if (result.status == 'failed') {
            // Will be executed only if spec is failed
            try {
                browser.takeScreenshot().then(png=> {
                    // Keep eye on file name
                    // you might want to change it - not all symbols can be in file name
                    let filename =  result.fullName + '.png';
                    this._writeScreenShot(png, filename);
                });
            } catch (e) {
                console.log("failed to take a screenshot, error: " + e)
            }
        }
    }
}

module.exports.ScreenShotOnFailureReporter = ScreenShotOnFailureReporter



/**
 * Automatically store a screenshot for each test.
 */

// describe('Taking screenshot', function () {
//     beforeAll(function () {
//         jasmine.getEnv().addReporter(new ScreenShotOnFailureReporter({screenShotDirectory: '../testresults/screenshots/'}));
//     })

//     it('should be taken since test is failed!', function () {
//         browser.get('')
//         expect(false).toBeTruthy('Expected failure. Look at screenshot!')
//     })

//     it('should NOT be taken since test is passed!', function () {
//         browser.get('')
//     })
// })