loadCss('css/theme.css');
loadJs('js/jquery-1.12.3.js');
loadJs('js/markdown.js');
loadJs('js/purl.js');
loadJs('js/triv-md-viewer.js');

window.onload = function(){
    var html = renderMarkdown($("#markdown").text());
    $("#markdown").html(html);
};

function loadJs(scriptFile) {
    var newScript = document.createElement('script');
    newScript.type = 'text/javascript';
    newScript.src = scriptFile;
    document.getElementsByTagName('head')[0].appendChild(newScript);
}

function loadCss(cssFile) {
    var link = document.createElement("link");
    link.setAttribute("rel", "stylesheet");
    link.setAttribute("type", "text/css");
    link.setAttribute("href", cssFile);
    document.getElementsByTagName('head')[0].appendChild(link);
}
