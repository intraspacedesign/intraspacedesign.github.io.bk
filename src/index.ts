import { module } from './vendor/angular'

class Main {

  static $inject = ['$rootScope']

  constructor($rootScope) {
    $rootScope.display = ''
  }
}

const mod = module('app', []).controller('Main', Main)

export default module.name