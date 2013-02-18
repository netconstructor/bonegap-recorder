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