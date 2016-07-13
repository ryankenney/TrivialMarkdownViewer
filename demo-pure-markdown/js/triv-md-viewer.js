
function renderMarkdown(markdownText) {
	// By specifying 'Maruku', instead of the default of 'Gruber',
	// we seem to get proper table rendering.
    var tree = markdown.parse(markdownText, 'Maruku');
    updateMarkdownLinks(tree);
    var htmlTree = markdown.toHTMLTree(tree);
	injectHeadingAnchors(htmlTree);

	var headerTree = collectHeaderTree(tree, ["div", {class:"header_index"}]);
	var headerHtmlTree = markdown.toHTMLTree(headerTree);

	var hasAtLeastThreeEntries = headerTree.length > 5 /* 3 items plus "div" and attributes */;
	if (hasAtLeastThreeEntries) {
		htmlTree[0] = "div";
		htmlTree = ["html", headerHtmlTree, htmlTree];
	}
	
	return markdown.renderJsonML(htmlTree);
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

function collectHeaderTree(markdownJson, headerTree) {
    // NOTE: We limit to levels h1-h3 to prevent noisy header index
    if ( markdownJson[0] === "header" && markdownJson[1].level < 4) {
		var escapedTitle = markdownJson[2].replace(/\W+/g, "_")
		headerTree.push(
			["li", 
				{class:"toc"+markdownJson[1].level},
				["a", 
					{href:"#h"+markdownJson[1].level+"_"+escapedTitle},
					markdownJson[2]]]);
    } else {
        for (var item = 1; item < markdownJson.length; item++) {
            if (Array.isArray(markdownJson[item])) {
				collectHeaderTree(markdownJson[item], headerTree);
            }
        }
    }
	return headerTree;
}

function injectHeadingAnchors(htmlTree) {
    if (htmlTree[0] === "h1" ||
		htmlTree[0] === "h2" ||  
		htmlTree[0] === "h3" ||  
		htmlTree[0] === "h4" ||  
		htmlTree[0] === "h5" ||  
		htmlTree[0] === "h6")
	{
		var escaped = htmlTree[1].replace(/\W+/g, "_")
		htmlTree[1] = ["a", {name:htmlTree[0]+"_"+escaped, class:"heading"}, htmlTree[1]];
    } else {
        for (var item = 1; item < htmlTree.length; item++) {
            if (Array.isArray(htmlTree[item])) {
                injectHeadingAnchors(htmlTree[item]);
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
