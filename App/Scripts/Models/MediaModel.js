(function(App, $, Backbone, Jr, _) {

/**
 * This model will hold all information associated with
 * a given media element: file src, the recording object itself,
 * location data including speed, accel, altitude, ...
 */
    App.models.MediaModel = Backbone.Model.extend({

        defaults: {
            src: '',
            recording: '',
            coords: {},
            speed: ''
        },

        setRecordingSrc: function() {
            var src = this.get('src');

            // set up media properties and get new file to record to
            this.set('recording', new Media(this.get('src'), this.onSuccess, this.onError));

        },

        setGeoData: function() {
            var self = this;

            navigator.geolocation.getCurrentPosition(
                
                // success
                function(position) {
                    self.set('coords', {latitude: position.coords.latitude, longitude: position.coords.longitude});
                    self.set('speed', position.coords.speed);
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