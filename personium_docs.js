var path = location.pathname.split('/');
var pathCssCommon = [ path[0], path[1], "personium.css" ];
var pathCssLocale = [ path[0], path[1], path[2], "locale.css" ];

document.write('<link rel="stylesheet" href="' + pathCssCommon.join('/') + '" type="text/css" />');
document.write('<link rel="stylesheet" href="' + pathCssLocale.join('/') + '" type="text/css" />');

var setLang = function(lang) {
  path[2] = lang;
  location.href = path.join('/'); 
};

document.addEventListener('DOMContentLoaded', function() {
  var h1 = document.getElementsByTagName('h1');
  var t = 'Documents';
  if (h1.length == 1) {
    t = h1[0].innerText;
  }
  document.title = t + ' - Personium';
})
