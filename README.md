# Angular boilerplate

## Install

#### Gulp
```
npm install
```

#### Bower
```
bower install
```

## Cmd

#### Development & serve
```
gulp
```

#### Build production
```
gulp build
```


## Structure /src
```
.
├── app
│   ├── app.module.js
|   ├── app.routes.js
|   ├── app.template.js // Precompiled template cache
│   ├── common
│   │   └── directives
│   │       └── name-directive
│   ├── partials
│   │   └── header
│   │       ├── header.less
│   │       └── header.tpl.html
│   └── components
│       ├── home
│       │   ├── home.less
│       │   ├── home.tpl.html
│       │   └── homeCtrl.js
│       └── 404
│           └── 404.tpl.html
├── assets
│   ├── css
│   │   └── master.css // App compiled css
|   ├── less
│   │   ├── reset.less
│   │   ├── variables_mixins.less
│   │   ├── typography.less
│   │   ├── layout.less
│   │   └── master.less // Common css properties
|   └── img // All image assets
└── lib // Bower directory
```

## Structure /dist (after build)
```
.
├── index.html
└── assets
    ├── css
    │   └── master.css
    ├── js
    │   └── app.js
    └── img
```
