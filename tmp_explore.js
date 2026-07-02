(function(){
  var iframe = document.querySelector("iframe");
  if (!iframe) return "no iframe";
  var doc = iframe.contentDocument || iframe.contentWindow.document;
  var info = {
    url: (iframe.contentWindow||{}).location ? iframe.contentWindow.location.href : "unknown",
    scripts: doc.querySelectorAll("script").length,
    imgs: doc.querySelectorAll("img").length,
    bodyLen: (doc.body && doc.body.innerText || "").length
  };
  return JSON.stringify(info);
})()
