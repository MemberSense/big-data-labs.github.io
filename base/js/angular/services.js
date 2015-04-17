'use strict';

/* Services */

/*
var appServices = angular.module('appServices', ['ngResource']);

var serviceUrls = {
    item: 'http://localhost/smart/api/items/:itemID?s=0.0.0.3013&db=mygeorgia&columns=itemID%2Ctitle%2Ccontent',
    itemProduct: 'http://localhost/smart/api/products?s=0.0.0.3013&db=mygeorgia&sellerID=:itemID',
    product: 'http://localhost/smart/api/products/:productID?s=0.0.0.3013&db=mygeorgia'
};

if (location.host != 'localhost') {
    serviceUrls.item = 'http://review.georgiafacts.org/smart/api/items/:itemID?columns=itemID%2Ctitle%2Ccontent';
    serviceUrls.itemProduct = 'http://review.georgiafacts.org/smart/api/products?sellerID=:itemID';
    serviceUrls.product = 'http://review.georgiafacts.org/smart/api/products/:productID';
}

appServices.factory('Item', ['$resource',
  function ($resource) {
      return $resource(serviceUrls.item, {}, {
          query: { method: 'GET', params: {}, isArray: false },
          update: { method: "PUT" }
      });
  } ]);

  appServices.factory('ItemProduct', ['$resource',
  function ($resource) {
      return $resource(serviceUrls.itemProduct, {}, {
          query: { method: 'GET', params: {}, isArray: true }
      });
  } ]);

  appServices.factory('Product', ['$resource',
  function ($resource) {
      return $resource(serviceUrls.product, {}, {
          query: { method: 'GET', params: {}, isArray: false },
          update: { method: 'PATCH', params: { productID: '@productID' } }
      });
  } ]);
*/