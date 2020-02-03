var data = {},

    $content = document.getElementById("content"),
    $count = document.getElementById("count"),
    $enabled = document.getElementById("enabled"),
    $cortanaBing = document.getElementById("cortana-bing"),
    $cortanaBingText = $cortanaBing.querySelector('.dropdown-text'),
    $searchEngine = document.getElementById("search-engine"),
    $searchEngineText = $searchEngine.querySelector('.dropdown-text'),
    $bingLogo = document.getElementById("bing-logo"),
    $bingPlusCortana = document.getElementById("bing-plus-cortana"),
    $cortanaLogo = document.getElementById("cortana-logo"),
    $searchLogo = document.getElementById("search-logo"),
    $clickToChangeCortanaBing = document.getElementById("click-to-change-cortana-bing"),
    $customSearch = document.getElementById("custom-search"),
    $customSearchInput = $customSearch.querySelector("input");

(function(){
    //whenever data is changed, update data
    chrome.storage.onChanged.addListener(function(changes){
        if (changes && changes.data && changes.data.newValue)
            data = changes.data.newValue;
        dataUpdate();
    });

    //get initial data
    chrome.storage.local.get("data", function (res) {
        data = res.data;
        dataUpdate();
        $content.classList.add("show");
    });

    //on options change
    $enabled.addEventListener("change", function(){
        data.enabled = $enabled.checked;
        chrome.storage.local.set({data: data});
    });

    //cortanaBing dropdown
    for(let $li of $cortanaBing.querySelectorAll("li")){
        $li.addEventListener("mousedown", function(){
            data.cortanaBing = parseInt(this.getAttribute("value"));
            chrome.storage.local.set({data: data});
        });
    }

    //searchEngine dropdown
    for(let $li of $searchEngine.querySelectorAll("li")){
        $li.addEventListener("mousedown", function(){
            data.searchEngine = parseInt(this.getAttribute("value"));
            chrome.storage.local.set({data: data});
        });
    }

    //when user clicks on search engine logo, switch to next search engine
    $searchLogo.addEventListener("click", function(){
        data.searchEngine++;
        if(data.searchEngine == 4)
            data.searchEngine = 0;
        chrome.storage.local.set({data: data});
    });

    //when user clicks on the cortana or bing logo, switch to next cortanaBing setting
    $clickToChangeCortanaBing.addEventListener("click", function(){
        data.cortanaBing++;
        if(data.cortanaBing == 3)
            data.cortanaBing = 0;
        chrome.storage.local.set({data: data});
    });

    //save custom search url
    $customSearchInput.addEventListener("input", function(){
        data.customSearchUrl = this.value;
        chrome.storage.local.set({data: data});
    });

    //enable animation when mouse hovers over dropdown, checkboxes, and inputs
    $enabled.parentElement.addEventListener("mouseover", () => $enabled.parentElement.classList.add("enable-animation"));
    $cortanaBing.addEventListener("mouseover", () => $cortanaBing.classList.add("enable-animation"));
    $searchEngine.addEventListener("mouseover", () => $searchEngine.classList.add("enable-animation"));
    $customSearch.addEventListener("mouseover", () => $customSearch.classList.add("enable-animation"));
})();



function dataUpdate(){
    if(data.redirectCount == 0)
        $count.textContent = "no searches yet";
    else if(data.redirectCount == 1)
        $count.textContent = "1 search";
    else
        $count.textContent = data.redirectCount.toLocaleString() + " searches";

    //enabled/disabled checkbox
    $enabled.checked = data.enabled;
    if(data.enabled){
        $content.classList.remove("disabled");
    }else if(!$content.classList.contains("disabled")){
        $content.classList.add("disabled");
        $cortanaBing.classList.remove("enable-animation");
        $searchEngine.classList.remove("enable-animation");
        $customSearch.classList.remove("enable-animation")
    }

    //de-select all dropdown values
    for(let $li of document.querySelectorAll(".dropdown li"))
        $li.classList.remove("selected");

    //reselect correct dropdown values for cortanaBing 
    let $sel1 = $cortanaBing.querySelector("li[value='" + data.cortanaBing + "']");
    $sel1.classList.add("selected");
    $cortanaBingText.textContent = $sel1.textContent;

    //reselect correct dropdown values for searchEngine 
    let $sel2 = $searchEngine.querySelector("li[value='" + data.searchEngine + "']");
    $sel2.classList.add("selected");
    $searchEngineText.textContent = $sel2.textContent;

    //update search engine redirect visual
    $bingLogo.style.display =           data.cortanaBing != 1 ? "" : "none";
    $bingPlusCortana.style.display =    data.cortanaBing == 0 ? "" : "none";
    $cortanaLogo.style.display =        data.cortanaBing != 2 ? "" : "none";

    if(data.searchEngine != 4){
        $searchLogo.style.display = "";
        $customSearch.style.display = "none";
        $searchLogo.src = "images/" + ["google", "duckDuckGo", "yahoo", "baidu"][data.searchEngine] + ".png";
    }else{
        $searchLogo.style.display = "none";
        $customSearch.style.display = "";
        $customSearch.classList.remove("enable-animation");//remove enable-animation class so we don't see the animation from switching

        if($customSearchInput.value != data.customSearchUrl)
            $customSearchInput.value = data.customSearchUrl;
    }
}




//called by background page
function focusAndBringOptionsPageToFront(){
    chrome.tabs.getCurrent(function (tab) {
        chrome.windows.update(tab.windowId, {
            focused: true
        }, function () {
            chrome.tabs.update(tab.id, {
                active: true
            }, null);
        });
    });
}