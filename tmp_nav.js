(function(){
  var iframe = document.querySelector("iframe");
  if (!iframe) return "no iframe";
  var doc = iframe.contentDocument || iframe.contentWindow.document;
  var navButtons = [];
  var all = doc.querySelectorAll("a, button, [role=button]");
  for (var i = 0; i < all.length; i++) {
    var t = (all[i].textContent || "").trim().substring(0,40);
    if (t) navButtons.push(t);
  }
  return JSON.stringify(navButtons);
})()
