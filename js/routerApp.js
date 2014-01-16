/*jslint devel: true,  undef: true, newcap: true, strict: true, maxerr: 50 */

/*global YUI*/

/**
 * The srsApp module is the controller or router which will handle all requests, creating the appropriate
 * models, lists and views as required by each request.
 * @module srsApp
*/

YUI().add('srsApp', function (Y) {
    "use strict";
    /**
     * The SRSApp class is the controller or router
     * @class SRSApp
     * @extends App
     * @constructor
     */
    Y.SRSApp = Y.Base.create('srsApp', Y.App, [], {

        initializer: function () {
           this.once('ready', function (e) {
               
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
            coursePage: {
                type: Y.CoursePageView,
                preserve: true
            },
            studentView: {
                type: Y.StudentView,
                preserve: false
            }
        },
        
        navigateToStudents: function (e) {
            Y.log('navigate to students on course ' + e.course.coursecode );
            Y.log(e);
            this.navigate('/yui-srsSteps/courses/'+e.course.coursecode + '/');
        },

        /**
         * Will load the models for each student into a modelList given a coursecode
         * @method getStudents
         * @param req The http request
         * @param res A resource object
         * @param next If the callback for the path is an array of methods this contains the next method to call
         */
        getStudents: function (req, res, next) {
            var coursecode = req.params.course || null,
                students = this.get('students');
            // put the students in the request so it'll be passed on to the next part of the route
            req.students = students;
            req.coursecode = coursecode;
            students.load({coursecode:coursecode},function () {
                students.logger();
                next();
            });
         },
        
        /**
         * Will load the models for each course into a modelList
         * @method getCourses
         * @param req The http request
         * @param res A resource object
         * @param next If the callback for the path is an array of methods this contains the next method to call
         */
        getCourses: function (req, res, next) {
            var courses = this.get('courses');
            Y.log('in getCourses');
            Y.log(req);
            // add the courses to the request object so it'll be passed on to the next part of the route
            req.courses = courses;

            // make sure next() is a function by giving it a default value of an empty function if it's not a function already
            Y.Lang.isFunction(next) || (next = function () {} );
            
            if (courses.isEmpty()) {       // there are no courses loaded then
                courses.load(function () { // call course load (which will sync etc)
                    courses.logger();      // debug by calling logger()
                    next();                // call next only when the courses are loaded
                });
            } else {                       // already loaded the courses so call next()
                next(); 
            }
        },
        
        /**
         * Will show the course page view to show courses
         * @method showCoursePage
         * @param req
         * @param res
         * @param next
         */
        showCoursePage: function (req, res, next) {
            Y.log('in showCoursePage');
            try {
                this.showView('coursePage', {courses: req.courses});
            } catch (e) {
                Y.log(e.message);
            }
            // make sure next() is a function by giving it a default value of an empty function if it's not a function already
            Y.Lang.isFunction(next) || (next = function () {} );
            next();
        },
        
        /**
         * Will show the student view listing students on a given course
         * @method showCoursePage
         * @param req
         * @param res
         * @param next
         */
        showStudentPage: function (req, res, next) {
            Y.log('in showStudentPage');
            try {
                this.showView('studentView', {students: req.students, coursecode:req.coursecode});
            } catch (e) {
                Y.log(e.message);
            }
            // make sure next() is a function by giving it a default value of an empty function if it's not a function already
            Y.Lang.isFunction(next) || (next = function () {} );
            next();
        },
        
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
                            'getStudents',
                            'showStudentPage'
                        ]
                    }
                ]
            }
        }
    });
}, '0.0.1', {
    requires: ['app', 'coursePageView', 'studentView']
});
