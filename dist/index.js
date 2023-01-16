'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var React = require('react');
var reactRouterDom = require('react-router-dom');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var React__default = /*#__PURE__*/_interopDefaultLegacy(React);

/******************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */

var __assign = function() {
    __assign = Object.assign || function __assign(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};

function __rest(s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
}

var RouperContext = /*#__PURE__*/React.createContext({});
var RouperProvider = function RouperProvider(_a) {
  var client = _a.client,
    props = __rest(_a, ["client"]);
  var _b = React.useState(client.getClaims),
    claims = _b[0],
    _setClaims = _b[1];
  function setClaims(passClaims) {
    _setClaims(function () {
      client.setClaims(passClaims);
      return passClaims;
    });
  }
  return /*#__PURE__*/React__default["default"].createElement(RouperContext.Provider, {
    value: {
      claims: claims,
      setClaims: setClaims,
      client: client
    }
  }, props.children);
};

var ROUPER_STORAGE_KEY_CLAIMS = 'ROUPER_NAVIGATION/claims';

var RouperClient = function () {
  function RouperClient(params) {
    this.routes = [];
    this.storageKey = ROUPER_STORAGE_KEY_CLAIMS;
    this.storage = window.localStorage;
    this.setStorageKey(params === null || params === void 0 ? void 0 : params.storageKeyClaims);
    this.setStorage(params === null || params === void 0 ? void 0 : params.storage);
  }
  RouperClient.prototype.setStorageKey = function (storageKey) {
    if (storageKey) {
      this.storageKey = storageKey;
    }
  };
  RouperClient.prototype.getStorageKey = function () {
    return this.storageKey;
  };
  RouperClient.prototype.setStorage = function (storage) {
    if (storage) {
      this.storage = storage;
    } else {
      this.storage = window.localStorage;
    }
  };
  RouperClient.prototype.getStorage = function () {
    return this.storage;
  };
  RouperClient.prototype.setRoutes = function (routes) {
    this.routes = routes;
  };
  RouperClient.prototype.getRoutes = function () {
    return this.routes;
  };
  RouperClient.prototype.setClaims = function (claims) {
    var storage = this === null || this === void 0 ? void 0 : this.getStorage();
    if (storage) {
      if (claims) {
        storage.setItem(this.getStorageKey(), JSON.stringify(claims));
      } else {
        storage.removeItem(this.getStorageKey());
      }
    }
  };
  RouperClient.prototype.getClaims = function () {
    var storage = this === null || this === void 0 ? void 0 : this.getStorage();
    if (!storage) return null;
    var claimsStorage = storage.getItem(this.getStorageKey());
    return claimsStorage ? JSON.parse(claimsStorage) : null;
  };
  return RouperClient;
}();

function loader(args, route, storage) {
  if (!storage) return !!route.loader && route.loader(args);
  var claimsStore = storage.getItem(ROUPER_STORAGE_KEY_CLAIMS);
  var claims = [];
  if (claimsStore) {
    claims = JSON.parse(claimsStore);
  }
  if (!route.claims || Array.isArray(route.claims) && claims.length && (route.hasSomeClaims ? route.claims.some(function (claim) {
    return claims.includes(claim);
  }) : route.claims.every(function (claim) {
    return claims.includes(claim);
  }))) {
    return !!route.loader && route.loader(args);
  }
  throw reactRouterDom.json({
    error: 'You do not have access'
  }, {
    status: 401,
    statusText: 'Unauthorized'
  });
}

function withRouter(routes, storage) {
  return routes.reduce(function (prevRoutes, _a) {
    var claims = _a.claims,
      children = _a.children,
      paths = _a.paths,
      hasSomeClaims = _a.hasSomeClaims,
      outhers = _a.outhers,
      route = __rest(_a, ["claims", "children", "paths", "hasSomeClaims", "outhers"]);
    if (paths && Array.isArray(paths)) {
      paths.forEach(function (path) {
        prevRoutes.push(__assign(__assign({}, route), {
          path: path,
          loader: claims ? function (args) {
            return loader(args, __assign(__assign({}, route), {
              claims: claims,
              hasSomeClaims: hasSomeClaims,
              outhers: outhers
            }), storage);
          } : route === null || route === void 0 ? void 0 : route.loader,
          children: (children === null || children === void 0 ? void 0 : children.length) ? withRouter(children, storage) : undefined
        }));
      });
      return prevRoutes;
    }
    return prevRoutes.concat(__assign(__assign({}, route), {
      loader: claims ? function (args) {
        return loader(args, __assign(__assign({}, route), {
          claims: claims,
          hasSomeClaims: hasSomeClaims,
          outhers: outhers
        }), storage);
      } : route === null || route === void 0 ? void 0 : route.loader,
      children: (children === null || children === void 0 ? void 0 : children.length) ? withRouter(children, storage) : undefined
    }));
  }, []);
}

function useRouperClaimsState() {
  var _a = React.useContext(RouperContext),
    claims = _a.claims,
    setClaims = _a.setClaims;
  return [claims, setClaims];
}

function useRouperClient() {
  var client = React.useContext(RouperContext).client;
  return client;
}

function useRouperRouteMatch() {
  var _a;
  var rouperClient = useRouperClient();
  var routes = rouperClient.getRoutes();
  var _b = React.useState([]),
    paths = _b[0],
    setPaths = _b[1];
  React.useEffect(function () {
    var location = window.location;
    if (location) {
      var locationPaths = [];
      if (location.pathname === '/') {
        locationPaths = [location.pathname];
      } else {
        locationPaths = location.pathname.split('/').slice(1);
      }
      setPaths(locationPaths);
    }
  }, [(_a = window === null || window === void 0 ? void 0 : window.location) === null || _a === void 0 ? void 0 : _a.pathname]);
  function findRoute(routesToFind, path) {
    var _a;
    return (_a = routesToFind.find(function (route) {
      if (route.path) {
        return route.path === path;
      } else if (route.paths) {
        return route.paths.includes(path);
      }
    })) !== null && _a !== void 0 ? _a : null;
  }
  if (!paths.length) {
    return findRoute(routes, '/');
  }
  if (paths.length) {
    return paths.reduce(function (acc, path) {
      if (!acc) {
        return findRoute(routes, path);
      }
      if (!!acc && acc.children) {
        return findRoute(acc.children, path);
      }
      return acc;
    }, null);
  }
  return null;
}

function useRouperRoutes() {
  var rouperClient = useRouperClient();
  return rouperClient.getRoutes();
}

function useWithRouter(routes) {
  var rouperClient = useRouperClient();
  rouperClient.setRoutes(routes);
  return withRouter(routes, rouperClient.getStorage());
}

exports.RouperClient = RouperClient;
exports.RouperProvider = RouperProvider;
exports.routeLoader = loader;
exports.useRouperClaimsState = useRouperClaimsState;
exports.useRouperClient = useRouperClient;
exports.useRouperMatch = useRouperRouteMatch;
exports.useRouperRoutes = useRouperRoutes;
exports.useWithRouter = useWithRouter;
exports.withRouter = withRouter;
//# sourceMappingURL=index.js.map
