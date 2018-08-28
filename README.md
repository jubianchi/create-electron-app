# create-electron-app

![Logo](resources/logo.png)

## 🤔 Why?

* [`create-react-app`](https://github.com/facebook/create-react-app)
* [`electron-react-boilerplate`](https://github.com/chentsulin/electron-react-boilerplate)

If we were to talk using `create-react-app` words we could say that with `createa-electron-app` you get a pre-ejected 
environment meaning you will have full-control over the configuration of each tool OOTB.

## 🏁 Initialize

```shell
npm init jubianchi/electron-app <target-directory>
```

## 💻 Develop

`create-electron-app` will initialize a bunch of scripts for you:

* `start`: starts a local development environment using webpack development server.

### Environment

### Directory structure

Once initialized, your workspace will look like this:

```
├── config
├── resources
└── src
    ├── main
    ├── renderer
    └── shared

9 directories

```

The directory structure is pretty simple and should cover all your needs:

* the [`config/`](config/) directory contains the configuration files used by the development tools (Webpack, Jest, ...);
* the [`resources`](resources/) directory actually only contains an image used to build the MacOS DMG. You'll be able to use this directory as you like;
* the [`src/main/`](src/main/) directory contains the source files for the main process;
* the [`src/renderer/`](src/renderer/) directory contains the source files for the renderer process;
* the [`src/shared/`](src/shared/) directory contains the source files for shared between the main and renderer process.

You are free to edit any of the files inside any directory but keep in mind that, the more you change the contents of 
configuration files the harder it will be to update to future `create-electron-app` release.

Note that the [`src/shared/`](src/shared/) directory is aliased to `@shared` to ease importing files from it.

### Adding a Chrome extension

`create-electron-app` automatically installs some developer extensions by default. Sometimes you will want to add other
extensions. Let's say you want to enable [`react-perf-devtool`](https://github.com/nitin42/react-perf-devtool).

The first thing to to is to find the extension in the 
[Chrome Web Store](https://chrome.google.com/webstore/category/extensions). `react-erf-devtool` is here: 
`https://chrome.google.com/webstore/detail/react-performance-devtool/fcombecpigkkfcbfaeikoeegkmkjfbfm`. Once you have 
the extension's URL, find the extension's ID (the last part of the URL). In our case, it is 
`fcombecpigkkfcbfaeikoeegkmkjfbfm`.

Now you can open the [`src/main/index.js`](src/main/index.js) to apply the required changes:

```diff
  try {
      installExtension([
          REACT_PERF,
          REACT_DEVELOPER_TOOLS,
          REDUX_DEVTOOLS,
+         { id: 'fcombecpigkkfcbfaeikoeegkmkjfbfm', electron: process.versions.electron },
      ])
          .then(name => console.log(`Added Extension:  ${name}`))
          .catch(err => console.log('An error occurred: ', err));
  } catch (err) {}
``` 

Some extension also requires you to apply some changes to the renderer part. `react-perf-devtool` is one of those. Be 
sure to red the extension's documentation. For the record, here is how you would enable `react-perf-devtool` on the 
renderer side, in the [`src/renderer/index.js`](src/renderer/index.js) file:

```diff
  import reducers from 'shared/reducers';
+ import { registerObserver } from 'react-perf-devtool';

+ registerObserver();

  const store = createStore(reducers);
```

## 🎯 Test

### Scripts

* `test`: runs the full test suite (main and renderer processes).

### Directories

* the [`coverage/`](coverage/) directory will contain all the coverage report for each Jest test suite

## 🚀 Distribute

`create-electron-app` comes with a [default configuration](config/electron-builder.js) for 
[`electron-builder`](https://github.com/electron-userland/electron-builder). It will allow you to package your 
application for Window, MacOS and Linux (Debian, RHEL).

Before you package and publish your application, it is highly recommended that you test it as if it were packaged. Here
is how you would do that:

```shell
NODE_ENV=production npm run build
npm run electron
```

This will build the application in the `production` environment and run electron from the `dist/` directory (where the 
compiled sources are written). If you see nothing wrong, you can go ahead and package the application:

```shell
npm run package
```

If you are using the default configuration, you should get a `packages/` directory where all the artifact will be 
written: DMG, MacOS App, Deb, RPM, ...
