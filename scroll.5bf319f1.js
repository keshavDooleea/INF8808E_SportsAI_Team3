// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  var error;
  for (var i = 0; i < entry.length; i++) {
    try {
      newRequire(entry[i]);
    } catch (e) {
      // Save first error but execute all entries
      if (!error) {
        error = e;
      }
    }
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  parcelRequire = newRequire;

  if (error) {
    // throw error from earlier, _after updating parcelRequire_
    throw error;
  }

  return newRequire;
})({"Sx64":[function(require,module,exports) {
// retrieve DOM HTML elements
var mainContainer = document.querySelector("main");
var dots = document.querySelectorAll(".dots-container .dot");
var chartNb = document.querySelector("#chart-nb"); // ids of 4 sections each holding a svg

var sectionIds = ["#radar-chart", "#stacked-chart", "#bar-chart", "#line-chart"]; // variables

var dotActiveClass = "active";
var scrollOffset = 1;
main();

function main() {
  activateDot(0); // get the rectangle attributes (x, y, width, height, top, bottom) of each sections

  var sectionsBoundingBoxes = sectionIds.map(function (sectionId, index) {
    return {
      sectionId: sectionId,
      dot: dots[index],
      boundingBox: document.querySelector(sectionId).getBoundingClientRect()
    };
  }); // add listener to main container to update window's hash and sidebar dots

  mainContainer.addEventListener("scroll", function () {
    sectionsBoundingBoxes.forEach(function (box, index) {
      var rect = box.boundingBox;
      var offsetTop = mainContainer.scrollTop;

      if (offsetTop > rect.top - scrollOffset && offsetTop < rect.bottom - scrollOffset) {
        box.dot.classList.add(dotActiveClass);
        setChartNb(index + 1);
      } else {
        box.dot.classList.remove(dotActiveClass);
      }
    });
  });
  dots.forEach(function (dot, index) {
    dot.addEventListener("click", function () {
      activateDot(index);
    });
  });

  function activateDot(index) {
    dots.forEach(function (dot, dotIndex) {
      if (index === dotIndex) {
        dots[index].classList.add(dotActiveClass);
        setChartNb(index + 1);
        document.querySelector(sectionIds[index]).scrollIntoView();
      } else {
        dot.classList.remove(dotActiveClass);
      }
    });
  }

  function setChartNb(number) {
    chartNb.textContent = number;
  }
}
},{}]},{},["Sx64"], null)
//# sourceMappingURL=scroll.5bf319f1.js.map