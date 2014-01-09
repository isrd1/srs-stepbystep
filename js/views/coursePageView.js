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
        courses: null,
        /**
         * Constructor for this class
         * @method initializer 
         */
        initializer: function () {
           Y.log('inside coursePageView initializer');
           this.courses = this.get('courses');
           
           // create a datatable to display the data rather than a template
           this.table = new Y.DataTable({
                recordType: this.courses.model,
                sortable: true,
                data: this.courses
            });
        },

        /**
         * Creates the content to insert in the view
         * @method render 
         * @return {object} returns 'this' and so is chainable
         */
        render: function () {
            var container = this.get('container'),  /* defined in the ATTR section below 
                A document fragment is created to hold the resulting HTML created from rendering the two sub-views. */
                content = Y.one(Y.config.doc.createDocumentFragment()),
                tableNode = Y.Node.create('<div class="master" id="courseTable"/>');

            this.table.render(tableNode);
            
            content.append(tableNode);
            
            if (!container.inDoc()) {
                container.set('id', 'courseList');  /* give the display container an id so we can render the table in it */
                Y.one('body').append(container);
            }

            /* Sets the document fragment containing the two rendered sub-views as the contents of this view's container. */
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
                    return Y.Node.create('<div/>');
                }
            }
        }
    });
}, '0.0.9', {
    requires: ['datatable']
});
