$(function () {
    var a = null;
    chrome.storage.local.get("auth", function (b) {
        0 === Object.keys(b).length || "" == b.auth
            ? $(".checklic").click(function () {
                    $.get("http://www.alitracker.com/lic.php", { id: $(".lic").val().trim() }, function (a) {
                        a ? (chrome.storage.local.set({ license: a, auth: !0 }), alert("License installed, please click the ALI Tracker button again to start.")) : alert("License not correct please contact support.");
                    });
              })
            : chrome.tabs.query({ currentWindow: !0, active: !0 }, function (b) {
                  var c = b[0].url;
                  return c.indexOf("alibaba.com") > -1 && ((a = chrome.tabs.connect(b[0].id, { name: "jsPopupChannel" })), a.postMessage({ action: "openCloseJsPopup" })), window.close(), !1;
              });
    });
});
