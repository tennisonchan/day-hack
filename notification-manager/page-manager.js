var Util = require('./util.js');
var SUFFIX = '.html';

function PageManager() {
  this.root = 'chrome-extension://{{id}}/pages/'
      .replace('{{id}}', chrome.runtime.id);
}

PageManager.prototype.openPage = function(pageName, replaceCurrent) {
  var url = this.getUrl(pageName);
  if (replaceCurrent) {
    chrome.tabs.update({url: url});
  } else {
    Util.openOrFocusUrl(url);
  }
};

PageManager.prototype.getUrl = function(pageName) {
  return this.root + pageName + SUFFIX;
};

module.exports = PageManager;
