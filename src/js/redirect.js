function redirect(data, search){
    // Open website
    if(/^Open\+([a-z]{3,}\.){1,4}[a-z]{2,}$/.test(search))
        return search.replace(/^Open\+(https?:\/\/)?/i, 'https://');

    // Otherwise search
    switch(data.searchEngine){
        case 0:
            return 'https://www.google.com/search?q=' + search;
        case 1:
            return 'https://www.duckduckgo.com?ia=web&q=' + search;
        case 2:
            return 'https://search.yahoo.com/search?p=' + search;
        case 3:
            return 'https://www.baidu.com/s?wd=' + search;
        case 4:
            return data.customSearchUrl.replace(/^(https?:\/\/)?/i, 'https://') + search;
    }
}

chrome.storage.local.get('data', async ({ data }) => {
    data.redirectCount++;
    await chrome.storage.local.set({ data });

    const search = window.location.search.substr(3);
    const to = redirect(data, search);

    if(to && to.startsWith('https://')) window.location.replace(to);
    else chrome.tabs.getCurrent((tab) => chrome.tabs.remove(tab.id));
})