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