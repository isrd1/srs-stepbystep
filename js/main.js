YUI().use('srsApp', function (Y) {
        var srsApp = new Y.SRSApp({
                transitions: true,
                container    : '#wrapper',
                viewContainer: '#contents'
            }); // create a new SJSApp instance
        srsApp.render();
});
