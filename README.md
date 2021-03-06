Trivial Markdown Viewer
====================

Overview
--------------------

This is a proof of concept of what you can do to create markdown viewer (poor man's wiki) with nothing but a browser.

At the end of the day, I created something very useful using just a little custom code along side [markdown-js](https://github.com/evilstreak/markdown-js).

If you're willing to jump to using a web server (versus using "file://" urls), the feature set opens up considerably, going as far as adding a browser-based search engine.
The reason you need a web server isnt' that the server is doing any processing. It's simply to get around the fact that the browser is prevented from loading "file://"
URLs dynamically for security reasons.

Comparison of the Approaches
--------------------

Benefits of Approach 1

* You can write pure (no html wrapper) markdown text files, with a ".md" extension.
* It is possible to do more dynamic things, like generate a search index across all files.

Benefits of Approach 2

* You can view the pages via a local filesystem (such as a DVD), so no webserver is needed.


Approach 1: Write Pure Markdown Documents and Load them Dynamically
--------------------

In this approach, we have a single html file (index.html), which takes a query parameter
of "?md=" to specify the document to view.

There is a full example of this approach [here](http://ryankenney.github.io/TrivialMarkdownViewer/demo-pure-markdown/index.html?md=README.md).

* And a sample of a regex-based search engine [here](http://ryankenney.github.io/TrivialMarkdownViewer/demo-pure-markdown/search.html).

Approach 2: Write Markdown in Thinly Wrapped HTML Files
--------------------

In this approach, we have a ".md.html" file for each page,
which contains a very thin html wrapper around the markdown content.

For example:

```
<html><script src="js/triv-md-viewer-bootstrap.js"></script><div id="markdown">
<!-- END HTML HEADER -->

All of your markdown content goes here...

<!-- BEGIN HTML FOOTER -->
</div></html>
```

There is a full example of this approach [here](http://ryankenney.github.io/TrivialMarkdownViewer/demo-local-filesystem/README.md.html).

Downloading the Source
--------------------

Just in case it's confusing, most of the source is located in the "gh-pages" branch, which is where githug lets you render html, as opposed to viewing raw text.
