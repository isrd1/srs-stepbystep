YUI().add('courseModel', function (Y) {
    Y.CourseModel = Y.Base.create('courseModel', Y.Model, [], {
        root: 'courses/',
        initializer: function (config) {
            Y.log('in courseModel initializer, creating ' + config.coursecode);
            this.coursecode = config.coursecode;
            this.coursetitle = config.coursetitle;
            this.department = config.department;
        }
    
    }, {
        ATTRS: { /* default values */
            coursecode: {value:'1'},
            coursetitle: { value: '' },
            department: {value: 'computing'}
        }
    });
},'0.0.9',{
    requires: ['model']
});