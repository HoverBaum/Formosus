# How it works

If you are wondering (or for when I have forgotten next week) how this works, here is a quick explanation of what is happening.

## Background image

The image in the background is set as the `body`s background image. This is done to ensure that it covers the entire browser window at all times.

Images come from unsplash via their [source API](https://source.unsplash.com/). There we request images in the dimensions of the users screen.

On every page load as well as when the plugin gets installed it will get such an image. The image is then locally stored as a base64 string to ensure that it can be loaded within an instant. We also at this time only update the image once a day. We could use the APIs `/daily` for that but choose to keep track of images ourselfes as it could enable us more features in the future.

## Name input

To make sure the input is as long as what is written in it we employ some magic. Not really though. What happens is that every time the input changes we copy its content to a hidden span and see how long that gets. We then make the input exactly that long.

## Sync

Using [chrome.storage.sync](https://developer.chrome.com/extensions/storage#property-sync) We save the users configuration and name across all his machines.

## Language support

Well right now there are a few hardcoded strings to change language.

## Greeting and time

The plugin has hardcoded greetings for all hours of the day defaulting to English. To update the greeting and the clock we run an interval task.

Greetings come with a start and end hour during which they should be displayed.

```javascript
{
	greeting: "Guten Morgen",
	start: 6,
	end: 11
}
```

## Init script

For some reason it didn't like inline scripts so we made a file with the sole purpose of starting the other javascript....

# Building the Plugin

To make development more convenient we split up logical parts of the plugin during development. To then also get the fastest and smallest plugin we use [Gulp](http://www.gulpjs.com/) to create smaller files.

Running `gulp` will:

1. Clean any files in `dist` to make sure we only get the up to date version.
2. Copy over all "static assets" such as fonts.
3. Minify the "frontend" which is to say the HTML seen by users, involving:
	- Concatinating JS and CSS into single files
	- Minifying CSS and HTML
	- Removing JS comments (no minification due to ES6)
4. Create a single file for background scripts.
5. Update references to background script in the manifest file.

After that you can run `gulp zip` to generate a zip file. For some reason putting it all into one gave erros.
