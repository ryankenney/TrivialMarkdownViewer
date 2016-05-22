
function renderMarkdown(markdownText) {
    var tree = markdown.parse(markdownText);
    updateMarkdownLinks(tree);

    readAllPages(tree);

    return markdown.toHTML(tree);
}

function updateMarkdownLinks(markdownJson) {
    if ( markdownJson[0] === "link" ) {
        var url = markdownJson[1];
        /* .md file with no slashes (in same directory) */
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

function getMarkdownLinks(markdownJson) {
    var markdownLinks = [];
    ( function inner(markdownJson, collectedMarkdownLinks) {
        if ( markdownJson[0] === "link" ) {
            var url = markdownJson[1];
            /* .md file with no slashes (in same directory) */
            if (!url || !url.href || !(/^[\w\- ]+\.md$/.exec(url.href))) {
                return;
            }
            collectedMarkdownLinks.push(url.href);
        } else {
            for (var item = 1; item < markdownJson.length; item++) {
                if (Array.isArray(markdownJson[item])) {
                    markdownJson[item].forEach(
                        function (element) { inner(element, collectedMarkdownLinks) }
                    );
                }
            }
        }
    }) (markdownJson, markdownLinks);
    return markdownLinks;
}

function readAllPages(startPage, onComplete) {
    var pages = {};
    var outstandingRequests = 0;

    function markRequestStart() {

        // TODO [rkenney]: Remove debug
        console.log("[outstandingRequests] ++ to ["+outstandingRequests+"]");

        outstandingRequests++;
    }

    function markRequestComplete() {

        // TODO [rkenney]: Remove debug
        console.log("[outstandingRequests] -- to ["+outstandingRequests+"]");

        outstandingRequests--;
        if (outstandingRequests < 1) { onComplete(pages); }
    }

    function processPage(pageName) {

        // TODO [rkenney]: Remove debug
        console.log("["+pageName+"] Processing");

        markRequestStart();

        jQuery.get(pageName, function(data) {

            // TODO [rkenney]: Remove debug
            console.log("["+pageName+"] Downloaded");

            pages[pageName] = data;
            var tree = markdown.parse(data);
            var pageLinks = getMarkdownLinks(tree);

            pageLinks.forEach(function (link) {
                if (!pages[link]) {
                    processPage(link);
                }
            })

        }).fail(function() {

            // TODO [rkenney]: Remove debug
            console.log("["+pageName+"] Not found");

        }).always(function() {
            markRequestComplete();
        });
    }

    processPage(startPage);
}
