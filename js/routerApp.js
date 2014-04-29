/*jslint devel: true,  undef: true, newcap: true, strict: true, maxerr: 50 */

/*global YUI*/

/**
 * The srsApp module is the controller or router which will handle all requests, creating the appropriate
 * models, lists and views as required by each request.
 * @module srsApp
*/

YUI().add('srsApp', function(Y) {
    'use strict';
    /**
     * The SRSApp class is the controller or router
     * @class SRSApp
     * @extends App
     * @constructor
     */
    Y.SRSApp = Y.Base.create('srsApp', Y.App, [], {
        searchStr: null,
        
        initializer: function() {
           this.once('ready', function(e) {
               Y.one('#searchBtn').on('click', function (e) {
                   var st = Y.one('#searchText');
                   this.findCourses(st.get('value'));
               }, this);
               Y.on('srsapp:courseChange', this.navigateToStudents, this);

               if (this.hasRoute(this.getPath())) {
                   this.dispatch();
               }
           });
        },

        /**
         *  This is where we can declare our page-level views and define the relationship between
         *  the "pages" of our application. We can later use the `showView()` method to create and
         *  display these views.
         *  @property views
         *  @type {object}
        */
        views: {
            coursePage: {  // only one view since this will manage subviews for course & student
                type: Y.CoursePageView,
                preserve: true
            }
        },
        
        findCourses: function(searchStr) {
            if (searchStr) {
                this.navigate('/yui-srsSteps/courses/search/' + searchStr);
            }
        },

        navigateToStudents: function(e) {
            Y.log('navigate to students on course ' + e.course.coursecode);
            Y.log(e);
            this.navigate('/yui-srsSteps/courses/' + e.course.coursecode + '/');
        },

        /**
         * Will load the models for each student into a modelList given a coursecode
         * @method getStudents
         * @param {object} req The http request
         * @param {object} res A resource object
         * @param {function} next If the callback for the path is an array of methods this contains the next method to call
         */
        getStudents: function(req, res, next) {
            var coursecode = req.params.course || null,
                students = this.get('students');
            // put the students in the request so it'll be passed on to the next part of the route
            req.students = students;
            req.coursecode = coursecode;
            students.load({coursecode:coursecode}, function() {
                students.logger();
                next();
            });
         },

        /**
         * Will load the models for each course into a modelList
         * @method getCourses
         * @param {object} req The http request
         * @param {object} res A resource object
         * @param {function} next If the callback for the path is an array of methods this contains the next method to call
         */
        getCourses: function(req, res, next) {
            var courses = this.get('courses'),   // defined in ATTRS section below
                searchStr,
                options = {};
            Y.log('in getCourses');
            Y.log(req);
            // add the courses to the request object so it'll be passed on to the next part of the route
            req.courses = courses;
            searchStr = req.params.searchstr || null;
            // make sure next() is a function by giving it a default value of an empty function if it's not a function already
            Y.Lang.isFunction(next) || (next = function() {} );

            if (courses.isEmpty() || searchStr !== this.searchStr) {       // there are no courses already loaded then
                if (searchStr !== null) {
                    options.action = 'search';
                    options.filter = 'filter=' + searchStr;
                    Y.one('#searchText').set('value', searchStr);  // in case the page is reloaded put the search term back in the form -dodgy really that here in the router we're altering the interface
                } else {
                    options.action = 'list';
                }
                courses.load(options, function() { // call course load (which will sync etc)
                    courses.logger();      // debug by calling logger()
                    next();                // call next only when the courses are loaded
                });
            } else {                       // already loaded the courses so call next()
                next();
            }
            this.searchStr = searchStr;   // store the local search string into the class property so it persists and we can compare next time.
        },

        /**
         * Will show the course page view to show courses
         * @method showCoursePage
         * @param {object} req
         * @param {object} res
         * @param {function} next
         */
        showCoursePage: function(req, res, next) {
            var viewConfig = null;  // we might invoke the view with or without students so we'll use a config object to pass as an argument for clarity

            if (req.coursecode) {
                viewConfig = {
                        courseList: req.courses,
                        coursecode: req.params.course,
                        studentList: req.students
                };
            } else {
                viewConfig = {
                        coursecode: null,
                        courseList: req.courses
                };
            }
            Y.log('opening course list view using this request:');
            Y.log(req);
            /**
             * there are various possible options, only show courses, show courses and students etc, read the comments for more detail
             */
            try {
                // there is a coursePage instance and a course code but the subView hasn't yet been displayed
                if (this.views.coursePage.instance && req.coursecode && !this.alreadyRenderedStudents) {
                    this.views.coursePage.instance.loadSubView(viewConfig).render(viewConfig.coursecode);
                    this.alreadyRenderedStudents = true;
                }
                // this isn't a coursePage instance but there is a course code so it's a deep link and we need to show both courses and the subView
                else if (!this.views.coursePage.instance && req.coursecode) {
                    this.showView('coursePage', viewConfig);
                    this.views.coursePage.instance.loadSubView(viewConfig).render();
                }
                // we have a course view & a studentView but no course code so we want to remove the subview and reset the alreadyRenderedStudents flag
                else if (this.views.coursePage.instance && this.views.coursePage.instance.studentView && !req.coursecode) {
                    this.views.coursePage.instance.unloadSubView().render();
                    this.alreadyRenderedStudents = false;
                }
                // it's a link just to courses since there's no course code
                else {
                    // don't bother showing the view if we're already showing it
                    //if (this.get('activeView') !== this.views.coursePage.instance) {   // this line and the following work the same but I think the instanceof approach is better
                    if (!(this.get('activeView') instanceof this.views.coursePage.type)) {
                        this.showView('coursePage', viewConfig, {update: true, render: true});
                    }
                }
            } catch (e) {  // in case there's any error just silently display it.
                Y.log(e.message);
            }
            // make sure next() is a function by giving it a default value of an empty function if it's not a function already
            Y.Lang.isFunction(next) || (next = function() {} );
            next();

        }


    }, {
        /**
         * @attribute ATTRS
         * @type {object} static class attributes
         */
        ATTRS: {
            courses: {
                value: new Y.CourseList()
            },
            students: {
                value: new Y.StudentList()
            },
            root: {
                value: '/yui-srsSteps/'
            },
            routes: {  // an array of routes that the app will handle.  Initially two routes created both of which do the same thing
                value: [
                    {
                        path: '/',
                        callbacks: [
                             'getCourses',
                             'showCoursePage'
                        ]
                    },
                    {
                        path: '/courses/',
                        callbacks: [
                            'getCourses',
                            'showCoursePage'
                        ]
                    },
                    {
                        path: '/courses/:course/',
                        callbacks: [
                            'getCourses',
                            'getStudents',
                            'showCoursePage'
                        ]
                    },
                    {
                        path: '/courses/search/:searchstr',
                        callbacks: [
                            'getCourses',
                            'showCoursePage'
                        ]
                    }
                ]
            }
        }
    });
}, '0.0.1', {
    requires: ['app', 'coursePageView', 'studentView']
});
