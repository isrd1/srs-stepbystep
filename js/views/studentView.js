/*jslint devel: true,  undef: true, newcap: true, strict: true, maxerr: 50 */

/*global YUI*/

/**
 * The studentView module will control two sub-views: courses and students
 * @module studentView
*/


YUI().add('studentView', function (Y) {
    "use strict";
    /**
     * The studentView displays students
     * @class StudentView
     * @extends View
     * @constructor
     */
    Y.StudentView = Y.Base.create('studentView', Y.View, [], {
        courses: null,
        /**
         * Constructor for this class
         * @method initializer 
         */
        initializer: function () {
           Y.log('inside studentView initializer');
           this.students = this.get('students');
           
           
           // create a datatable to display the data rather than a template
           this.table = new Y.DataTable({
                recordType: this.students.model,
                sortable: true,
                data: this.students,
                caption: 'students on course: ' +this.get('coursecode')
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
                tableNode = Y.Node.create('<div class="master" id="studentTable"/>');

            this.table.render(tableNode);
            
            content.append(tableNode);
            
            if (!container.inDoc()) {
                container.set('id', 'studentList');  /* give the display container an id so we can render the table in it */
                Y.one('body').append(container);
            }

            /* Sets the document fragment containing the two rendered sub-views as the contents of this view's container. */
            container.setHTML(content);

            Y.log('inside studentView render');
            
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
