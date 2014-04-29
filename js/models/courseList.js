YUI().add('courseList', function (Y) {
    Y.CourseList = Y.Base.create('courseList', Y.ModelList, [Y.ModelSync.REST], {
        // By convention `Y.StudentList`'s `root` will be used for the lists' URL.
        model: Y.CourseModel,
        getUrl: function (action, subject, filter) {
        	action = action || 'list';
        	subject = subject || 'courses';
        	filter = filter || '';
        	return '/yui-srsSteps/server/index.php?action=' + action + '&subject=' + subject + '&' + filter;  // this is the dynamic url to use if you have the php working '/yui-srsSteps/server/index.php?action=list&subject=courses',
        },
    
        sync: function (action, options, callback) {
            var filter;
            if (action === 'read') {
                filter = options && options.filter;
                action = options.action || 'list';
                subject = options.subject || 'courses';
                Y.io(this.getUrl(action, subject, filter), {
                    on: {
                        complete: function(id, xhr) {
                            Y.Lang.isFunction(callback) || (callback = function () { });

                            // Check for a successful response, otherwise return the error
                            if (xhr.status >= 200 && xhr.status < 300) {
                                callback(null, xhr);
                            } else {
                                callback(xhr.statusText, xhr);
                            }

                        },
                        start: function (id, args){
                            try {
                                Y.one('#wrapper').addClass('loading');
                            } catch (e) {
                                Y.log(e);
                            }
                        },
                        end: function (id, args){
                            try {
                                Y.one('#wrapper').removeClass('loading');
                            } catch (e) {
                                Y.log(e);
                            }
                        }
                    },
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
            Y.log('showing the course in the list');
            this.each(function (){
                Y.log(this.coursetitle);
            });
        }
    
    });
}, '0.0.9', {
    requires: ['courseModel']
});