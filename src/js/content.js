// Unfortunately, chrome.webRequest.onBeforeRequest doesn't work immediately when chrome is opened, but content scripts always work;
// So message the background page until it responds with a redirect url

// Interval had to be added because in testing background page might not respond the first time
let pingInterval = setInterval(getRedirectUrl, 300);
getRedirectUrl();

function getRedirectUrl(){
    chrome.runtime.sendMessage({method: 'redirect', url: window.location.href}, url => {
        clearInterval(pingInterval);
        if(url)
            document.location.replace(url); // Redirect without adding bing to history
    });
}
