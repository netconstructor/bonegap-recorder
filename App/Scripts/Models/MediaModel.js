(function(App, $, Backbone, Jr, _) {

// basic model to hold audio files
    App.models.MediaModel = Backbone.Model.extend({

        defaults: {
            src: '',
            recording: ''
        },

        setRecordingSrc: function() {
            var src = this.get('src');

            // set up media properties and get new file to record to
            this.set('recording', new Media(this.get('src'), this.onSuccess, this.onError));

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