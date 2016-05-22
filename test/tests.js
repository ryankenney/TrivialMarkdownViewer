QUnit.test( "readAllPages_Nested: readAllPages() walks a tree to great-grandchildren", function( assert ) {
    var done = assert.async();
    readAllPages('testReadAllPages_Nested_root.md', function(pages) {
        assert.equal(Object.keys(pages).length, 7);
        assert.ok(pages['testReadAllPages_Nested_root.md']);
        assert.ok(pages['testReadAllPages_Nested_A.md']);
        assert.ok(pages['testReadAllPages_Nested_B.md']);
        assert.ok(pages['testReadAllPages_Nested_A-A.md']);
        assert.ok(pages['testReadAllPages_Nested_A-B.md']);
        assert.ok(pages['testReadAllPages_Nested_A-A-A.md']);
        assert.ok(pages['testReadAllPages_Nested_B-A.md']);
        done();
    });
});

QUnit.test( "readAllPages_Duplicates: readAllPages() handles duplicates as single entry", function( assert ) {
    var done = assert.async();
    readAllPages('testReadAllPages_Duplicates_root.md', function(pages) {
        assert.equal(Object.keys(pages).length, 4);
        assert.ok(pages['testReadAllPages_Duplicates_root.md']);
        assert.ok(pages['testReadAllPages_Duplicates_Child.md']);
        assert.ok(pages['testReadAllPages_Duplicates_Linked-on-multiple-pages.md']);
        assert.ok(pages['testReadAllPages_Duplicates_Linked-multiple-times-on-single-page.md']);
        done();
    });
});

QUnit.test( "readAllPages_Cycles: readAllPages() handles cyclical references between pages", function( assert ) {
    var done = assert.async();
    readAllPages('testReadAllPages_Cycles_root.md', function(pages) {
        assert.equal(Object.keys(pages).length, 6);
        assert.ok(pages['testReadAllPages_Cycles_root.md']);
        assert.ok(pages['testReadAllPages_Cycles_Links-to-root.md']);
        assert.ok(pages['testReadAllPages_Cycles_Self-link.md']);
        assert.ok(pages['testReadAllPages_Cycles_3-page-cycle_Page-1.md']);
        assert.ok(pages['testReadAllPages_Cycles_3-page-cycle_Page-2.md']);
        assert.ok(pages['testReadAllPages_Cycles_3-page-cycle_Page-3.md']);
        done();
    });
});

QUnit.test( "readAllPages_Broken-link: readAllPages() handles missing page links by omission", function( assert ) {
    var done = assert.async();
    readAllPages('testReadAllPages_Broken-link_root.md', function(pages) {
        assert.equal(Object.keys(pages).length, 2);
        assert.ok(pages['testReadAllPages_Broken-link_root.md']);
        assert.ok(pages['testReadAllPages_Broken-link_Child.md']);
        assert.notOk(pages['testReadAllPages_Broken-link_Missing-root-link.md']);
        assert.notOk(pages['testReadAllPages_Broken-link_Missing-child-link.md']);
        done();
    });
});

