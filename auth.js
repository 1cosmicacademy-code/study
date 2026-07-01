const buttons = document.querySelectorAll('button');
const results = [];
buttons.forEach(b => {
  results.push({
    text: b.textContent.trim().substring(0, 50),
    type: b.type,
    visible: b.offsetParent !== null
  });
});
return JSON.stringify(results);
