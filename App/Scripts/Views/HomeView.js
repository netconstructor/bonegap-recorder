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