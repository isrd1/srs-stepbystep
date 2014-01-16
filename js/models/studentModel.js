YUI().add('studentModel', function (Y) {
    Y.StudentModel = Y.Base.create('studentModel', Y.Model, [], {
        root: 'students/',
        initializer: function (config) {
            Y.log('in studentModel initializer, creating ' + config.surname);
            this.surname = config.surname;
            this.email = config.email;
            this.studentid = config.studentid;
            this.forename = config.forename;
            this.stage = config.stage;
        }
    
    }, {
        ATTRS: { /* default values */
            studentid: {value:'1'},
            surname: { value: 'Rob' },
            forename: {  value: '0234 23423' },
            email: {value: 'comp'},
            stage: {value: '1'}
        }
    });
},'0.0.9',{
    requires: ['model']
});