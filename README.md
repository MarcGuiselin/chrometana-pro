# <img src="src/chrome-overrides/icons/64.png" align="center"> Chrometana Pro and <img src="src/firefox-overrides/icons/64.png" align="center"> Foxtana Pro

> Take back control of windows search by using your favorite browser and search engine

[![PayPal Donations shield](https://img.shields.io/badge/donations-paypal-blue.svg?style=flat-square)](https://PayPal.me/marcguiselin/3USD)
![Maintenance](https://img.shields.io/badge/maintenance-actively--developed-brightgreen.svg?style=flat-square)
[![License](https://img.shields.io/github/license/MarcGuiselin/chrometana-pro.svg?style=flat-square&color=orange)](https://github.com/MarcGuiselin/chrometana-pro/blob/master/LICENSE)

## A choice that matters

Biting down on it's control of the PC market, unopposed by the laxing hammer of the law that [once restricted this kind of behavior](https://en.wikipedia.org/wiki/United_States_v._Microsoft_Corp.), Microsoft has continued to double down on its goals for internet browsing, search and data collection dominance.

We should not be relegated to using the tools forced upon us, especially when we don't know the true extent of their privacy, data collection and censorship.

Chrometana Pro and Foxtana Pro put that control back in the hands of regular users. Use your browser and search engine of choice, for all link clicks and searches made within your operating system.

## What does this extension do?

First, it provides you with simple step-by-step instructions on how to change your search preferences and install the required edge deflector app ([Wedge](https://github.com/MarcGuiselin/wedge) or [MSEdgeRedirect](https://github.com/rcmaehl/MSEdgeRedirect)) to open searches in your browser of choice.

Next, it gives you the choice of what search engine you would like to use insteasd of the default bing searches made by windows search (Cortana). You can change these options at any time using the options menu.

Any search you make using windows search will automatically be opened in your browser of choice with your search engine of choice. Any link you click or action you take in a native app will open in your default browser. 

## Install

### For Chromium

> Includes browsers like Google Chrome, Brave, Opera and Vivaldi

1. Install the official release from the [Chrome Web Store](https://chrome.google.com/webstore/detail/chrometana-pro-redirect-c/lllggmgeiphnciplalhefnbpddbadfdi)
2. Follow the setup guide
3. A success page will open to indicate you've successfully completed the setup!

[__Chrometana Pro__ <img src="https://img.shields.io/chrome-web-store/v/lllggmgeiphnciplalhefnbpddbadfdi.svg?color=007ec6&style=flat-square" align="center"> <img src="https://img.shields.io/chrome-web-store/d/lllggmgeiphnciplalhefnbpddbadfdi.svg?color=4c1&style=flat-square" align="center"> <img src="https://img.shields.io/chrome-web-store/rating/lllggmgeiphnciplalhefnbpddbadfdi?color=orange&style=flat-square" align="center">](https://chrome.google.com/webstore/detail/chrometana-pro-redirect-c/lllggmgeiphnciplalhefnbpddbadfdi)

### For Firefox

1. Install the official release from [Firefox Browser Addons](https://chrome.google.com/webstore/detail/chrometana-pro-redirect-c/lllggmgeiphnciplalhefnbpddbadfdi)
2. Follow the setup guide
3. A success page will open to indicate you've successfully completed the setup!

[__Foxtana Pro__ <img src="https://img.shields.io/amo/v/foxtana-pro-redirect-cortana.svg?color=007ec6&style=flat-square" align="center"> <img src="https://img.shields.io/amo/users/foxtana-pro-redirect-cortana.svg?color=4c1&style=flat-square" align="center"> <img src="https://img.shields.io/amo/rating/foxtana-pro-redirect-cortana?color=orange&style=flat-square" align="center"> ](https://addons.mozilla.org/en-US/firefox/addon/foxtana-pro-redirect-cortana/)

## Why not an app?

The browser extension requires the installation of an separate app [Wedge](https://github.com/MarcGuiselin/wedge) to force redirection in windows 10 and 11. It instructs users to download and install this app after the extension is installed.

The extension's redirection functionality (from the default Bing to another search engine) could be done entirely by the app, as similar alternatives like the fantastic [MSEdgeRedirect](https://github.com/rcmaehl/MSEdgeRedirect) do entirely out of the box.

So why do it this way at all?

1. To replace any need for software updates. Wedge is minimally invasive and meant to be installed once and forgotten. The extension can update itself automatically instead of the app to add new in-browser features like more search engine options or adapt to changes in bing urls.
2. Simply because the audience is there. Many users discover that they can have control over windows search by means of the chrome web store.
3. Because historically the extension used [da2x's EdgeDeflector](https://github.com/da2x/EdgeDeflector) as an app, which had no bing search redirection functionality. This was added via this extension. To this day existing users continue to expect having control over their search engine within the extension's option menu rather than in an external app.

## Development

1. Install node js and the yarn package manager
2. In a terminal to the repo's root directory, run `yarn` to install packages
3. Then run `yarn dev` to watch files for changes and compile the extension for chrome
4. Enable developer mode on the `chrome://extensions` page
5. Drag and drop the `dest` folder into the extensions page to install it

## Donate

🍻 If you use or enjoy my work [buy me a drink](https://www.paypal.me/marcguiselin/3USD) or show your support by leaving a nice review on my browser extensions. Both are very appreciated! 

## License and Copyright

Please see the LICENSE for an up to date copy of the copyright and license for the entire project. Don't use my logos in your project without asking me first. If you make a derivative project off of mine please let me know! I'd love to see what people make with my work!
