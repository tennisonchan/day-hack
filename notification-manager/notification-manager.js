var Util = require('./util.js');
var PageManager = require('./page-manager.js');

var REPORT_URL_ROOT = 'https://docs.google.com/a/google.com/forms/d/17BEfb-JLsiJbsZRjnMmTdaH3EtMj8OpxADR0DayWS9s/viewform?';
var NOTIFICATION_IMAGE_SIZE = 256;

var pageManager = new PageManager();


/**
 * Implements Shout Out notifications for every possible case we care about.
 */
function NotificationManager() {
  // Map of notificationId : callback for handling clicks on the
  // notification itself.
  this.notificationCallbacks_ = {};

  // Handle clicking the notification itself.
  chrome.notifications.onClicked.addListener(
      this.onNotificationClicked_.bind(this));

  // Handle clicking the notification buttons.
  chrome.notifications.onButtonClicked.addListener(
      this.onNotificationButtonClicked_.bind(this));
}

NotificationManager.prototype.onSendFailAudio = function() {
  var options = {
    type: 'basic',
    iconUrl: chrome.extension.getURL('images/notifications/notif_alert_256.png'),
    title: chrome.i18n.getMessage('notification_send_fail_audio_title'),
    message: chrome.i18n.getMessage('notification_send_fail_audio_message')
  };
  chrome.notifications.create('', options, function(notificationId) {
    this.registerClickCallback_(notificationId, function() {
      pageManager.openPage('error_audio');
    });
  }.bind(this));
};


NotificationManager.prototype.onSendFailNetwork = function() {
  var options = {
    type: 'basic',
    iconUrl: chrome.extension.getURL('images/notifications/notif_offline_256.png'),
    title: chrome.i18n.getMessage('notification_send_fail_network_title'),
    message: chrome.i18n.getMessage('notification_send_fail_network_message')
  };
  chrome.notifications.create('', options, function(notificationId) {
    this.registerClickCallback_(notificationId, function() {
      pageManager.openPage('error_network');
    });
  }.bind(this));
};

NotificationManager.prototype.onReceive =
    function(url, title, message, opt_iconUrl) {
  var iconUrl;
  if (!opt_iconUrl) {
    iconUrl = chrome.extension.getURL('images/notifications/notif_anon_256.png');
  } else {
    iconUrl = this.setImageSize_(opt_iconUrl, NOTIFICATION_IMAGE_SIZE);
  }
  var options = {
    type: 'basic',
    iconUrl: iconUrl,
    title: title,
    message: message,
    priority: 2
  };
  chrome.notifications.create('', options, function(notificationId) {
    this.registerClickCallback_(notificationId, function() {
      Util.openOrFocusUrl(url);
    }.bind(this));
  }.bind(this));
};


/** PRIVATE **/

NotificationManager.prototype.registerClickCallback_ =
    function(notificationId, callback) {
  this.notificationCallbacks_[notificationId] = callback;
};


NotificationManager.prototype.reportProblem_ = function(opt_filename) {
  var params = {
    'entry.1909320881': 'navigator.userAgent',
  };
  if (opt_filename) {
    params['entry.1608031336'] = opt_filename;
  }
  var serializedParams = '';
  for (param in params) {
    serializedParams += (param + '=' + params[param] + '&');
  }
  var url = REPORT_URL_ROOT + serializedParams;
  chrome.tabs.create({url: url});
};


NotificationManager.prototype.clearNotificationDelay_ =
    function(notificationId, delay) {
  setTimeout(function() {
    chrome.notifications.clear(notificationId, function(wasCleared) {
      Util.log('Cleared notification.');
    });
  }, delay);
}


/**
 * Sets a size on the icon URL. Removes any parameters from the end of the
 * URL, and adds a size= parameter with the specified size.
 */
NotificationManager.prototype.setImageSize_ = function(iconUrl, size) {
  // Strip off the extra params if needed.
  var baseUrl = iconUrl;
  var qIndex = iconUrl.indexOf('?');
  if (qIndex != -1) {
    baseUrl = iconUrl.substring(0, qIndex);
  }

  // Some image URLs have sizing specified in another way, for example:
  // http://lh6.googleusercontent.com/.../s20/p.png. In this case, strip the
  // extra sNN business.
  var ALT_SIZE_REGEX = '/s[0-9]+/'
  var match = baseUrl.match(ALT_SIZE_REGEX)
  if (match && match.length == 1) {
    var onlyMatch = match[0];
    baseUrl = baseUrl.replace(onlyMatch, '/');
  }
  return baseUrl + '?size=' + size;
};


NotificationManager.prototype.onNotificationClicked_ =
    function(notificationId) {
  Util.log('Notification clicked', notificationId);
  var callback = this.notificationCallbacks_[notificationId];
  if (callback) {
    callback();
  }

  chrome.notifications.clear(notificationId, function(wasCleared) {
    Util.log('Notification wasCleared:', wasCleared);
  });
};


NotificationManager.prototype.onNotificationButtonClicked_ =
    function(notificationId, buttonIndex) {
  if (buttonIndex == 0) { // Yes.
    // Do nothing for now.
  } else if (buttonIndex == 1) { // No.
    this.reportProblem_();
  }
}


module.exports = NotificationManager;
