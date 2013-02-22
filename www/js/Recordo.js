//Bootstrap Backbone constructs

var App = {
    models: {},
    views: {},
    collections: {},
    routers: {}
};

(function(App, $, Backbone, Jr, _) {

// basic model to hold audio files
    App.models.MediaModel = Backbone.Model.extend({

        defaults: {
            src: '',
            recording: '',
            coords: {},
            acceleration: ''
        },

        setRecordingSrc: function() {
            var src = this.get('src');

            // set up media properties and get new file to record to
            this.set('recording', new Media(this.get('src'), this.onSuccess, this.onError));

        },

        setLocation: function() {
            var self = this;

            navigator.geolocation.getCurrentPosition(
                
                // success
                function(position) {
                    // console.log(position.coords.latitude);
                    // console.log(position.coords.longitude);
                    self.set('coords', {latitude: position.coords.latitude, longitude: position.coords.longitude});
                    self.set('speed', position.coords.speed);
                    // this.set('longitude', position.coords.longitude);
                    // this.set('latitude', position.coords.latitude);
                    console.log(self.get('coords'));
                    console.log(self.get('speed'));
                },

                // error
                function() {
                    console.log("Error getting device location");
                }
            );
        },

        startRecording: function() {
            window.console.log("start recording");

            // start recording
            this.get('recording').startRecord();
        },

        stopRecording: function() {
            this.get('recording').stopRecord();
        },

        play: function() {
            this.get('recording').play();
        },

        stop: function() {
            this.get('recording').stop();
        },

        onSuccess: function() {
            window.console.log("MEDIA MODEL SUCCESS");
        },

        onError: function() {
            window.console.log("MEDIA MODEL ERROR");
        },

        // @REVIEW: consider using this convenience method in view and handling media API methods in view
        // instead of here or place in media mixin and extend with media view
        getRecording: function() {
            return this.get('recording') || false;
        }

    });
    
}(window.App, window.Zepto, window.Backbone, window.Jr, window._));
(function(App, $, Jr, _, Mustache) {

    App.views.HomeView = Jr.View.extend({

        events: {
            'click .record': 'onClickGoRecord'
        },

        render: function() {

            var self = this,
                template = 'templates/home.htm',
                data = {
                title: 'Home Page'
                };
            
            $.get(template, function(html) {
                self.$el.html(Mustache.render(html, data));
            });

            return this;
        },

        onClickGoRecord: function() {
            Jr.Navigator.navigate('media',{
                trigger: true,
                animation: {
                    type: Jr.Navigator.animations.SLIDE_STACK,
                    direction: Jr.Navigator.directions.LEFT
                }
            });

            return false;
        }
    });

}(window.App, window.Zepto, window.Jr, window._, window.Mustache));
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
            this.model.setLocation();
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
(function(App, $, Backbone, Jr, _) {

    App.routers.AppRouter = Jr.Router.extend({
        
        routes: {
            'home': 'home',
            'media': 'media'
        },

        home: function() {
            App.views.homeView = new App.views.HomeView();
            this.renderView(App.view.homeView);
        },

        media: function() {
            App.models.mediaModel = new App.models.MediaModel();
            App.views.mediaView = new App.views.MediaView({model: App.models.mediaModel});
            // this.renderView(App.views.mediaView);
            this.renderView("FOOBARBAZ");
        }
    });
}(window.App, window.Zepto, window.Backbone, window.Jr, window._));
(function(App, $, Backbone, Jr, _) {

    App.Device = {
        startApp: function() {
            this.bindEvents();
        },

        bindEvents: function() {
            document.addEventListener('deviceready', this.onDeviceReady, false);
        },

        // deviceready Event Handler
        //
        // The scope of 'this' is the event. In order to call the 'receivedEvent'
        // function, we must explicity call 'app.receivedEvent(...);'
        onDeviceReady: function() {

            App.routers.appRouter = new App.routers.AppRouter();

            Backbone.history.start();

            Jr.Navigator.navigate('media',{
               trigger: true
            });

            this.receivedEvent('deviceready');
        },
        // Update DOM on a Received Event
        receivedEvent: function(id) {
             window.alert('Received Event: ');
        }

        // mustachify: function(file, data) {
        //     console.log("mustachify", typeof(file));
        //     $.get(file, function(html) {
        //         console.log("mustachify context", this);
        //         console.log("HTML", html);
        //         $(this.el).html(Mustache.render(html, data));
        //     });
        
        // }

    };


}(window.App, window.Zepto, window.Backbone, window.Jr, window._));