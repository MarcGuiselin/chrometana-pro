const DEFAULT_DATA = {
    enabled: true,
    customSearchUrl: '',
    searchEngine: 0,// 0: google, 1: duckduckgo, 2: yahoo, 3: baidu, 4: custom
    cortanaBing: 0,// 0: cortana and bing, 1: cortana, 2: bing
    redirectCount: 0,
    installDate: Date.now(),
};

const PRE_QUERY_MATCHER = '(?:.*&)?';
const BING_MATCHER = '^https?://(?:www\\.)?bing\\.com/';
const BING_SEARCH_MATCHER = `${BING_MATCHER}search\\?`;

// WNSGPH:           click on search result
// WNSBOX|WNSSCX:    ask cortana to open website.com
// WNSFC2:           click "see more results on bing.com" when you ask something like "what's the weather like"
const CORTANA_MATCHER = `${PRE_QUERY_MATCHER}form=(?:WNSGPH|WNSBOX|WNSSCX|WNSFC2)`;

// This hash changes whenever redirection rules need to change
function rulesChangeHash(data){
    return data ? `${data.enabled}-${data.cortanaBing}-${data.customSearchUrl}` : ''
}

// Reset declarative net request rules
function rulesReset(data){
    if(data && (!data.newValue || rulesChangeHash(data.newValue) != rulesChangeHash(data.oldValue))){
        const { enabled, cortanaBing, customSearchUrl } = data.newValue || data;

        const maxRules = 4; // the maximum number of rules that can be set below
        const rules = [];

        // On a successful installation of edgedeflector, redirect to the success page
        rules.push({
            condition: {
                regexFilter: `${BING_SEARCH_MATCHER}successfuledgedeflectorinstall`,
                resourceTypes: ['main_frame'],
            },
            action: {
                type: 'redirect',
                redirect: {
                    extensionPath: '/success.html',
                },
            },
        });

        // On a successful installation of wedge, redirect to the success page
        rules.push({
            condition: {
                regexFilter: `${BING_MATCHER}#notify\\-redirect\\-extension\\-successful\\-wedge\\-install`,
                resourceTypes: ['main_frame'],
            },
            action: {
                type: 'redirect',
                redirect: {
                    extensionPath: '/success.html',
                },
            },
        });

        // Only perform redirect operations if this extension is enabled
        if(enabled && (cortanaBing != 4 || customSearchUrl.trim())){
            // If user selected only bing requests to be redirected, allow cortana requests
            if(cortanaBing == 2){
                rules.push({
                    condition: {
                        regexFilter: `${BING_SEARCH_MATCHER}${CORTANA_MATCHER}`,
                        resourceTypes: ['main_frame'],
                    },
                    action: {
                        type: 'allow',
                    },
                });
            }

            // Redirect request to redirect page
            rules.push({
                condition: {
                    regexFilter: `${BING_SEARCH_MATCHER}${PRE_QUERY_MATCHER}q=([^&]+)${cortanaBing == 1 ? CORTANA_MATCHER : ''}`,
                    resourceTypes: ['main_frame'],
                },
                action: {
                    type: 'redirect',
                    redirect: {
                        regexSubstitution: chrome.runtime.getURL('redirect.html') + '?q=\\1',
                    },
                },
            });
        }

        chrome.declarativeNetRequest.updateDynamicRules({
            removeRuleIds: Array.from({ length: maxRules }, (_, index) => index + 1),
            addRules: rules.map((rule, index) => ({ ...rule, id: index + 1, priority: maxRules - index + 1 })),
        });
    }
}

// Whenever data is changed, update declarative net request rules
chrome.storage.onChanged.addListener((res) => res && res.data && rulesReset(res.data));

// Open options page when the user clicks on the browser action icon
chrome.action.onClicked.addListener(() => chrome.runtime.openOptionsPage());

// On install
chrome.runtime.onInstalled.addListener(details => {
    chrome.storage.local.get('data', ({ data }) => {
        rulesReset(data);

        chrome.storage.local.set({
            data: Object.assign({}, DEFAULT_DATA, data),
        });

        if(details.reason == 'install'){
            // Only show install tutorial if user is on any version of windows and not using edge
            if(navigator.userAgent.includes('Windows NT 10.0') && !navigator.userAgent.includes('Edg'))
                chrome.tabs.create({url: 'install.html'});
            else
                chrome.runtime.openOptionsPage();
        }
    });
});
