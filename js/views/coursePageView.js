/*jslint devel: true,  undef: true, newcap: true, strict: true, maxerr: 50 */

/*global YUI*/

/**
 * The coursePageView module will control two sub-views: courses and students
 * @module coursePageView
*/


YUI().add('coursePageView', function (Y) {
    "use strict";
    /**
     * The CoursePageView class controls the sub-views for displaying courses and students
     * @class CoursePageView
     * @extends View
     * @constructor
     */
    Y.CoursePageView = Y.Base.create('coursePageView', Y.View, [], {
        courseView: null,           
        studentView: null,          // the student view rendered if a course is chosen by StudentListView
        courseViewContent: null,    // the course data but rendered as a view by CourseListView
        courseList: null,           // the course data
        /**
         * Constructor for this class
         * @method initializer 
         */
        initializer: function () {
            var chosenCourse = this.get('chosenCourse'),
            courseList = this.get('courseList'),
            studentList = this.get('studentList');
            
            Y.log('inside coursePageView initializer');
            
            /**
             * if showing students get the coursecode from the information passed in the constructor
             * and construct a view for students
             */ 
            if (chosenCourse !== undefined) {
                this.studentView = new Y.StudentView({modelList: studentList});
            }
            /**
             * construct a course list view if one doesn't yet exist, no need to make if already there
             */
            if (this.courseView == null) {
                this.courseView = new Y.CourseListView({modelList: courseList});
                this.courseView.addTarget(this);
            }

            this.courses = this.get('courses');
           
        },

        /**
         * This destructor is specified so this view's sub-views can be properly destroyed and cleaned up.
         * @method destructor
         * 
         */ 
        destructor: function () {
            this.courseView.destroy();
            this.studentView && this.studentView.destroy();

            delete this.courseView;
            this.studentView && delete this.studentView;
        },
        
        /**
         * Creates the content to insert in the view
         * @method render 
         * @return {object} returns 'this' and so is chainable
         */
        render: function () {
            var container = this.get('container'),
                // A document fragment is created to hold the resulting HTML created from rendering the two sub-views.
                content = Y.one(Y.config.doc.createDocumentFragment());

            // This renders each of the two sub-views into the document fragment, then sets the fragment as the contents of this view's container.
            if (this.courseViewContent == null) { // only render the course view content once since it never changes.
                this.courseViewContent = this.courseView.render().get('container');
            }
            content.append(this.courseViewContent);
            if (this.studentView) {
                content.append(this.studentView.render().get('container'));
            }
            if (!container.inDoc()) {
                container.set('id', 'courseInfo');  // give the display container an id so we can render the table in it
                Y.one('body').append(container);
            }

            // Sets the document fragment containing the two rendered sub-views as the contents of this view's container.
            container.setHTML(content);

            Y.log('inside coursePageView render');
            
            return this;
        }
        
    }, {
        /**
         * @attribute ATTRS
         * @type {object} static class attributes
         */
        ATTRS: {
            container: {
                valueFn: function () {
                    return Y.Node.create("<div class='master'/>");
                }
            }
        }
    });
}, '0.0.9', {
    requires: ['courseListView', 'studentListView']
});
