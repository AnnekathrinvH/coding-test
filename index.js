(function(){
    var templates = document.querySelectorAll('script[type="text/handlebars"]');

    Handlebars.templates = Handlebars.templates || {};
    console.log(Handlebars.templates);

    Array.prototype.slice.call(templates).forEach(function(script) {
        Handlebars.templates[script.id] = Handlebars.compile(script.innerHTML);
    });

    var filteredDataArray = [];
    var singleCustomerArray = [];


    var Router = Backbone.Router.extend({
        routes: {
            '': 'main',
            'main': 'main',
            'main/:id': 'customer',
            'edit/:id': 'edit',
            'new': 'new'
        },
        main: function() {
            var mainCollection = new MainCollection();
            var mainView = new MainView({
                el: '#main',
                collection: mainCollection
            });
        },
        customer: function(id) {
            var router = this;

            var customerView = new CustomerView({
                el: '#main',
                id: id
            })
        },
        edit: function() {
            var router = this;

            var editView = new EditView({
                el: '#main',
            })
        },
        'new': function() {
            var newView = new NewView({
                el: '#main',
            })
        }
    });




    var MainCollection = Backbone.Collection.extend({
        url: 'https://s3-eu-west-1.amazonaws.com/fov-coding-test-cors/customers.json'
    });

    var MainView = Backbone.View.extend({
        render: function() {
            var mainPage = $('#allData').html();
            this.$el.html(mainPage);

            var customerData = this.collection.fetch({
                success: function () {
                    if(filteredDataArray.length === 0) {
                        var allData = customerData.responseJSON;
                        for (var i = 0; i < allData.length; i++) {
                            if (allData[i].isActive === true) {
                                filteredDataArray.push(allData[i]);
                            }
                        }
                    }
                    console.log(filteredDataArray);
                    var renderedData = Handlebars.templates.allCustomerData(filteredDataArray);
                    $('#dataContainer').html(renderedData);
                }
            });
        },
        initialize: function() {
            console.log('initialize');
            $('#main').empty();
            this.render();
        },
        events: {
            'click #newCustomerButton': function(event) {
                window.location.hash = 'new';
            }
        }
    });

    var NewView = Backbone.View.extend({
        render: function() {
            var mainPage = $('#newCustomerPage').html();
            this.$el.html(mainPage);

        },
        initialize: function() {
            $('#main').empty();
            this.render();
        },
        events: {
            'click .submitButton': function(event) {
                var newCustomer = {
                    'company': $('#company').val(),
                    '_id': $('#id').val(),
                    'industry': $('#industry').val(),
                    'about': $('#about').val()
                };

                filteredDataArray.push(newCustomer);

                console.log(filteredDataArray);
                window.location.hash = 'main';

            }
        }
    });

    var EditView = Backbone.View.extend({
        render: function() {
            var mainPage = $('#editPage').html();
            this.$el.html(mainPage);

            var renderedData = Handlebars.templates.editCustomerData(singleCustomerArray);
            $('#dataContainer3').html(renderedData);
        },
        initialize: function() {
            $('#main').empty();
            this.render();
        },
        events: {
            'click .submitButton': function(event) {
                var newCompany = $('#company').val();
                var newIndustry = $('#industry').val();
                var newAbout = $('#about').val();
                var id = event.currentTarget.id;

                for (var i = 0; i < filteredDataArray.length; i++) {
                    if (filteredDataArray[i]._id === id) {
                        filteredDataArray[i].company = newCompany;
                        filteredDataArray[i].industry = newIndustry;
                        filteredDataArray[i].about = newAbout;
                    }

                }
                console.log(filteredDataArray);
                window.location.hash = 'main';

            }
        }
    });

    var CustomerView = Backbone.View.extend({
        render: function() {
            var mainPage = $('#detailPage').html();
            this.$el.html(mainPage);

            singleCustomerArray = [];
            var id = this.id;
            for (var i = 0; i < filteredDataArray.length; i++) {
                if (filteredDataArray[i]._id === id) {
                    singleCustomerArray.push(filteredDataArray[i]);
                }
            }
            console.log(singleCustomerArray);
            var renderedData = Handlebars.templates.singleCustomerData(singleCustomerArray);
            $('#dataContainer2').html(renderedData);
        },
        initialize: function() {
            $('#main').empty();
            this.render();
        },
        events: {
            'click .editButton': function(event) {
                var id = event.currentTarget.id;
                console.log(id);
                window.location.hash = 'edit/'+ id;
            }
        }
    });


    var router = new Router();
    Backbone.history.start();

})();
