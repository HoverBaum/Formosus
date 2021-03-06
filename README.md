# Formosus

[![Project Status: Active - The project has reached a stable, usable state and is being actively developed.](http://www.repostatus.org/badges/latest/active.svg)](http://www.repostatus.org/#active)

A plugin for Chrome that customizes the look of the "new Tab".

![Screenshot of newTab](store/english.jpg "Example of how the new tab page will look")

## Features

* Time of the day dependant greeting.
    * Multiple languages supported.
* Great background images powered by [unsplash.com](https://unsplash.com/).

### Supported languages

* Chinese (pinjin)
* Chinese (simplified)
* Dutch
* English
* French
* German

## Contribute

If you speak a language not supported yet you can contribute by submitting greetings for your language.

Found a bug? Open an issue :+1:

Want to help? Make a fork or let me know.

### Development

A good way to develop goes like this:

- run `npm run build` to build the project into dist
- visit chrom://extensions in your Chrome browser
- drag the `dist` folder into the browser
- everytime you make an update build again and click the refresh button for the plugin

For some development it might be enough to simply serve the `src` folder as a website.