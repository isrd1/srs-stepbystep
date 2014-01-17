YUI({
    filter: 'raw',
    base: '/yui-srsSteps/js/',
    modules: {
        srsApp: {
            path: 'routerApp.js',
            requires: ['app', 'coursePageView', 'courseList', 'studentList']
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
        },
        studentModel: {
            path: 'models/studentModel.js',
            requires: []
        },
        studentList: {
            path: 'models/studentList.js',
            requires: ['studentModel']
        },
        studentView: {
            path: 'views/studentView.js',
            requires: []
        },
        courseListView: {
            path: 'views/courseListView.js',
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
