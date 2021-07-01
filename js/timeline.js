(function () {
  "use strict";

  // define variables
  var items = document.querySelectorAll(".timeline li");

  // check if an element is in viewport
  // http://stackoverflow.com/questions/123999/how-to-tell-if-a-dom-element-is-visible-in-the-current-viewport
  function isElementInViewport(el) {

    var rect = el.getBoundingClientRect();

    return (
      rect.top >= 0 &&
      rect.left >= 0 &&
      rect.bottom <=
      (window.innerHeight || document.documentElement.clientHeight) &&
      rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
  }

  function callbackFunc() {
    var items = document.querySelectorAll(".timeline li");
    console.log("items: ",items);
    
    //items[0].classList.add("in-view");
    
    
    for (var i = 0; i < items.length; i++) {
      if (isElementInViewport(items[i])) {
        items[i].classList.add("in-view");
      } else {
        items[i].classList.remove("in-view");
      }
      if (i == 0) {
        console.log("never happens")
        items[i].classList.add("in-view");
      }



    }
  }

  // listen for events

  window.addEventListener("load", callbackFunc);
  window.addEventListener("resize", callbackFunc);
  window.addEventListener("scroll", callbackFunc);
  window.addEventListener("load",()=>{
    console.log("window.load listener: ");
    callbackFunc();

  })

})();



