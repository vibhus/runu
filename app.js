var app = angular.module('app', ['ngRoute', 'ngAnimate', 'ngSanitize', 'ui.bootstrap', 'formly', 'formlyBootstrap']);

app.config(['$routeProvider',
  function($routeProvider) {
    $routeProvider.
      when('/login', {
        templateUrl: 'views/login.html',
        controller: 'LoginCtrl'
      }).
      when('/register', {
        templateUrl: 'views/register.html',
        controller: 'RegisterCtrl'
      }).
      when('/forget-password', {
        templateUrl: 'views/forget-password.html',
        controller: 'ForgetPasswordCtrl'
      }).
      when('/settings', {
        templateUrl: 'views/settings.html',
        controller: 'SettingsCtrl'
      }).
      when('/services', {
        templateUrl: 'views/services.html',
        controller: 'ServicesCtrl'
      }).
      when('/reports', {
        templateUrl: 'views/reports/reports.html',
        controller: 'SettingsCtrl'
      }).
      when('/sales', {
        templateUrl: 'views/forms/sales.html',
        controller: 'SalesCtrl'
      }).
      when('/purchase', {
        templateUrl: 'views/forms/purchase.html',
        controller: 'PurchaseCtrl'
      }).
      when('/stock-take', {
        templateUrl: 'views/forms/stock-take.html',
        controller: 'StockTakeCtrl'
      }).
      otherwise({
        redirectTo: '/login'
      });
}]);

app.constant('CONSTANTS', {
  AUTH_HOME_PAGE: '/settings'
});

app.run(function(formlyConfig) {
    var attributes = [
        'date-disabled',
        'custom-class',
        'show-weeks',
        'starting-day',
        'init-date',
        'min-mode',
        'max-mode',
        'format-day',
        'format-month',
        'format-year',
        'format-day-header',
        'format-day-title',
        'format-month-title',
        'year-range',
        'shortcut-propagation',
        'datepicker-popup',
        'show-button-bar',
        'current-text',
        'clear-text',
        'close-text',
        'close-on-date-selection',
        'datepicker-append-to-body'
    ];

    var bindings = [
        'datepicker-mode',
        'min-date',
        'max-date'
    ];

    var ngModelAttrs = {};

    angular.forEach(attributes, function(attr) {
        ngModelAttrs[camelize(attr)] = {attribute: attr};
    });

    angular.forEach(bindings, function(binding) {
        ngModelAttrs[camelize(binding)] = {bound: binding};
    });

    console.log(ngModelAttrs);

    formlyConfig.setType({
        name: 'datepicker',
        templateUrl:  'datepicker.html',
        wrapper: ['bootstrapLabel', 'bootstrapHasError'],
        defaultOptions: {
            ngModelAttrs: ngModelAttrs,
            templateOptions: {
                datepickerOptions: {
                    format: 'MM.dd.yyyy',
                    initDate: new Date()
                }
            }
        },
        controller: ['$scope', function ($scope) {
            $scope.datepicker = {};

            $scope.datepicker.opened = false;

            $scope.datepicker.open = function ($event) {
                $scope.datepicker.opened = !$scope.datepicker.opened;
            };
        }]
    });

    formlyConfig.setType({
        name: 'break_header',
        template:  '<div class="form-group text-center"><h4>{{to.text}}</h4></div>'
    });

    formlyConfig.setType({
        name: 'break_label',
        template:  '<div class="form-group text-center"><p class="text-center">{{to.text}}</p></div>'
    });

    function camelize(string) {
        string = string.replace(/[\-_\s]+(.)?/g, function(match, chr) {
            return chr ? chr.toUpperCase() : '';
        });
        // Ensure 1st char is always lowercase
        return string.replace(/^([A-Z])/, function(match, chr) {
            return chr ? chr.toLowerCase() : '';
        });
    }
});

