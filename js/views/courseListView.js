YUI().add('courseListView', function (Y) {
    Y.CourseListView = Y.Base.create('courseListView', Y.View, [], {
        courses: null,
        
        initializer: function () {
            Y.log('inside courseListView initializer');
            
            this.courses = this.get('modelList');
            
            Y.publish('srsapp:courseChange', {
                preventable: false
            });
            
            // create a datatable to display the data rather than a template
            this.table = new Y.DataTable({
                 recordType: this.courses.model,
                 sortable: true,
                 data: this.courses
             });
            
            // add a new attribute to track selected row with a null value
            this.table.addAttr("selectedRow", { value: null });
            
            // delegate any clicks on a row to a function which sets the selectedRow attribute to the row clicked
            this.table.delegate('click', function (e) {
                this.set('selectedRow', e.currentTarget);
             }, '.yui3-datatable-data tr', this.table);

            // if there is a selectedRowChange event then change the selected row and fire
            // a 'courseChange' event, the router has a listener for this event
            this.table.after('selectedRowChange', function (e) {
                var tr = e.newVal,
                    last_tr = e.prevVal,
                    record = this.getRecord(tr);
                
                // change which row has the selected class
                if (last_tr) {
                    last_tr.removeClass('selected');
                }
                tr.addClass('selected');
                // fire the change event
                Y.fire('srsapp:courseChange', {course:record});

            });
           
        },

        render: function () {
            var container= this.get('container');

            Y.log('inside courseListView render');
            
            this.table.render(container);
            return this;
        }
        
    }, {
        ATTRS: {
            container: {
                valueFn: function () {
                    return Y.Node.create('<div class="master" id="courseTable"/>');
                }
            }
        }
    });
}, '0.0.9', {
    requires: ['datatable', 'node-base']
});

/* not now used was used to parse data 
            // parse the student list data adding each student to the display table
            students.map(function (student){
                var data = student.toJSON();
                data.clientId = student.get('clientId');
                self.table.data.add(data);
                return data;
            });
*/           
