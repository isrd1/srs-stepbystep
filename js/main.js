YUI({
    filter: 'raw',
    base: '/yui-srsSteps/js/',
    modules: {
        srsApp: {
            path: 'routerApp.js',
            requires: ['app', 'coursePageView', 'courseList']
        },
        courseModel: {
            path: 'models/courseModel.js',
            requires: []
        },
        courseList: {
            path: 'models/courseList.js',
            requires: ['courseModel']
        },
        coursePageView: {
            path: 'views/coursePageView.js',
            requires: []
        }
    }
}).use('srsApp', function (Y) {
        var srsApp = new Y.SRSApp({
                transitions: true,
                container    : '#wrapper',
                viewContainer: '#contents'
            }); // create a new SJSApp instance
        srsApp.render();
});
