
var setLang = function(lang) {
  var path = location.pathname.split('/');
  path[2] = lang;
  location.href = path.join('/'); 
};

document.addEventListener('DOMContentLoaded', function() {
  // set the document title, using the content of h1 tag
  var h1 = document.getElementsByTagName('h1');
  // Default Documents if not a single h1 tag does not exist. 
  var t = 'Documents';
  if (h1.length == 1) {
    t = h1[0].innerText;
  }
  // Adding Prefix.
  document.title = t + ' - Personium';
})
