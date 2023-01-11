let data = {
        enabled: true,
        customSearchUrl: '',
        searchEngine: 0,// 0: google, 1: duckduckgo, 2: yahoo, 3: baidu, 4: custom
        cortanaBing: 0,// 0: cortana and bing, 1: cortana, 2: bing
        redirectCount: 0,
        installDate: Date.now()
    };

// Process a bing url and return the url to redirect to
function redirectBingUrl(url){
    // On a successful installation of edgedeflector, show the success page
    if(url == 'https://www.bing.com/#notify-redirect-extension-successful-wedge-install')
        return chrome.extension.getURL('success.html');

    // Only redirect if enabled
    if(data.enabled){
        // Don't redirect non-cortana searches when onlycortana is enabled
        // WNSGPH:           click on search result
        // WNSBOX|WNSSCX:    ask cortana to open website.com
        // WNSFC2:           click "see more results on bing.com" when you ask something like "what's the weather like"
        let isCortana = !/form=(WNSGPH|WNSBOX|WNSSCX|WNSFC2)/i.test(url);
        if((data.cortanaBing == 1 && isCortana) || (data.cortanaBing == 2 && !isCortana))
            return;

        // Grab the search query from the bing url and redirect
        let search = /q=([^&]+)/i.exec(url);
        if(search){
            // Add one to the ammount of redirects
            data.redirectCount++;
            chrome.storage.local.set({data: data});

            // Open website
            if(/^Open\+([a-z]{3,}\.){1,4}[a-z]{2,}$/.test(search[1]))
                return search[1].replace(/^Open\+(https?:\/\/)?/i, 'https://');
            
            // Otherwise search
            switch(data.searchEngine){
                case 0:
                    return 'https://www.google.com/search?q=' + search[1];
                case 1:
                    return 'https://www.duckduckgo.com?ia=web&q=' + search[1];
                case 2:
                    return 'https://search.yahoo.com/search?p=' + search[1];
                case 3:
                    return 'https://www.baidu.com/s?wd=' + search[1];
                case 4:
                    if(data.customSearchUrl.trim())
                        return data.customSearchUrl.replace(/^(https?:\/\/)?/i, 'http://') + search[1];
            }
        }
    }
}

// Grab settings, merge with default settings, and save
chrome.storage.local.get('data', res => {
    let d = res.data || {};
    for(let key in data)
        if(key in d)
            data[key] = d[key];
    chrome.storage.local.set({data: data});
});

// Whenever data is changed, update data
chrome.storage.onChanged.addListener(changes => {
    if(changes.data)
        data = changes.data.newValue;
});

// Redirect bing searches using the onBeforeRequest api
chrome.webRequest.onBeforeRequest.addListener(
    details => ({
        redirectUrl: redirectBingUrl(details.url) || details.url
    }),
    {
        urls: ['*://*.bing.com/*'],
        types: ['main_frame']
    },
    ['blocking']
);

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if(request.method == 'redirect')
        sendResponse(redirectBingUrl(request.url));
});

// Open options page when the user clicks on the browser action icon
chrome.browserAction.onClicked.addListener(() => chrome.runtime.openOptionsPage());

// On install
chrome.runtime.onInstalled.addListener(details => {
    if(details.reason == 'install'){
        // Only show install tutorial if user is on windows 10
        if(navigator.userAgent.includes('Windows NT 10.0'))
            chrome.tabs.create({url: 'install.html'});
        else
            chrome.runtime.openOptionsPage();
    }
});
