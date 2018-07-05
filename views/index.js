(function(){
    var templates = document.querySelectorAll('script[type="text/handlebars"]');

    Handlebars.templates = Handlebars.templates || {};
    console.log(Handlebars.templates);

    Array.prototype.slice.call(templates).forEach(function(script) {
        Handlebars.templates[script.id] = Handlebars.compile(script.innerHTML);
    });

    var Router = Backbone.Router.extend({
        routes: {
            'register': 'register'
        },
        register: function() {
            console.log('register');
            //var registerModel = new RegisterModel();
            var registerView = new RegisterView({
                el: '#main',
                //model: registerModel
            });
        }
    });

    var RegisterView = Backbone.View.extend({
        render: function() {
            var form = $('#register').html();
            this.$el.html(form);
        },
        initialize: function() {
            $('#main').empty();
            this.render();
        }
    });

    var router = new Router();
    Backbone.history.start();

})();