app.controller('AppCtrl', ['$scope', '$rootScope', function($s, $rs){
  console.log('woo hoo', $s);
  $rs.userInfo = {
    authenticated: false
  };

  $rs.$on('login-success', function (e, data) {
    $rs.userInfo = {
      email: data.email,
      authenticated: true
    };
  });

  $rs.$on('logout-success', function (e, data) {
    $rs.userInfo = {
      authenticated: false
    };
  });

  $s.recordForms = [
    {
      name: "Sales",
      page: "/sales"
    },
    {
      name: "Purchase",
      page: "/purchase"
    },
    {
      name: "Collection",
      page: "/collection"
    },
    {
      name: "Payment",
      page: "/payment"
    },
    {
      name: "Production",
      page: "/production"
    },
    {
      name: "Stock Take",
      page: "/stock-take"
    },
    {
      name: "Employees",
      page: "/employees"
    },
    {
      name: "Journals",
      page: "/journals"
    }
  ];

}]);

app.controller('LoginCtrl', ['$scope', '$location', 'CONSTANTS', function($s, $loc, CONSTANTS){
  console.log('LoginCtrl', $s);
  function handleLogin(){
    var email = $s.email,
    password = $s.password;
    
    // REST: login service

    $s.$root.$emit('login-success', {email: email});
    $loc.path(CONSTANTS.AUTH_HOME_PAGE);
  }

  $s.handleLogin = handleLogin;
}]);

app.controller('ForgetPasswordCtrl', ['$scope', function($s){
  console.log('ForgetPasswordCtrl', $s);
}]);

app.controller('RegisterCtrl', ['$scope', function($s){
  console.log('RegisterCtrl', $s);
}]);

app.controller('SettingsCtrl', ['$scope', function($s){
  console.log('SettingsCtrl', $s);
  $s.popup1 = {
    opened: false
  };

  $s.popup2 = {
    opened: false
  };
  $s.open1 = function() {
    $s.popup1.opened = true;
  };

  $s.open2 = function() {
    $s.popup2.opened = true;
  };
}]);

