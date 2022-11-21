/* global isFirefox, TimelineLite, TweenLite, Cubic, Sine, Linear*/

let ANIMSPEED = 1.5,

    $searchEngineIcon = document.getElementById('search-engine-icon'),
    $browserFavicon = document.getElementById('browser-favicon'),
    $successSvgAnim = document.getElementById('success-svg-anim'),
    $browserPageTitle = document.getElementById('browser-page-title'),
    $browserSearchUrl = document.getElementById('browser-search-url'),
    $windowsSearchQuery = document.getElementById('windows-search-query'),
    $searchQuery = document.getElementById('search-query'),
    $camera = document.getElementById('camera'),
    $cursor = document.getElementById('cursor'),
    $clickRipple = document.getElementById('click-ripple'),
    $originalSearchBox = document.getElementById('original-search-box'),
    $clickedSearchBox = document.getElementById('clicked-search-box'),
    $searchTypedText = document.getElementById('search-typed-text'),
    $menu = document.getElementById('menu'),
    $menuSearchResults = document.getElementById('menu-search-results'),
    $searchResults = document.getElementById('search-results'),
    $browser = document.getElementById('browser'),
    $closeChrome = document.getElementById('close-chrome');
    

// Make sure animation shows right browser
if(isFirefox)
    $successSvgAnim.classList.add('firefox');

// Click mouse reused animation
TimelineLite.prototype.click = function(x, y, time){
    let duration = .2;
    return this
        // Cursor scale down and up quickly
        .to($cursor, duration, {scale: .7}, time - duration)
        .to($cursor, duration, {scale: 1}, time)

        .set($clickRipple, {scale: 0, x: x - 5, y: y - 6, opacity: 1}, time - duration)
        .to($clickRipple, .3, {scale: 1, ease: Cubic.easeOut}, time - duration)
        .to($clickRipple, .3, {opacity: 0, ease: Sine.easeOut}, time - duration)
}

