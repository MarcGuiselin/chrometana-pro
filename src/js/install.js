let data = {},

    $searchEngine = document.getElementById('search-engine'),
    $searchEngineText = $searchEngine.querySelector('.dropdown-text'),
    $searchLogo = document.getElementById('search-logo'),
    $customSearch = document.getElementById('custom-search'),
    $customSearchInput = $customSearch.querySelector('input'),
    $willFadeOut = document.querySelectorAll('.will-fade-out');


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

// SearchEngine dropdown
for(let $li of $searchEngine.querySelectorAll('li')){
    $li.addEventListener('mousedown', () => {
        data.searchEngine = parseInt($li.getAttribute('value'));
        chrome.storage.local.set({data: data});
    });
}

// When user clicks on search engine logo, switch to next search engine
$searchLogo.addEventListener('click', () => {
    data.searchEngine++;
    if(data.searchEngine >= 4)
        data.searchEngine = 0;
    chrome.storage.local.set({data: data});
});

// Enable animation when mouse hovers over dropdown, checkboxes, and inputs
$searchEngine.addEventListener('mouseover', () => $searchEngine.classList.add('enable-animation'));

// Fade items as user scrolls down
let scrollUpdate = () => {
    let isTop = window.scrollY < 20
    $willFadeOut.forEach($el => {
        let { bottom } = $el.getBoundingClientRect();
        if(isTop || bottom > 150)
            $el.classList.remove('fade-out');
        else
            $el.classList.add('fade-out');
    })
};
scrollUpdate();
window.addEventListener('scroll', scrollUpdate);
window.addEventListener('resize', scrollUpdate)



// Runs whenever options change
function dataUpdate(){
    // De-select all dropdown values
    for(let $li of document.querySelectorAll('.dropdown li'))
        $li.classList.remove('selected');

    // Reselect correct dropdown values for searchEngine 
    let $sel2 = $searchEngine.querySelector('li[value="' + data.searchEngine + '"]');
    $sel2.classList.add('selected');
    $searchEngineText.textContent = $sel2.textContent;

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
