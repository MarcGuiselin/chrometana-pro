let data = {},

    $content = document.getElementById('content'),
    $count = document.getElementById('count'),
    $enabled = document.getElementById('enabled'),
    $cortanaBing = document.getElementById('cortana-bing'),
    $cortanaBingText = $cortanaBing.querySelector('.dropdown-text'),
    $searchEngine = document.getElementById('search-engine'),
    $searchEngineText = $searchEngine.querySelector('.dropdown-text'),
    $bingLogo = document.getElementById('bing-logo'),
    $bingPlusCortana = document.getElementById('bing-plus-cortana'),
    $cortanaLogo = document.getElementById('cortana-logo'),
    $searchLogo = document.getElementById('search-logo'),
    $clickToChangeCortanaBing = document.getElementById('click-to-change-cortana-bing'),
    $customSearch = document.getElementById('custom-search'),
    $customSearchInput = $customSearch.querySelector('input');

// Whenever data is changed, update data
chrome.storage.onChanged.addListener(changes => {
    if (changes && changes.data && changes.data.newValue)
        data = changes.data.newValue;
    dataUpdate();
});

// Get initial data
chrome.storage.local.get('data', res => {
    data = res.data;
    dataUpdate();
});

// On options change
$enabled.addEventListener('change', () => {
    data.enabled = $enabled.checked;
    chrome.storage.local.set({ data });
});

// CortanaBing dropdown
for(let $li of $cortanaBing.querySelectorAll('li')){
    $li.addEventListener('mousedown', () => {
        data.cortanaBing = parseInt($li.getAttribute('value'));
        chrome.storage.local.set({ data });
    });
}

// SearchEngine dropdown
for(let $li of $searchEngine.querySelectorAll('li')){
    $li.addEventListener('mousedown', () => {
        data.searchEngine = parseInt($li.getAttribute('value'));
        chrome.storage.local.set({ data });
    });
}

// When user clicks on search engine logo, switch to next search engine
$searchLogo.addEventListener('click', () => {
    data.searchEngine++;
    if(data.searchEngine >= 4)
        data.searchEngine = 0;
    chrome.storage.local.set({ data });
});

// When user clicks on the cortana or bing logo, switch to next cortanaBing setting
$clickToChangeCortanaBing.addEventListener('click', () => {
    data.cortanaBing++;
    if(data.cortanaBing >= 3)
        data.cortanaBing = 0;
    chrome.storage.local.set({ data });
});

// Save custom search url
$customSearchInput.addEventListener('input', () => {
    data.customSearchUrl = $customSearchInput.value;
    chrome.storage.local.set({ data });
});

// Enable animation when mouse hovers over dropdown, checkboxes, and inputs
$enabled.parentElement.addEventListener('mouseover', () => $enabled.parentElement.classList.add('enable-animation'));
$cortanaBing.addEventListener('mouseover', () => $cortanaBing.classList.add('enable-animation'));
$searchEngine.addEventListener('mouseover', () => $searchEngine.classList.add('enable-animation'));
$customSearch.addEventListener('mouseover', () => $customSearch.classList.add('enable-animation'));



// Runs whenever options change
function dataUpdate(){
    if(data.redirectCount == 0)
        $count.textContent = 'no searches yet';
    else if(data.redirectCount == 1)
        $count.textContent = '1 search';
    else
        $count.textContent = data.redirectCount.toLocaleString() + ' searches';

    // Enabled/disabled checkbox
    $enabled.checked = data.enabled;
    if(data.enabled){
        $content.classList.remove('disabled');
    }else if(!$content.classList.contains('disabled')){
        $content.classList.add('disabled');
        $cortanaBing.classList.remove('enable-animation');
        $searchEngine.classList.remove('enable-animation');
        $customSearch.classList.remove('enable-animation')
    }

    // De-select all dropdown values
    for(let $li of document.querySelectorAll('.dropdown li'))
        $li.classList.remove('selected');

    // Reselect correct dropdown values for cortanaBing 
    let $sel1 = $cortanaBing.querySelector('li[value="' + data.cortanaBing + '"]');
    $sel1.classList.add('selected');
    $cortanaBingText.textContent = $sel1.textContent;

    // Reselect correct dropdown values for searchEngine 
    let $sel2 = $searchEngine.querySelector('li[value="' + data.searchEngine + '"]');
    $sel2.classList.add('selected');
    $searchEngineText.textContent = $sel2.textContent;

    // Update bing visual
    $bingLogo.style.display =           data.cortanaBing != 1 ? '' : 'none';
    $bingPlusCortana.style.display =    data.cortanaBing == 0 ? '' : 'none';
    $cortanaLogo.style.display =        data.cortanaBing != 2 ? '' : 'none';

    // Update search engine logo or show custom input
    if(data.searchEngine != 4){
        $searchLogo.style.display = '';
        $customSearch.style.display = 'none';
        $searchLogo.src = 'images/' + ['google', 'duckDuckGo', 'yahoo', 'baidu'][data.searchEngine] + '.png';
    }else{
        $searchLogo.style.display = 'none';
        $customSearch.style.display = '';
        $customSearch.classList.remove('enable-animation');// Remove enable-animation class so we don't see the animation from switching

        if($customSearchInput.value != data.customSearchUrl)
            $customSearchInput.value = data.customSearchUrl;
    }
}
