# Angular/Ionic Cross Platform Template

Cross platform template in this sense means a template that can be used to make  Electron builds, Cordova builds and a web build seamlessly. Since each platform has specific needs, the template should take those into account and allow for easy customization. 

## Prequisites

Skip this if you have already installed the below items.

* NodeJS
* git
* Angular CLI
* Ionic CLI
* Cordova CLI

I will not cover installing NodeJS and git here. Please visit their respective sites: [NodeJS](https://nodejs.org/en/) and [git](https://git-scm.com/)

### Angular CLI

```shell
> npm install -g @angular/cli
```

[Angular CLI Website](https://cli.angular.io/)

### Ionic CLI

```shell
> npm install -g ionic@latest
```

[Ionic CLI Website](https://ionicframework.com/docs/cli/)


## Create a new project

We will base this template off of the side-menu ionic template. It includes the routing module and two sample pages.

Using the `ionic start` command will create a new directory and install dependencies.

```shell
> ionic start "Cross Platform Template" sidemenu --cordova
```

*Select Yes when asked to Try Ionic 4*

```sh
? Try Ionic 4? (Y/n) y
```

Installing dependencies will take a few minutes.

No need to connect to Applflow.

```sh
? Install the free Ionic Appflow SDK and connect your app? (Y/n) n
```


## Update the folder structure


The initial folder structure should look like this:

```sh
cross-plaftorm-template
├───.vscode
│   └───typings
│       ├───cordova-ionic
│       │   └───plugins
│       └───jquery
├───e2e
│   └───src
├───src
│   ├───app
│   │   ├───home
│   │   └───list
│   ├───assets
│   │   └───icon
│   ├───environments
│   └───theme
└───typings
```

The `src` folder is the location of the applications main program.

The `e2e` folder is for end to end testing of the program.

### Add Electron source folder

Create `src-electron` folder in the `cross-platform-template` root.
Create `src-electron\app` folder.

This folder will be used to hold electron specific source. This includes the main.ts that Electron uses to launche the app window as well as any additional renderers. For example, a windowless renderer to handle file access and/or sqlite access. 

### Add Cordova source folder

Create `src-cordova` folder in the `cross-plaftorm-template` root.

### Add distribution folder for Cordova

The distribution folder is where the dependencies for cordova and its plugins will be installed. Use the cordova CLI to create it.

```shell
> cordova create dist-cordova com.crossplatform.template "Cross Platform Template"
```

Using a seperate distribution folder keeps the source from getting cluttered with the cordova specific folders and dependencies. Though it does add a layer of complexity when adding and managing cordova plugins. 

I use [Monaca](https://monaca.io/) to handle builds for my Cordova projects, so this also works well with their system as I dont need to sync my entire source. 

### Final folder strcture

Here is final source structure.

```sh
cross-plaftorm-template
├───.vscode
│   └───typings
│       ├───cordova-ionic
│       │   └───plugins
│       └───jquery
├───dist-cordova
│   ├───hooks
│   ├───platforms
│   ├───plugins
│   ├───res
│   └───www
├───e2e
│   └───src
├───src
│   ├───app
│   │   ├───home
│   │   └───list
│   ├───assets
│   │   └───icon
│   ├───environments
│   └───theme
├───typings
├───src-electron
│   ├───app
└───src-corodova
```

## Create platform specific source files

### Create cordova files

Copy the `.\src\index.html` file to `.\src-cordova`

```sh
copy .\src\index.html .\src-cordova\
```

Update the `<base href>` and add `cordova.js` script. 

```html
<!-- index.html -->
<!DOCTYPE html>
<html lang="en">
<head>
    ...

    <base href="./" />  <!-- Update this -->

    <script type="text/javascript" src="cordova.js"></script>
</head>
...
</html>
```

### Create Electron files

We will do the following:
* make a copy of the `index.html`
* update the contents the `index.html`
* create a `main.ts`
* create a `tsconfig.json`

#### Copy index.html to Electron source folder

Copy the `.\src\index.html` file to `.\src-electron\app`

```sh
copy .\src\index.html .\src-electron\app
```

Update the `<base href>` script. 

```html
<!-- index.html -->
<!DOCTYPE html>
<html lang="en">
<head>
    ...

    <base href="./" />  <!-- Update this -->   
</head>
...
</html>
```

#### Create main.ts for Electron

Create the `.\src-electron\main.ts` for electron. This template is from [electron-quick-start-typescript
](https://github.com/electron/electron-quick-start-typescript)


```typescript
import { app, BrowserWindow } from "electron";
import * as path from "path";

let mainWindow: Electron.BrowserWindow;

function createWindow() {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    height: 600,
    width: 800,
  });

  // and load the index.html of the app.
  mainWindow.loadFile(path.join(__dirname, "../app/index.html"));

  // Open the DevTools.
  mainWindow.webContents.openDevTools();

  // Emitted when the window is closed.
  mainWindow.on("closed", () => {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null;
  });
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on("ready", createWindow);

// Quit when all windows are closed.
app.on("window-all-closed", () => {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  // On OS X it"s common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow();
  }
});

// In this file you can include the rest of your app"s specific main process
// code. You can also put them in separate files and require them here.

```


#### Create tsconfig.json for Electron

Since we are writing our main file in typescript we will need to create a `tsconfig.json` file to manage the compile into javascript.

Create `tsconfig.json` in `.\src-electron`

```json
{
  "compilerOptions": {
    /* Basic Options */
    "target": "es2015",                     
    "module": "commonjs",                      
    "sourceMap": true,                     
    "outDir": "../dist-electron",              
    "strict": true,                            
    "strictNullChecks": false,             
    "esModuleInterop": true                
    
  }
}

```


## Create build scripts

The last step is to update the build scripts to create distributions for each platform. 

The default output folder for ionic is `.\www`. For consistency, let's change his to `.\dist`. 

Edit the `angular.json` file in the root directory. 

Next edit the following propoerty: `projects.app.architect.build.options.outputPath` 

```json
{
  "$schema": "./node_modules/@angular-devkit/core/src/workspace/workspace-schema.json",
  "version": 1,
  "defaultProject": "app",
  "newProjectRoot": "projects",
  "projects": {
    "app": {
      "root": "",
      "sourceRoot": "src",
      "projectType": "application",
      "prefix": "app",
      "schematics": {},
      "architect": {
        "build": {
          "builder": "@angular-devkit/build-angular:browser",
          "options": {
            "outputPath": "dist", //  <= HERE
```

### Add Cordova Build scripts

To build a Cordova project we will utilize the builder provided by Ionic and some custom configurations in the `angular.json` file.

Edit the `angular.json` file
Under `projects.app.architect.build.configurations` add the following objects.

```json
{
  ...
  "projects": {
    "app": {
      ...
      ,
      "architect": {
        "build": {
          "builder": "@angular-devkit/build-angular:browser",
          "options": {
            ... 
            },
          "configurations": { 
            // ------ Start adding here ------------
            "cordova": {
              "outputPath": "dist-cordova/www",
              "index": "src-cordova/index.html"
            },
            "cordova-prod": {
              "outputPath": "dist-cordova/www",
              "index": "src-cordova/index.html",
              "fileReplacements": [
                {
                  "replace": "src/environments/environment.ts",
                  "with": "src/environments/environment.prod.ts"
                }
              ],
              "optimization": true,
              "outputHashing": "all",
              "sourceMap": false,
              "extractCss": true,
              "namedChunks": false,
              "aot": true,
              "extractLicenses": true,
              "vendorChunk": false,
              "buildOptimizer": true,
              "budgets": [
                {
                  "type": "initial",
                  "maximumWarning": "2mb",
                  "maximumError": "5mb"
                }
              ]
            },

            // ------ Finish ------------
```

Next update the `projects.app.architect.ionic-cordova-build` properties.

```json
{    
  ...  
        "ionic-cordova-build": {
          "builder": "@ionic/angular-toolkit:cordova-build",
          "options": {
            "browserTarget": "app:build:cordova",  
            "platform": "android",   // This property is not used by the builder will make a fuss if it is not set
            "cordovaBasePath": "dist-cordova/",
            "cordovaAssets": false
            },
            "configurations": {
            "production": {
              "browserTarget": "app:build:cordova-prod"
            }
          }
        }
}
```


Next lets add a script to our package to build 

### Create a Cordova build

Now we can create a cordova build with the following:

```sh
npx ng run app:ionic-cordova-build
```

or a production build

```sh
npx ng run app:ionic-cordova-build:production
```

Note: `npx` runs the project version of the angular cli

After you have your Cordova build you can go about compiling an app for Android or iPhone.

### Add Electron build scripts

Next let's add the build scripts for electron

Edit the `angular.json` file. Under `projects.app.architect.build.configurations` add the following objects.

```json
{
  ...
  "projects": {
    "app": {
      ...
      ,
      "architect": {
        "build": {
          ...
          "configurations": {
            ...
            "electron": {              
              "outputPath": "dist-electron/app",
              "index": "src-electron/app/index.html"
            },
            "electron-prod": {
              "outputPath": "dist-electron/app",
              "index": "src-electron/app/index.html",
              "fileReplacements": [
                {
                  "replace": "src/environments/environment.ts",
                  "with": "src/environments/environment.prod.ts"
                }
              ],
              "optimization": true,
              "outputHashing": "all",
              "sourceMap": false,
              "extractCss": true,
              "namedChunks": false,
              "aot": true,
              "extractLicenses": true,
              "vendorChunk": false,
              "buildOptimizer": true,
              "budgets": [
                {
                  "type": "initial",
                  "maximumWarning": "2mb",
                  "maximumError": "5mb"
                }
              ]
            }
          }
          ...
        },

        "electron-build": {          
          "builder": "@angular-builders/custom-webpack:browser",          
          "options": {                       
            "customWebpackConfig": {
              "path": "./electron-webpack.config.js"
            }, 
            "baseHref": "./",
            "outputPath": "./dist-electron/app",
            "index": "src/index.html",
            "main": "src/main.ts",
            "polyfills": "src/polyfills.ts",
            "tsConfig": "src/tsconfig.app.json",
            "assets": [
              "src/favicon.ico",
              "src/assets"
            ],
            "fileReplacements": [
              {
                "replace": "src/app/sqlite-factory.ts",
                "with": "src/app/sqlite-factory.electron.ts"
              }
            ],
            "styles": [
              {
                "input": "src/theme/variables.scss"
              },
              {
                "input": "src/global.scss"
              }
            ],
            "scripts": []
            
          }       
        } 
      }
    }
  }
}


```

### Create an Electron build

We can create an build of our site for Electron with the following command.

```sh
npx ng run app:build:electron
```

Or production

```sh
npx ng run app:build:electron-prod
```

However, this will not be enough to run electron. We have to compile the main process as well.

```sh
npx tsc -p ./src-electron
```

Now we can open with Electron

```sh
npx electron ./dist-electron/main.js
```

### Add package.json scripts

To simplify the builds for each platform, let's add some scripts to the `package.json`. (located in the root directory)

```json
{
  "name": "cross-platform-template",
  "version": "0.0.1",
  "author": "Your Name",
  "homepage": "your.website.com",
  "scripts": {
    "ng": "ng",
    "start": "ng serve",
    "start:electron": "npm run build:electron && npx electron ./src-electron/main.js",    
    "build:cordova": "ng run app:ionic-cordova-build", 
    "build:electron": "ng run app:build:electron && tsc -p ./src-electron",
    "build:all": "npm run build && npm run build:cordova && npm run build:electron",
    "build": "ng build",
    "test": "ng test",
    "lint": "ng lint",
    "e2e": "ng e2e"
  },

```

### Add custom webpack

### Add 
