// Few retailers or news sites
// Few sites with multiple tlds. search engines better know what site person is looking for based on locale
// Mostly focused purely on social platforms and search
const shortcuts = {
    google: 'google.com',
    youtube: 'youtube.com',
    linkedin: 'linkedin.com',
    'google play': 'play.google.com',
    'google maps': 'maps.google.com',
    'google docs': 'docs.google.com',
    wikipedia: 'wikipedia.org',
    'google drive': 'drive.google.com',
    whatsapp: 'whatsapp.com',
    vk: 'vk.com',
    vimeo: 'vimeo.com',
    fb: 'facebook.com',
    facebook: 'facebook.com',
    github: 'github.com',
    'google news': 'news.google.com',
    paypal: 'paypal.com',
    imdb: 'imdb.com',
    dailymotion: 'dailymotion.com',
    yahoo: 'www.yahoo.com',
    slideshare: 'slideshare.net',
    cnn: 'cnn.com',
    outlook: 'outlook.live.com',
    bbc: 'bbc.com',
    weebly: 'www.weebly.com',
    dropbox: 'dropbox.com',
    wordpress: 'wordpress.com',
    myspace: 'myspace.com',
    'my space': 'myspace.com',
    twitter: 'twitter.com',
    soundcloud: 'soundcloud.com',
    walmart: 'walmart.com',
    'gmail': 'mail.google.com',
    'google mail': 'mail.google.com',
    tiktok: 'tiktok.com',
    'google photos': 'photos.google.com',
    webmd: 'webmd.com',
    cnet: 'cnet.com',
    pinterest: 'pinterest.com',
    shutterstock: 'shutterstock.com',
    researchgate: 'researchgate.net',
    'yahoo': 'yahoo.com',
    'yahoo finance': 'finance.yahoo.com',
    'yahoo sports': 'sports.yahoo.com',
    aol: 'aol.com',
    instagram: 'instagram.com',
    freepik: 'freepik.com',
    gofundme: 'gofundme.com',
    target: 'target.com',
    'urban dictionary': 'urbandictionary.com',
    kickstarter: 'kickstarter.com',
    bandcamp: 'bandcamp.com',
    twitch: 'twitch.tv',
    skype: 'skype.com',
    disqus: 'disqus.com',
    discord: 'discord.com',
    netflix: 'netflix.com',
    imgur: 'imgur.com',
    reddit: 'reddit.com',
    stackoverflow: 'stackoverflow.com',
    flickr: 'flickr.com',
    indiegogo: 'indiegogo.com',
    dribbble: 'dribbble.com',
    mixcloud: 'mixcloud.com',
};

function redirect(data, search){
    // Open website
    if(/^Open\+([a-z]{3,}\.){1,4}[a-z]{2,}$/.test(search))
        return search.replace(/^Open\+(https?:\/\/)?/i, 'https://');

    // Quick shortcuts 
    let shortcut = shortcuts[search.trim().replace(/\s+/, ' ').toLowerCase()]
    if(shortcut)
        return `https://${shortcut}`;

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