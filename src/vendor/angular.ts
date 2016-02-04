if (!angular.version) {
  angular = window.angular
}

export const version = angular.version

//
// Angular Core Functions
//

export const bind = angular.bind.bind(angular) // TODO(): make sure this is doing what we think it is
export const bootstrap = angular.bootstrap.bind(angular)
export const copy = angular.copy.bind(angular)
export const element = angular.element.bind(angular)
export const equals = angular.equals.bind(angular)
export const extend = angular.extend.bind(angular)
export const forEach = angular.forEach.bind(angular)
export const fromJson = angular.fromJson.bind(angular)
export const identity = angular.identity.bind(angular)
export const injector = angular.injector.bind(angular)
export const isArray = angular.isArray.bind(angular)
export const isDate = angular.isDate.bind(angular)
export const isDefined = angular.isDefined.bind(angular)
export const isElement = angular.isElement.bind(angular)
export const isFunction = angular.isFunction.bind(angular)
export const isNumber = angular.isNumber.bind(angular)
export const isObject = angular.isObject.bind(angular)
export const isString = angular.isString.bind(angular)
export const isUndefined = angular.isUndefined.bind(angular)
export const lowercase = angular.lowercase.bind(angular)
export const merge = angular.merge.bind(angular)
export const module = angular.module.bind(angular)
export const noop = angular.noop.bind(angular)
export const reloadWithDebugInfo = angular.reloadWithDebugInfo.bind(angular)
export const toJson = angular.toJson.bind(angular)
export const uppercase = angular.uppercase.bind(angular)


//
// Angular Core Services
//

const ng = injector(['ng'])

export const $animate = ng.get('$animate')
export const $animateCss = ng.get('$animateCss')
export const $cacheFactory = ng.get('$cacheFactory')
export const $compile = ng.get('$compile')
export const $controller = ng.get('$controller')
export const $document = ng.get('$document')
export const $exceptionHandler = ng.get('$exceptionHandler')
export const $filter = ng.get('$filter')
export const $http = ng.get('$http')
export const $httpBackend = ng.get('$httpBackend')
export const $httpParamSerializer = ng.get('$httpParamSerializer')
export const $httpParamSerializerJQLike = ng.get('$httpParamSerializerJQLike')
export const $interpolate = ng.get('$interpolate')
export const $interval = ng.get('$interval')
export const $locale = ng.get('$locale')
//export const $location = ng.get('$location')
export const $log = ng.get('$log')
export const $parse = ng.get('$parse')
export const $q = ng.get('$q')
// export const $rootElement = ng.get('$rootElement')
export const $rootScope = ng.get('$rootScope')
export const $sce = ng.get('$sce')
export const $sceDelegate = ng.get('$sceDelegate')
export const $templateCache = ng.get('$templateCache')
export const $templateRequest = ng.get('$templateRequest')
export const $timeout = ng.get('$timeout')
export const $window = ng.get('$window')
export const $xhrFactory = ng.get('$xhrFactory')


/**
 * These angular services are not avaiable until after bootstrap. To use these
 * services add `es6-module-mode` as a dependency to your root module.
 */
var $$location    = () => { throw new Error('$location is not yet avaiable.') }
var $$rootElement = () => { throw new Error('$rootElement is not yet avaiable.') }

const es6Mode = module('es6-module-mode', [])

es6Mode.run(['$location', '$rootElement', (ngLocation, ngRootElement) => {
  $$location    = ngLocation
  $$rootElement = ngRootElement
}])

export const $location    = $$location
export const $rootElement = $$rootElement

export const es6ModuleMode = es6Mode.name