app.controller('SalesCtrl', ['$scope', function($s){
  console.log('SalesCtrl', $s);
    $s.vm = {};
    var vm = $s.vm; // vm stands for "View Model" --> see https://github.com/johnpapa/angular-styleguide#controlleras-with-vm
    vm.sales = {};

    function onSubmit() {
        console.log('form submitted:', vm.sales);
    }

    vm.salesFields = [
        {
            // the key to be used in the model values
            // so this will be bound to vm.user.username
            key: 'salesnumber',
            type: 'input',
            templateOptions: {
                placeholder: 'Sales Number',
                required: true
            }
        },
        {
            key: 'salesdate',
            type: 'datepicker',
            templateOptions: {
                type: 'text',
                datepickerPopup: 'dd-MM-yyyy',
                required: true
            }
        },
        {
            key: 'salescategory',
            type: 'select',
            templateOptions: {
                options: [],
                required: true
            }
        },
        {
            key: 'documentreference',
            type: 'input',
            templateOptions: {
                type: 'text',
                placeholder: 'Document Reference',
                required: true
            }
        },
        {
            key: 'description',
            type: 'input',
            templateOptions: {
                type: 'text',
                placeholder: 'Description',
                required: true
            }
        },
        {
            type: 'break_header',
            templateOptions: {
                text: 'Below: Settlement'
            }
        },
        {
            key: 'customername',
            type: 'select',
            templateOptions: {
                type: 'text',
                placeholder: 'Customer Name',
                required: true
            }
        },
        {
            key: 'previouslycollected',
            type: 'input',
            templateOptions: {
                type: 'text',
                placeholder: 'Previously Collected',
                required: true
            }
        },
        {
            key: 'depositused',
            type: 'input',
            templateOptions: {
                type: 'text',
                placeholder: 'Deposit Used',
                required: true
            }
        },
        {
            key: 'moneycollected',
            type: 'input',
            templateOptions: {
                type: 'text',
                placeholder: 'Money Collected',
                required: true
            }
        },
        {
            key: 'moneynotcollected',
            type: 'input',
            templateOptions: {
                type: 'text',
                placeholder: 'Money Not Collected',
                required: true
            }
        }
    ];

    vm.onSubmit = onSubmit;
}]);
app.controller('PurchaseCtrl', ['$scope', function($s){
  console.log('PurchaseCtrl', $s);
    $s.vm = {};
    var vm = $s.vm; // vm stands for "View Model" --> see https://github.com/johnpapa/angular-styleguide#controlleras-with-vm
    vm.formData = {};

    function onSubmit() {
        console.log('form submitted:', vm.sales);
    }

    vm.formFields = [
        {
            // the key to be used in the model values
            // so this will be bound to vm.user.username
            key: 'purchasenumber',
            type: 'input',
            templateOptions: {
                placeholder: 'Purchase Number',
                required: true
            }
        },
        {
            key: 'receiveddate',
            type: 'datepicker',
            templateOptions: {
                type: 'text',
                placeholder: 'Received Date',
                datepickerPopup: 'dd-MM-yyyy',
                required: true
            }
        },
        {
            key: 'documentreference',
            type: 'input',
            templateOptions: {
                type: 'text',
                placeholder: 'Document Reference',
                required: true
            }
        },
        {
            key: 'description',
            type: 'input',
            templateOptions: {
                type: 'text',
                placeholder: 'Description',
                required: true
            }
        },
        {
            key: 'currency',
            type: 'select',
            templateOptions: {
                type: 'text',
                placeholder: 'Customer Name',
                required: true
            }
        },
        {
            key: 'totalpurchase',
            type: 'input',
            templateOptions: {
                type: 'number',
                placeholder: 'Total Purchase',
                required: true
            }
        },
        {
            type: 'break_header',
            templateOptions: {
                text: 'Expense'
            }
        },
        {
            key: 'expensetype',
            type: 'select',
            templateOptions: {
                type: 'text',
                placeholder: 'Expense Type',
                required: true
            }
        },
        {
            key: 'anount',
            type: 'input',
            templateOptions: {
                type: 'number',
                placeholder: 'Amount',
                required: true
            }
        },
        {
            key: 'depositused',
            type: 'input',
            templateOptions: {
                type: 'text',
                placeholder: 'Deposit Used',
                required: true
            }
        },
        {
            key: 'moneycollected',
            type: 'input',
            templateOptions: {
                type: 'text',
                placeholder: 'Money Collected',
                required: true
            }
        },
        {
            key: 'moneynotcollected',
            type: 'input',
            templateOptions: {
                type: 'text',
                placeholder: 'Money Not Collected',
                required: true
            }
        }
    ];

    vm.onSubmit = onSubmit;
}]);
app.controller('StockTakeCtrl', ['$scope', function($s){
  console.log('PurchaseCtrl', $s);
    $s.vm = {};
    var vm = $s.vm; // vm stands for "View Model" --> see https://github.com/johnpapa/angular-styleguide#controlleras-with-vm
    vm.formData = {};

    function onSubmit() {
        console.log('form submitted:', vm.sales);
    }

    vm.formFields = [

        {
            key: 'date',
            type: 'datepicker',
            templateOptions: {
                type: 'text',
                placeholder: 'Date',
                datepickerPopup: 'dd-MM-yyyy',
                required: true
            }
        }
    ];

    vm.onSubmit = onSubmit;
}]);
app.controller('ServicesCtrl', ['$scope', function($s){
  console.log('ServicesCtrl', $s);
    $s.vm = {};
    var vm = $s.vm; // vm stands for "View Model" --> see https://github.com/johnpapa/angular-styleguide#controlleras-with-vm
    vm.formData = {};

    function onSubmit() {
        console.log('form submitted:', vm.formData);
    }

    vm.formFields = {
        services: {
            reporting: [
                {
                    key: 'services_reporting',
                    type: 'multiCheckbox',
                    templateOptions: {
                        label: 'Roles',
                        options: [
                            {
                                "name":"Bookkeeping",
                                "value": "Bookkeeping"
                            },
                            {
                                "name":"Compilation of Financial Statements",
                                "value": "Compilation of Financial Statements"
                            },
                            {
                                "name":"Tax Computation",
                                "value": "Tax Computation"
                            },
                            {
                                "name":"Financial Audit",
                                "value": "Financial Audit"
                            },
                            {
                                "name":"Corporate Secretary",
                                "value": "Corporate Secretary"
                            }
                        ]
                    }
                }
            ],
            vas: [
                    {
                        key: 'services_vas',
                        type: 'multiCheckbox',
                        templateOptions: {
                            label: 'Roles',
                            options: [
                                {
                                    "name":"Human Resources",
                                    "value": "Human Resources"
                                },
                                {
                                    "name":"IT Advisory",
                                    "value": "IT Advisory"
                                },
                                {
                                    "name":"Legal Advice",
                                    "value": "Legal Advice"
                                },
                                {
                                    "name":"Business Valuation",
                                    "value": "Business Valuation"
                                },
                                {
                                    "name":"Business Loans",
                                    "value": "Business Loans"
                                }
                            ]
                        }
                    }
                ],
            specialised: [
                    {
                        key: 'services_specialised',
                        type: 'multiCheckbox',
                        templateOptions: {
                            options: [
                                {
                                    "name":"Process Improvement",
                                    "value": "Process Improvement"
                                },
                                {
                                    "name":"Business Turn Around",
                                    "value": "Business Turn Around"
                                },
                                {
                                    "name":"Business Consulting",
                                    "value": "Business Consulting"
                                },
                                {
                                    "name":"Business Insurance",
                                    "value": "Business Insurance"
                                },
                                {
                                    "name":"Wealth Management",
                                    "value": "Wealth Management"
                                }
                            ]
                        }
                    }
                ]
        },
        details: [
            {
                key: 'others',
                type: 'input',
                templateOptions: {
                    placeholder: 'Others (Please type in)'
                }
            },
            {
                type: 'break_label',
                templateOptions: {
                    text: 'We will contact you using your email and phone number provided.'
                }
            },
            {
                key: 'email',
                type: 'input',
                templateOptions: {
                    type: 'email',
                    placeholder: 'Email'
                }
            },
            {
                key: 'phone',
                type: 'input',
                templateOptions: {
                    type: 'text',
                    placeholder: 'Phone Number'
                }
            },
            {
                type: 'break_label',
                templateOptions: {
                    text: 'By clicking ‘Submit’, I agree to allow Gold Numbers Pte. Ltd. to contact me for the above mentioned services.'
                }
            }
        ]
    };

    vm.onSubmit = onSubmit;
}]);



