YUI().add('studentList', function (Y) {
    Y.StudentList = Y.Base.create('studentList', Y.ModelList, [Y.ModelSync.REST], {
        // By convention Y.StudentList's `root` will be used for the lists' URL.
        model: Y.StudentModel,
        url: '/yui-srsSteps/server/index.php?action=listCourse&subject=students&id='+this.coursecode,
    
        sync: function (action, options, callback) {
            if (action === 'read') {
                Y.io(this.url, {
                    on: {
                        complete: function(id, xhr) {
                            Y.Lang.isFunction(callback) || (callback = function () { });

                            // Check for a successful response, otherwise return the error
                            if (xhr.status >= 200 && xhr.status < 300) {
                                callback(null, xhr);
                            } else {
                                callback(xhr.statusText, xhr);
                            }

                        }
                    }
                });
            } else {
                callback('Unsupported sync action: ' + action);
            }
        },
        
        parse: function(raw) {
            var data = Y.JSON.parse(raw);
            // returning the array of elements will automatically add them to the list
            // calling the Model initializer function for each element in the array
            return data.ResultSet.Result;
        },
        
        logger: function () {
            Y.log('showing the students in the list');
            this.each(function (){
                Y.log(this.surname);
            });
        }
    
    });
}, '0.0.9', {
    requires: ['studentModel']
});