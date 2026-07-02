(function(){
  var iframe = document.querySelector("iframe");
  if (!iframe) return "no iframe";
  var w = iframe.contentWindow;
  // Check for global variables that might contain book data
  var globals = [];
  for (var key in w) {
    if (key.indexOf("page") >= 0 || key.indexOf("book") >= 0 || key.indexOf("data") >= 0 || key.indexOf("json") >= 0 || key.indexOf("content") >= 0) {
      if (key.length < 30) globals.push(key);
    }
  }
  return JSON.stringify(globals.slice(0,30));
})()