/* global angular */
/*
(function() {

    'use strict';

    var app = angular.module('formlyExample', ['formly', 'formlyBootstrap', 'ui.bootstrap']);




    app.controller('MainCtrl', function MainCtrl(formlyVersion) {
        var vm = this;
        // funcation assignment
        vm.onSubmit = onSubmit;

        // variable assignment
        vm.author = { // optionally fill in your info below :-)
            name: 'Kent C. Dodds',
            url: 'https://twitter.com/kentcdodds'
        };
        vm.exampleTitle = 'UI Bootstrap Datepicker'; // add this
        vm.env = {
            angularVersion: angular.version.full,
            formlyVersion: formlyVersion
        };

        vm.model = {};
        vm.options = {};

        vm.fields = [
            {
                key: 'date1',
                type: 'datepicker',
                templateOptions: {
                    label: 'Date 1',
                    type: 'text',
                    datepickerPopup: 'dd-MMMM-yyyy'
                }
            },
            {
                key: 'checkbox',
                type: 'checkbox',
                templateOptions: {
                    label: 'Disable Date 2',
                }
            },
            {
                key: 'date2',
                type: 'datepicker',
                templateOptions: {
                    label: 'Date 2',
                    type: 'text',
                    datepickerPopup: 'dd-MMMM-yyyy',
                    //this houdl override datepicker format on formlyConfig and it did
                    datepickerOptions: {
                        format: 'dd-MMMM-yyyy'
                    }
                },
                expressionProperties: {
                    'templateOptions.disabled': 'model.checkbox'
                }
            }
        ];

        vm.originalFields = angular.copy(vm.fields);

        // function definition
        function onSubmit() {
            vm.options.updateInitialValue();
            alert(JSON.stringify(vm.model), null, 2);
        }
    });

})();*/
