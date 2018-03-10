const { detect } = require('detect-browser');
const browser = detect();


var agents = require('browser-agents');
console.log(agents.Chrome.random());
console.log(agents.Opera.random());
agents.Safari.random();
agents.Firefox.random();
agents.IE.random();



// handle the case where we don't detect the browser
if (browser) {
    console.log(browser.name);
    console.log(browser.version);

    //        var result = browser();
       var status = "<span style='color:red'>Fail</span>";

       if( (browser.name==='chrome' && parseInt(browser.version)>=30) ||
           (browser.name==='firefox' && parseInt(browser.version)>=27) ||
           (browser.name==='edge' && parseInt(browser.version)>=11) ||
           (browser.name==='ie' && parseInt(browser.version)>=11) ||
           (browser.name==='safari' && parseInt(browser.version)>=7) ||
           (browser.name==='safari mobile'  && parseInt(browser.version)>=5)
       ){
           status = "<span style='color:green'>Pass</span>";

       }

       var root = document.getElementById('root');
       root.innerHTML = '<p>' + JSON.stringify(browser) + '</p>' + '<p> Status = ' + status + '</p>';

}


