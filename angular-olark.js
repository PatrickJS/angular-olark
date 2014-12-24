(function (root, factory) {
  // AMD
  if (typeof define === 'function' && define.amd) {
    define(['angular', 'olark'], function (angular, olark) {
      return factory({}, angular, olark);
    });
  }
  // Node.js
  else if (typeof exports === 'object') {
    module.exports = factory({}, require('angular'), require('olark'));
  }
  // Angular
  else if (angular) {
    factory(root, root.angular, root.olark);
  }
}(this, function (global, angular, olark) {
  // if (!olark && console && console.warn) { return console.warn('Please include Olark SDK before this module '); }
  if (olark && global && !global.olark) { global.olark = olark; }

  function $OlarkProvider() {
    var provider = this;

    provider.development = false;
    provider.olark_id = null;
    provider.configure = olarkAs('configure');


    if (!provider.development) {
      if (global.olark && global.olark.identify && provider.olark_id) {
        global.olark.identify(provider.olark_id);
      }
    }


    function olarkAs(type) {
      return function() {
        if (!type){
          global.olark.apply(global.olark, arguments);
        }
        if (global.olark[type]) {
          global.olark[type].apply(global.olark, arguments);
        }
      };
    }

    provider.$get = ['$log', function($log) {
      function logAs(type) {
        return function() {
          $log.log('Olark: '+(type||''), arguments);
        };
      }

      var fakeOlark = logAs();
      fakeOlark.identify = logAs('identify');
      fakeOlark.configure = logAs('configure');

      var $olark = olarkAs();
      $olark.configure = olarkAs('configure');
      $olark.identify = olarkAs('identify');

      var isDev = (provider.development);

      return (isDev) ? fakeOlark : $olark;

   }];// end $get

  } // end provider

  angular.module('ngOlark', [])
  .provider('$olark', $OlarkProvider)
  .provider('Olark',  $OlarkProvider);
  
  angular.module('angular-olark', ['ngOlark']);

}));
