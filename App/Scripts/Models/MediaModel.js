(function(App, $, Backbone, Jr, _) {

// basic model to hold audio files
    App.models.MediaModel = Backbone.Model.extend({

        defaults: {
            src: ''
        }

    });
    
}(window.App, window.Zepto, window.Backbone, window.Jr, window._));