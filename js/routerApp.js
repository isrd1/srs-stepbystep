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
                preserve: false
            }
        },
        
        /**
         * Will load the models for each course into a modelList
         * @method getCourses
         * @param req The http request
         * @param res A resource object
         * @param next If the callback for the path is an array of methods this contains the next method to call
         */
        getCourses: function (req, res, next) {
            Y.log('request: ' + req + 'in getCourses');
            // make sure next() is a function by giving it a default value of an empty function if it's not a function already
            Y.Lang.isFunction(next) || (next = function () {} );
            next();            
        },
        /**
         * Will show the course page view, the course page view will control two sub-views, one for courses and one for students if a course is chosen
         * @method showCoursePage
         * @param req
         * @param res
         * @param next
         */
        showCoursePage: function (req, res, next) {
            Y.log('request: ' + req + 'opening course page view');
            try {
                this.showView('coursePage');
            } catch (e) {
                Y.log(e.message);
            }
            // make sure next() is a function by giving it a default value of an empty function if it's not a function already
            Y.Lang.isFunction(next) || (next = function () {} );
            next();
        },

        logger: function (req, res, next) {
            Y.log('path not handled: ' + req);
            Y.Lang.isFunction(next) || (next = function () {} );
            next();
        }

    }, {
        /**
         * @attribute ATTRS
         * @type {object} static class attributes
         */
        ATTRS: {
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
                    }   
                ]
            }
        }
    });
}, '0.0.1', {
    requires: ['app', 'coursePageView']
});
