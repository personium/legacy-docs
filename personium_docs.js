var p = {};
p.getLangRoot = function() {
  var path = location.pathname.split('/');
  return [path[0], path[1], path[2]].join('/');
};
p.setLang = function(lang) {
  var path = location.pathname.split('/');
  path[2] = lang;
  location.href = path.join('/'); 
};
p.setTitle = function() {
  // set the document title, using the content of h1 tag
  var h1 = document.getElementsByTagName('h1');
  // Default Documents if not a single h1 tag does not exist. 
  var t = 'Documents';
  if (h1.length == 1) {
    t = h1[0].innerText;
  }
  // Adding Prefix.
  document.title = t + ' - Personium';
};
window.addEventListener('load', p.setTitle);

p.toPage = function(relUrl) {
  location.href = p.getLangRoot() + relUrl; 
};

p.toApiRef = function(version) {
  if (version.innerText) {
    version = version.innerText;
  }
  location.href = p.getLangRoot() + "/apiref/" + version + "/000_Rest_API_Reference.html"; 
};
