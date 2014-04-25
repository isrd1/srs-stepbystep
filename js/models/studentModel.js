YUI().add('studentModel', function (Y) {
    Y.StudentModel = Y.Base.create('studentModel', Y.Model, [], {
        root: 'students/',
    	idAttribute: 'studentid',
    	baseURL: '/yui-srsSteps/server/index.php',

        initializer: function (config) {
            Y.log('in studentModel initializer, creating ' + config.surname);
            this.surname = config.surname;
            this.email = config.email;
            this.studentid = config.studentid;
            this.forename = config.forename;
            this.stage = config.stage;
        },
        
        sync: function (action, options, callback) {
        	var data, url, self = this;
        	if (action === 'update') {
        		url = this.baseURL + '?action=update&subject=student';
                Y.io(url, {
                    method: 'POST',
                    data: 'student='+Y.JSON.stringify(self),
                    on: {
                        complete: function(id, xhr) {
                            Y.Lang.isFunction(callback) || (callback = function () { });

                            // Check for a successful response, otherwise return the error
                            if (xhr.status >= 200 && xhr.status < 300) {
                                callback(null, self.toJSON());
                            } else {
                                callback(xhr.statusText, xhr);
                            }
                        }
                    }
                });
        	} else if (action === 'create') {
        		
        	} else if (action === 'delete') {
        		
        	} else {
        		Y.log('unknown action: ' + action);
        	}
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
