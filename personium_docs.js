var path = document.location.pathname.split('/');
var pathCssCommon = [ path[0], "personium.css" ];
var pathCssLocale = [ path[0], path[1], "locale.css" ];

document.write('<link rel="stylesheet" href="' + pathCssCommon.join('/') + '" type="text/css" />');
document.write('<link rel="stylesheet" href="' + pathCssLocale.join('/') + '" type="text/css" />');

