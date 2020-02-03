var isFirefox = navigator.userAgent.includes("Firefox"),
    $version = document.getElementById("version"),
    $copyrightDate = document.querySelector("#copyright span");


(function(){
    //load details into headers
    $copyrightDate.textContent = Math.max(2018, new Date().getFullYear());
    $version.textContent = chrome.runtime.getManifest().short_name + " " + chrome.runtime.getManifest().version;

    //close any other opened extension pages
    for (let w of chrome.extension.getViews())
        if (["/install.html", "/options.html", "/success.html"].includes(w.location.pathname) && w != window)
            w.chrome.tabs.getCurrent(tab => w.chrome.tabs.remove(tab.id));
    
    //prevent image dragging in firefox
    if(isFirefox)
        for(let $el of document.querySelectorAll("img[draggable=false]"))
            $el.addEventListener("dragstart", event => event.preventDefault && event.preventDefault());
})();