
var head = document.getElementsByTagName('head')[0]
var link = document.createElement("link")
link.setAttribute("rel", "stylesheet")
link.setAttribute("type", "text/css")
link.setAttribute("href", "css/theme.css")
head.appendChild(link);

var body = document.getElementsByTagName('body')[0]
var link = document.createElement("link")

var newScript = document.createElement('script');
newScript.type = 'text/javascript';
newScript.src = 'js/jquery-1.12.3.js';
document.getElementsByTagName('head')[0].appendChild(newScript);
newScript = document.createElement('script');
newScript.type = 'text/javascript';
newScript.src = 'js/markdown.js';
document.getElementsByTagName('head')[0].appendChild(newScript);
newScript = document.createElement('script');
newScript.type = 'text/javascript';
newScript.src = 'js/purl.js';
document.getElementsByTagName('head')[0].appendChild(newScript);


function updateMarkdownLinks(markdownJson) {
    var refs = markdownJson[1].references;
    updateMarkdownLinks_Inner(markdownJson, refs);
}

function updateMarkdownLinks_Inner(markdownJson, refs) {
    for (var item = 0; item < markdownJson.length; item++) {
        if ( markdownJson[item] === "link_ref" ) {
            var ref = markdownJson[1].ref;
            // if there's no reference, define a wiki link
            var url = refs[ref];
            if (!url || !url.href || !(/^[\w\- ]+\.md$/.exec(url.href))) {
                continue;
            }
            refs[ref] = {
                href: "my.html?md=" + url.href.replace(/\s/, "+")
            };
        } else if ( Array.isArray(markdownJson[item])) {
            markdownJson[item].forEach(updateMarkdownLinks_Inner);
        }
    }
}

window.onload = function(){
    var tree = markdown.parse($("#markdown").text());
    updateMarkdownLinks(tree);
    var html = markdown.toHTML(tree);
    $("#markdown").html(html);
};
