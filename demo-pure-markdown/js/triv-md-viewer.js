
function renderMarkdown(markdownText) {
    var tree = markdown.parse(markdownText);
    updateMarkdownLinks(tree);
    return markdown.toHTML(tree);
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
