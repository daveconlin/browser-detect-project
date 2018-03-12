const { detect, parseUserAgent } = require("detect-browser");
const browser = detect();
const parse = parseUserAgent();
const agents = require("browser-agents");
// console.log(agents.Chrome.random());
// console.log(agents.Opera.random());
// agents.Safari.random();
// agents.Firefox.random();// agents.IE.random();
// console.log(agents.Chrome);

var yourobject = agents.Chrome;
var result = [];
for (var key in yourobject) {
  result.push(yourobject[key]);
}

result.forEach(function(agent) {
  var parsed = parse(agent);
  console.log("parsed:", parsed);
});

// browser();
function updateUI() {
  var root = document.getElementById("root");
  root.innerHTML =
    "<p>" +
    JSON.stringify(browser) +
    "</p>" +
    "<p> Status = " +
    status +
    "</p>";
}

function isBrowserValid(agent) {
  navigator.userAgent = agent;
  var check = window.browser();
  console.log("check;", check);
  // handle the case where we don't detect the browser
  if (check) {
    console.log(check.name);
    console.log(check.version);

    if (
      (check.name === "chrome" && parseInt(check.version) >= 30) ||
      (check.name === "firefox" && parseInt(check.version) >= 27) ||
      (check.name === "edge" && parseInt(check.version) >= 11) ||
      (check.name === "ie" && parseInt(check.version) >= 11) ||
      (check.name === "safari" && parseInt(check.version) >= 7) ||
      (check.name === "safari mobile" && parseInt(check.version) >= 5)
    ) {
      return true;
    } else {
      return false;
    }
  }
}
