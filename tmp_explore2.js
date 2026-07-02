(function(){
  var iframe = document.querySelector("iframe");
  if (!iframe) return "no iframe";
  var doc = iframe.contentDocument || iframe.contentWindow.document;
  // Check the class_iframe more carefully
  var cif = doc.getElementById("class_iframe");
  if (!cif) return "no class_iframe";
  try {
    var cw = cif.contentWindow;
    var cd = cw.document;
    return JSON.stringify({
      readyState: cd.readyState,
      url: cw.location.href,
      bodyTextLen: (cd.body && cd.body.innerText || "").length,
      htmlLen: (cd.documentElement && cd.documentElement.innerHTML || "").length,
      scripts: cd.querySelectorAll("script").length,
      imgs: cd.querySelectorAll("img").length
    });
  } catch(e) {
    return "class_iframe error: " + e.message;
  }
})()