// Get initial data
chrome.storage.local.get('data', ({ data }) => {
    let searchEngineIcon = 'images/' + ['google', 'duckDuckGo', 'yahoo', 'baidu'][data.searchEngine] + '.png',
        steps = [
            {
                search: 'Let\'s Dance!',
                web: true,
                url: ['https://www.google.com/', 'https://duckduckgo.com/', 'https://www.yahoo.com/', 'https://www.baidu.com/'][data.searchEngine],
                pageTitle: 'Let\'s Dance!' + [' - Google Search', ' at DuckDuckGo', ' - Yahoo Search', ' - Baidu Search'][data.searchEngine],
                favicon: searchEngineIcon,
                enableEl: document.getElementById('page-search-engine')
            },{
                search: 'netflix.com',
                web: false,
                url: 'https://www.netflix.com/',
                pageTitle: 'Netflix',
                favicon: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAMAAABEpIrGAAAAqFBMVEUAAACxBg/jBxLkCBOgBA6TAw2IAg3kCBPkCBPkCBPjCBOtBA+pBQ7jBxTjBxLjCBPiBxDfCBDaBxPWBxKwBg+wBg/jCBPkCBPkCBOxBg/kCBPkCBPjCBOxBg/kCBOxBg7jCBOFAQyCAQzjBxKxBRDkBxTjBxOxBg/kCBOrBQ+vBQ+eBA6VAw2mBQ6kBA6NAg3UBxLMBhHHBhG6BQ/cCBPCBhCIAg2FAg1GhdZrAAAAJ3RSTlMAgJeCgICA+vDs3M+AalU5Ewj99fHU08fGu7qxsaWkk5KFhVc9JCQXhFpsAAAA+UlEQVQ4y3XQx3LDMAwEUMgq7i2994QGSJGy3P7/zzICdLEH2BMPb7CchT5Xmy6D7pk5DpynZTBam8BtOAsTUMPg2b6wYzBcmQClY26DLYN7E1D/zT+Y6cD5PYMcCgPUBwYTKFEHGKVjWdU6oNDI3JXXgfMyxfgrGCAG6Zgm1AEmmaI91Tqg0K958jpw/igAA+kgHlsG24Q6wDSVE6nWAYXPMYOd14Hz1YBBE0gHsVxKh0cdYAkTBoeoAyogZ7D3OnAF/EoHkQ5mAA8yBeogA5jLidoEq6FMYQJ4kSnIBAvpsC+sRwzaC3Bz+/j6nv10z+/84+3p7hok/8iHTIdm7XXDAAAAAElFTkSuQmCC', // 'https://www.netflix.com/favicon.ico',
                enableEl: document.getElementById('page-netflix')
            }
        ];
    
    // Truncate length of page titles so they don't overflow
    steps.forEach(step => {
        if(step.pageTitle.length > 22)
            step.pageTitle = step.pageTitle.substring(0, 22).trim() + '...';
    })
    
    // Set correct icon for search engine
    $searchEngineIcon.setAttributeNS('http://www.w3.org/1999/xlink', 'xlink:href', searchEngineIcon);

    // Tutorial animation
    let tutorialAnim = gsap.timeline({ repeat: -1, repeatRefresh: true });
    tutorialAnim.timeScale(ANIMSPEED);

    // Generate timelines for each animation step and add them to the final animation
    steps.forEach((step) => {
        let $resultBoxes = step.enableEl.querySelectorAll('.result-box')

        tutorialAnim.add(
            gsap.timeline()
                // Start
                .set($cursor, {x: 0, y: 0, opacity: 0, transformOrigin: '50% 50%'})
                .set($clickRipple, {scale: 0, opacity: 0, transformOrigin: '50% 50%'})
                .set($clickedSearchBox, {opacity: 0})
                .set($menu, {opacity: 0, y: 100})
                .set($menuSearchResults, {y: 400})
                .set($searchResults, {opacity: 0})
                .set($browser, {opacity: 0, scale: .2, y: 600, transformOrigin: 'center'})
                .set($closeChrome, {opacity: 0})
                .set($browserSearchUrl, {text: step.url})
                .set($searchQuery, {text: step.search})
                .set($windowsSearchQuery, {text: step.search})
                .set($searchTypedText, {text: ''})
                .set(steps.map(({enableEl}) => enableEl), {display: 'none'})
                .set(step.enableEl, {display: 'initial'})
                .set($browserPageTitle, {text: step.pageTitle})
                .set($browserFavicon, { attr: { ['xlink:href']: step.favicon }})
                .set($resultBoxes, { opacity: 0, y: 40 })

                // Camera movements
                .set($camera, {scale: 1, x: 0, y: 0})
                .to($camera, 1, {scale: 3, x: 1920 * -1, y: 1080 * -1}, .5)
                .to($camera, 1, {scale: 3, x: 1920 * 0, y: 1080 * -2}, 1.5)
                .to($camera, 1, {scale: 3, x: 1920 * 0, y: 1080 * -1.5}, 6.5)
                .to($camera, 1, {scale: 1, x: 0, y: 0}, 7.8)

                // Animate!
                .to($cursor, 1, {opacity: 1}, 0)    
                .to($cursor, 1.4, {x: -820, y: 475}, 1.5)                            // Cursor moves over search box
                .set($originalSearchBox, {fill: 'rgb(76,76,76)'}, 2.66)              // Original search box changes color when cursor is over it
                .click(-820, 475, 3.4)                                               // Cursor clicks
                .to($clickedSearchBox, .2, {opacity: 1}, 3.3)                        // Search box appears during click
                .to($menu, .6, {opacity: 1, y: 0, ease: Cubic.easeOut}, 3.3)         // Menu slides up during click
                .to($cursor, .5, {opacity: 0}, 3.5)                                  // Fade out cursor so text being typed is visible

                // Type new search text
                .set($searchTypedText, {text: ''}, 4.1)
                .to($searchTypedText, 1.5, {text: (step.web ? 'web: ' : '') + step.search}, 4.1)

                .to($menuSearchResults, .4, {y: 0, ease: Cubic.easeOut}, 4.1)        // Slide up search results at the same time as result starts being typed in
                .to($searchResults, .2, {opacity: 1}, 5.6)                           // Actual search results only pop in when user is done typing
                .to($cursor, .5, {opacity: 1}, 5.8)                                  // Fade in cursor when done typing
                .to($cursor, 1, {x: -730, y: 170}, 6.3)                              // Move mouse over first search result
                .click(-730, 170, 7.7)                                               // Click search result
                .to($menu, .2, {opacity: 0, y: 100, ease: Cubic.easeOut}, 8.1)       // Slide away search results
                .to($clickedSearchBox, .2, {opacity: 0}, 8.1)                        // Search box dissapears
                .set($originalSearchBox, {fill: 'rgb(51, 51, 51)'}, 8.1)             // Reset the original search box fill color
                .to($browser, .5, {opacity: 1, scale: 1, y: 0}, 8.5)                 // Browser opens
                .to($resultBoxes, .5, {opacity: 1, y: 0, stagger: { each: 0.2 }}, 9) // Stagger in result boxes
                .to($cursor, 4, {x: 690, ease: Sine.easeInOut}, 8.8)                 // Mouse moves to browser close button while passing over search results
                    .to($cursor, 1.6, {y: -120, ease: Sine.easeOut}, 8.8)         
                    .to($cursor, 2.4, {y: -445, ease: Sine.easeIn}, 10.4)
                .to($closeChrome, .2, {opacity: 1}, 12.76)                           // Show close chrome hover effect when cursor is over it
                .click(690, -445, 13.2)                                              // Click browser close
                .to($browser, .3, {opacity: 0, scale: .8}, 13.2)                     // Browser close
                .to($cursor, .5, {opacity: 0}, 13.5)                                 // Hide cursor at very end
                .set($cursor, {opacity: 0}, 14.7)                                    // Extend animation for an extra second
        )
    })
});