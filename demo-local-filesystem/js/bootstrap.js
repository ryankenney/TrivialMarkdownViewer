loadCss('css/theme.css');
loadJs('js/jquery-1.12.3.js');
loadJs('js/markdown.js');
loadJs('js/purl.js');

window.onload = function(){
    var tree = markdown.parse($("#markdown").text());
    updateMarkdownLinks(tree);
    var html = markdown.toHTML(tree);
    $("#markdown").html(html);
};

function updateMarkdownLinks(markdownJson) {
    if ( markdownJson[0] === "link" ) {
        var url = markdownJson[1];
        if (!url || !url.href || !(/^[\w\- ]+\.md$/.exec(url.href))) {
            return;
        }
        markdownJson[1].href = "index.html?md=" + encodeURIComponent(url.href);
    } else {
        for (var item = 1; item < markdownJson.length; item++) {
            if (Array.isArray(markdownJson[item])) {
                markdownJson[item].forEach(updateMarkdownLinks);
            }
        }
    }
}

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
