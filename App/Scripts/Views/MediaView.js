(function(App, $, Jr, _, Mustache) {

    App.views.MediaView = Jr.View.extend({

        events: {
            'click .record': 'startRecording',
            'click .end': 'stopRecording',
            'click .stop': 'stop',
            'click .play': 'play'
        },

        initialize: function() {
            _.bindAll(this, 'render', 'startRecording', 'onFileSystemSuccess', 'getNewFile', 'onDirectory');

            this.render();

        },

        render: function() {

            var self = this,
                template = 'templates/media.htm',
                data = {
                    title: 'Record Media'
                };


            // init object to hold media
            this.mediaRec = {};

            // ref to dir
            this.directory = '';

            $.get(template, function(html) {
                $(self.el).html( Mustache.render(html, data) ).appendTo('body');
            });

       
            this.getNewFile();

            return this;
        },

        recordAudio: function() {
            
            this.getNewFile();


        },

        startRecording: function() {
            this.model.setRecordingSrc();
            this.model.startRecording();
        },

        stopRecording: function() {
            this.model.stopRecording();
        },

        play: function() {
            this.model.play();
        },

        stop: function() {

            this.model.stop();
        },

        onDirectory: function(d) {
            var directory = d,
                reader = d.createReader();

            this.directory = directory;

            window.console.log("onDirectory()");
            
            reader.readEntries(this.onSuccess, this.onError);
        },

        getNewFile: function() {
            window.console.log("getNewFile");
            window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, this.onFileSystemSuccess, this.onError);
        },

        onFileSystemSuccess: function(fileSystem) {
            var d = new Date(),
                n = d.getTime(),
                newFileName = 'recording' + n + '.wav',
                self = this;

            window.console.log("FS name: " + fileSystem.name);
            window.console.log("root: " + fileSystem.root.name);
            window.console.log("NEWFILE" +newFileName);

            // Get the data directory, creating it if it doesn't exist.
            fileSystem.root.getDirectory("",{create:true},self.onDirectory,self.onError);

            fileSystem.root.getFile(newFileName, 
                { create: true, exclusive: false }, //create if it does not exist
                function success(entry) {
                    // self.src = entry.toURL();
                    self.model.set('src', entry.fullPath);
                    window.console.log("gotfs self.src =" + self.model.get('src')); //logs blank.wav's path starting with file://
                },
                function onError(error) {
                    window.console.log("onError(): " + error.code + "\n" + "Message: " + error.message);
                }
            );
            
        },

        onFileEntry: function() {

        },

        onSuccess: function() {
            window.console.log("generic success");
        },

        onError: function(error) {
            window.console.log("generic error=" + error.code);
            window.console.log("gen error message=" + error.message);
        }


    });
}(window.App, window.Zepto, window.Jr, window._, window.Mustache));