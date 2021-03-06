---
layout: page
title: ng-bar
permalink: /ng-bar/
menuVisible: 0
hideHeader: 1
excerpt: "Helps to debug Angular 1.x applications"
---

# Angular Debug Toolbar

See images below

[GitHub](https://github.com/lotas/ng-bar)

## Features

Just though it would be nice to have such tool that would show some usefull info for an angular.js developer:

* memory used (only in chrome)
* Scopes count
* Scopes watchers count (to make you feel bad for having lots of them)
* Angular version
* Angular modules
* Angular services
* Angular forms 
* ui-router routes list (TODO ngRoute)
* active http requests
* errors happening
* included templates ($tempalteCache fun)


## Build

Build with: 

	npm run build

## Usage

Simply add this: 

	<script src="ng-bar.js"></script>


## Ideas from 

https://github.com/paulirish/memory-stats.js

https://github.com/livingobjects/angular-memory-stats

https://github.com/kentcdodds/ng-stats

http://blog.ionic.io/angularjs-console/


## License

MIT


### Why

Despite the fact that we have an awesome Batarang Angular.js chrome extension, we still need more information during development.
We need to see memory information, scopes information and various additional info, that is not directly accessible in other tools

## Images

![Forms](/img/ng-bar/ng-bar-forms.png)

![Modules](/img/ng-bar/ng-bar-modules.png)

![Services](/img/ng-bar/ng-bar-module-services.png)

![Routes](/img/ng-bar/ng-bar-routes.png)

![services](/img/ng-bar/ng-bar-services.png)