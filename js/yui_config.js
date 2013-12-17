YUI_config = {

    filter: 'raw',

    groups: {

        js: {

            base: '/yui-srsSteps/js/',

            modules: {
                srsApp: {
                    path: 'routerApp.js',
                    requires: ['app', 'coursePageView']
                },
                coursePageView: {
                    path: 'views/coursePageView.js',
                    requires: []
                }
            }
        }
    }
};
