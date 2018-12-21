# Angular/Ionic Cross Platform Example

With this post, I'm going to make a cross platform app for Electron and Cordova with the ability to test in a browser. When building a cross platform app, it is important to note that not all functionalities are available on all platforms. 

Project Outline:
* Offline first (actually offline only)
* QR Code scanning using cam if available
* SQLite embedded

The SQLite portion gets tricky since the code is native to each platform. 

## `start` the project

I'm using the cross platform template that I created [here].
It has the basic framework needed to create builds to target Cordova and Electron.

```sh
ionic start "SQLite QRReader" https://github.com/tecnetfoley/angular-ionic-xplatform.git
```

Then I updated my `package.json` with my name and homepage.

## Add QR Scan Page

First lets add a page to the project for the scanning. You can use the ionic cli to create the scaffolding for the page. 

```sh
ionic g page qrscan
```

Note: Use `ionic generate --help` to see a full list of components ionic cli can help generate.

First lets get the camera displaying on the page. 

Edit `src\app\qrscan\qrscan.page.html`.

We can use HTML5 video tag on `getUserMedia` for Android (with a plugin) and Electron. However, this will leave out iOS.

```html

```

