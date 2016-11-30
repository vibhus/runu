var app = angular.module('app', ['ngRoute', 'ngAnimate', 'ngSanitize', 'ui.bootstrap', 'formly', 'formlyBootstrap', 'ui.grid', 'ui.grid.selection']);

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
      when('/edit', {
        templateUrl: 'views/edit/edit.html',
        controller: 'EditCtrl'
      }).
      when('/reports', {
        templateUrl: 'views/reports/reports.html',
        controller: 'SettingsCtrl'
      }).
      when('/sales', {
        templateUrl: 'views/forms/sales.html',
        controller: 'SalesCtrl'
      }).
      when('/production', {
        templateUrl: 'views/forms/production.html',
        controller: 'ProductionCtrl'
      }).
      when('/purchase-goods', {
        templateUrl: 'views/forms/purchase-goods.html',
        controller: 'PurchaseGoodsCtrl'
      }).
      when('/purchase-assets', {
        templateUrl: 'views/forms/purchase-assets.html',
        controller: 'PurchaseAssetsCtrl'
      }).
      when('/purchase-expenses', {
        templateUrl: 'views/forms/purchase-expenses.html',
        controller: 'PurchaseExpensesCtrl'
      }).
      when('/stock-take', {
        templateUrl: 'views/forms/stock-take.html',
        controller: 'StockTakeCtrl'
      }).
        when('/collection-before', {
            templateUrl: 'views/forms/collection-before.html',
            controller: 'CollectionBeforeCtrl'
        }).
        when('/collection-after', {
            templateUrl: 'views/forms/collection-after.html',
            controller: 'CollectionAfterCtrl'
        }).
        when('/payment-before', {
            templateUrl: 'views/forms/payment-before.html',
            controller: 'PaymentBeforeCtrl'
        }).
        when('/payment-after', {
            templateUrl: 'views/forms/payment-after.html',
            controller: 'PaymentAfterCtrl'
        }).
        when('/employee-hiring', {
            templateUrl: 'views/forms/employee-hiring.html',
            controller: 'EmployeeHiringCtrl'
        }).
        when('/employee-firing', {
            templateUrl: 'views/forms/employee-firing.html',
            controller: 'EmployeeFiringCtrl'
        }).
        when('/employee-change-salary', {
            templateUrl: 'views/forms/employee-change-salary.html',
            controller: 'EmployeeChangeSalaryCtrl'
        }).
        when('/journals', {
            templateUrl: 'views/forms/journal.html',
            controller: 'JournalCtrl'
        }).
      otherwise({
        redirectTo: '/login'
      });
}]);

app.constant('CONSTANTS', {
  AUTH_HOME_PAGE: '/settings',
    PATH: {
        BASIC_FORM: "views/forms/form.html",
        FORMS: "views/forms/"
    }
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

    var unique = 1;
    formlyConfig.setType({
        name: 'repeatSection',
        templateUrl: 'repeatSection.html',
        controller: function($scope) {
            $scope.formOptions = {formState: $scope.formState};
            $scope.addNew = addNew;

            $scope.copyFields = copyFields;


            function copyFields(fields) {
                fields = angular.copy(fields);
                addRandomIds(fields);
                return fields;
            }

            function addNew() {
                $scope.model[$scope.options.key] = $scope.model[$scope.options.key] || [];
                var repeatsection = $scope.model[$scope.options.key];
                var lastSection = repeatsection[repeatsection.length - 1];
                var newsection = {};
                if (lastSection) {
                    newsection = angular.copy(lastSection);
                }
                repeatsection.push(newsection);
            }

            function addRandomIds(fields) {
                unique++;
                angular.forEach(fields, function(field, index) {
                    if (field.fieldGroup) {
                        addRandomIds(field.fieldGroup);
                        return; // fieldGroups don't need an ID
                    }

                    if (field.templateOptions && field.templateOptions.fields) {
                        addRandomIds(field.templateOptions.fields);
                    }

                    field.id = field.id || (field.key + '_' + index + '_' + unique + getRandomInt(0, 9999));
                });
            }

            function getRandomInt(min, max) {
                return Math.floor(Math.random() * (max - min)) + min;
            }
        }
    });
});

app.controller('AppCtrl', ['$scope', '$rootScope', 'CONSTANTS', function($s, $rs, CONSTANTS) {
  console.log('woo hoo', $s);
    $s.CONSTANTS = CONSTANTS;
  $rs.userInfo = {
    authenticated: true
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
      page: "/purchase",
        "forms": [
            {
                "name": "Purchase Goods",
                "page": "/purchase-goods"
            },
            {
                "name": "Purchase Assets",
                "page": "/purchase-assets"
            },
            {
                "name": "Purchase Expenses",
                "page": "/purchase-expenses"
            }
        ]
    },
    {
      name: "Collection",
      page: "/collection",
        "forms": [
            {
                "name": "Collection Before",
                "page": "/collection-before"
            },
            {
                "name": "Collection After",
                "page": "/collection-after"
            }
        ]
    },
    {
      name: "Payment",
      page: "/payment",
        "forms": [
            {
                "name": "Payment Before",
                "page": "/payment-before"
            },
            {
                "name": "Payment After",
                "page": "/payment-after"
            }
        ]
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
      page: "/employees",
        "forms": [
            {
                "name": "Employee Hiring",
                "page": "/employee-hiring"
            },
            {
                "name": "Employee Change Salary",
                "page": "/employee-change-salary"
            },
            {
                "name": "Employee Firing",
                "page": "/employee-firing"
            }
        ]
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
    $s.pageTitle ='Sales';
    $s.vm = {};
    var vm = $s.vm; // vm stands for "View Model" --> see https://github.com/johnpapa/angular-styleguide#controlleras-with-vm
    vm.model = {};
    var modelInitializer = $s.$on('init-model', function (e,model) {
        console.log('initializing in sales', model);
        vm.model = model;
    });

    function onSubmit() {
        console.log('form submitted:', vm.model);
    }

    vm.fields = [
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

    $s.$on('$destroy', modelInitializer);
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

app.controller('CollectionBeforeCtrl', ['$scope', function($s){
    console.log('CollectionBeforeCtrl', $s);
    $s.pageTitle ='Collection Before';
    $s.vm = {};
    var vm = $s.vm; // vm stands for "View Model" --> see https://github.com/johnpapa/angular-styleguide#controlleras-with-vm
    vm.model = {};

    function onSubmit() {
        console.log('form submitted:', vm.model);
    }

    vm.fields = [
        {
            // the key to be used in the model values
            // so this will be bound to vm.user.username
            key: 'collectionnumber',
            type: 'input',
            templateOptions: {
                placeholder: 'Collection Number',
                disabled: true
            }
        },
        {
            key: 'collectiondate',
            type: 'datepicker',
            templateOptions: {
                type: 'text',
                placeholder: 'Collection Date',
                datepickerPopup: 'dd-MM-yyyy',
                required: true
            }
        },
        {
            key: 'reference',
            type: 'input',
            templateOptions: {
                type: 'text',
                placeholder: 'Reference',
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
            key: 'customername',
            type: 'select',
            templateOptions: {
                type: 'text',
                placeholder: 'Customer Name',
                options: [],
                required: true
            }
        },
        {
            key: 'moneycollected',
            type: 'input',
            templateOptions: {
                type: 'number',
                placeholder: 'Money Collected',
                required: true
            }
        }
    ];

    vm.onSubmit = onSubmit;
}]);

app.controller('CollectionAfterCtrl', ['$scope', function($s){
    console.log('CollectionAfterCtrl', $s);
    $s.pageTitle ='Collection After';
    $s.vm = {};
    var vm = $s.vm; // vm stands for "View Model" --> see https://github.com/johnpapa/angular-styleguide#controlleras-with-vm
    vm.model = {};

    function onSubmit() {
        console.log('form submitted:', vm.model);
    }

    vm.fields = [
        {
            // the key to be used in the model values
            // so this will be bound to vm.user.username
            key: 'collectionnumber',
            type: 'input',
            templateOptions: {
                placeholder: 'Collection Number',
                disabled: true
            }
        },
        {
            key: 'collectiondate',
            type: 'datepicker',
            templateOptions: {
                type: 'text',
                placeholder: 'Collection Date',
                datepickerPopup: 'dd-MM-yyyy',
                required: true
            }
        },
        {
            key: 'reference',
            type: 'input',
            templateOptions: {
                type: 'text',
                placeholder: 'Reference',
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
            key: 'customername',
            type: 'select',
            templateOptions: {
                type: 'text',
                placeholder: 'Customer Name',
                options: [],
                required: true
            }
        },
        {
            key: 'moneycollected',
            type: 'input',
            templateOptions: {
                type: 'number',
                placeholder: 'Money Collected',
                required: true
            }
        }
    ];

    vm.onSubmit = onSubmit;
}]);

app.controller('PurchaseGoodsCtrl', ['$scope', function ($s) {
    $s.pageTitle = 'Purchase Goods';
    $s.vm = {};
    var vm = $s.vm; // vm stands for "View Model" --> see https://github.com/johnpapa/angular-styleguide#controlleras-with-vm
    vm.model = {
        inventories: [
            {
                'inventorypurchased': '',
                'quantity': '',
                'inventorycost': ''
            }
        ]
    };

    function onSubmit() {
        console.log('form submitted:', vm.model);
    }

    vm.fields = [
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
            key: 'goodreceiveddate',
            type: 'datepicker',
            templateOptions: {
                type: 'text',
                placeholder: 'Goods Received Date',
                datepickerPopup: 'dd-MM-yyyy',
                required: true
            }
        },
        {
            key: 'reference',
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
            type: 'input',
            templateOptions: {
                type: 'number',
                placeholder: 'Currency',
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
            type: 'repeatSection',
            key: 'inventories',
            templateOptions: {
                title: 'Inventories',
                btnText: 'Add another inventory',
                fields: [
                    {
                        key: 'inventorypurchased',
                        type: 'select',
                        templateOptions: {
                            placeholder: 'Inventory Purchased',
                            options: [
                                {
                                    name: 'Inventory Purchased',
                                    value:''
                                }
                            ],
                            required: true
                        }
                    },
                    {
                        key: 'quantity',
                        type: 'input',
                        templateOptions: {
                            type: 'number',
                            placeholder: 'Quantity',
                            required: true
                        }
                    },
                    {
                        key: 'inventorycost',
                        type: 'input',
                        templateOptions: {
                            type: 'number',
                            placeholder: 'Cost of Inventory Purchased',
                            required: true
                        }
                    }
                ]
            }
        },
        {
            key: 'suppliername',
            type: 'select',
            templateOptions: {
                type: 'text',
                placeholder: 'Supplier Name',
                required: true
            }
        },
        {
            key: 'previouslypaid',
            type: 'input',
            templateOptions: {
                type: 'number',
                placeholder: 'Previously Paid',
                required: false
            }
        },
        {
            key: 'prepaymentused',
            type: 'input',
            templateOptions: {
                type: 'text',
                placeholder: 'Prepayment Used',
                required: true
            }
        },
        {
            key: 'moneypaid',
            type: 'input',
            templateOptions: {
                type: 'number',
                placeholder: 'Money Paid',
                required: true
            }
        },
        {
            key: 'moneynotpaid',
            type: 'input',
            templateOptions: {
                type: 'number',
                placeholder: 'Money Not Paid',
                required: true
            }
        }
    ];

    vm.onSubmit = onSubmit;
}]);

app.controller('PurchaseAssetsCtrl', ['$scope', function ($s) {
    $s.pageTitle = 'Purchase Assets';
    $s.vm = {};
    var vm = $s.vm; // vm stands for "View Model" --> see https://github.com/johnpapa/angular-styleguide#controlleras-with-vm
    vm.model = {
        assets: [
            {
                'assetpurchased': ''
            }
        ]
    };

    function onSubmit() {
        console.log('form submitted:', vm.model);
    }

    vm.fields = [
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
            key: 'goodreceiveddate',
            type: 'datepicker',
            templateOptions: {
                type: 'text',
                placeholder: 'Goods Received Date',
                datepickerPopup: 'dd-MM-yyyy',
                required: true
            }
        },
        {
            key: 'reference',
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
            type: 'input',
            templateOptions: {
                type: 'number',
                placeholder: 'Currency',
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
            type: 'repeatSection',
            key: 'assets',
            templateOptions: {
                btnText: 'Add another Asset',
                title: 'Assets',
                fields: [
                    {
                        key: 'assetpurchased',
                        type: 'select',
                        templateOptions: {
                            placeholder: 'Asset /home/vibhus/Personal/SiteWork/RuNu/app.js',
                            options: [
                                {
                                    name: 'Asset Purchased',
                                    value:''
                                }
                            ],
                            required: true
                        }
                    },
                    {
                        key: 'assetdescription',
                        type: 'input',
                        templateOptions: {
                            type: 'text',
                            placeholder: 'Asset Description',
                            required: true
                        }
                    },
                    {
                        key: 'usefullife',
                        type: 'input',
                        templateOptions: {
                            type: 'number',
                            placeholder: 'Useful Life',
                            required: true
                        }
                    },
                    {
                        key: 'startdateofuse',
                        type: 'datepicker',
                        templateOptions: {
                            type: 'text',
                            placeholder: 'Start Date of Use',
                            datepickerPopup: 'dd-MM-yyyy',
                            required: true
                        }
                    },
                    {
                        key: 'quantity',
                        type: 'input',
                        templateOptions: {
                            type: 'number',
                            placeholder: 'Quantity',
                            required: true
                        }
                    },
                    {
                        key: 'assetcost',
                        type: 'input',
                        templateOptions: {
                            type: 'number',
                            placeholder: 'Cost of Asset Purchased',
                            required: true
                        }
                    }
                ]
            }
        },
        {
            key: 'suppliername',
            type: 'select',
            templateOptions: {
                type: 'text',
                placeholder: 'Supplier Name',
                required: true
            }
        },
        {
            key: 'previouslypaid',
            type: 'input',
            templateOptions: {
                type: 'number',
                placeholder: 'Previously Paid',
                required: false
            }
        },
        {
            key: 'prepaymentused',
            type: 'input',
            templateOptions: {
                type: 'text',
                placeholder: 'Prepayment Used',
                required: true
            }
        },
        {
            key: 'moneypaid',
            type: 'input',
            templateOptions: {
                type: 'number',
                placeholder: 'Money Paid',
                required: true
            }
        },
        {
            key: 'moneynotpaid',
            type: 'input',
            templateOptions: {
                type: 'number',
                placeholder: 'Money Not Paid',
                required: true
            }
        }
    ];

    vm.onSubmit = onSubmit;
}]);

app.controller('PurchaseExpensesCtrl', ['$scope', function ($s) {
    $s.pageTitle = 'Purchase Expenses';
    $s.vm = {};
    var vm = $s.vm; // vm stands for "View Model" --> see https://github.com/johnpapa/angular-styleguide#controlleras-with-vm
    vm.model = {
        expenses: [
            {
                'expensetype': ''
            }
        ]
    };

    function onSubmit() {
        console.log('form submitted:', vm.model);
    }

    vm.fields = [
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
            key: 'reference',
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
            type: 'input',
            templateOptions: {
                type: 'number',
                placeholder: 'Currency',
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
            type: 'repeatSection',
            key: 'expenses',
            templateOptions: {
                title: 'Expenses',
                btnText: 'Add another Expense',
                fields: [
                    {
                        key: 'expensetype',
                        type: 'select',
                        templateOptions: {
                            options: [
                                {
                                    name: 'Expense Type',
                                    value:''
                                }
                            ],
                            required: true
                        }
                    },
                    {
                        key: 'amount',
                        type: 'input',
                        templateOptions: {
                            type: 'number',
                            placeholder: 'Cost of Expense',
                            required: true
                        }
                    }
                ]
            }
        },
        {
            key: 'suppliername',
            type: 'select',
            templateOptions: {
                type: 'text',
                placeholder: 'Supplier Name',
                required: true
            }
        },
        {
            key: 'previouslypaid',
            type: 'input',
            templateOptions: {
                type: 'number',
                placeholder: 'Previously Paid',
                required: false
            }
        },
        {
            key: 'prepaymentused',
            type: 'input',
            templateOptions: {
                type: 'text',
                placeholder: 'Prepayment Used',
                required: true
            }
        },
        {
            key: 'moneypaid',
            type: 'input',
            templateOptions: {
                type: 'number',
                placeholder: 'Money Paid',
                required: true
            }
        },
        {
            key: 'moneynotpaid',
            type: 'input',
            templateOptions: {
                type: 'number',
                placeholder: 'Money Not Paid',
                required: true
            }
        }
    ];

    vm.onSubmit = onSubmit;
}]);

app.controller('ProductionCtrl', ['$scope', function ($s) {
    $s.pageTitle = 'Production';
    $s.vm = {};
    var vm = $s.vm; // vm stands for "View Model" --> see https://github.com/johnpapa/angular-styleguide#controlleras-with-vm
    vm.model = {
        inventories: [
            {
                'inventoryused': ''
            }
        ],
        inventoryproduced: ''
    };

    function onSubmit() {
        console.log('form submitted:', vm.model);
    }

    vm.fields = [
        {
            // the key to be used in the model values
            // so this will be bound to vm.user.username
            key: 'productionnumber',
            type: 'input',
            templateOptions: {
                placeholder: 'Production Number',
                required: true
            }
        },
        {
            key: 'productiondate',
            type: 'datepicker',
            templateOptions: {
                type: 'text',
                placeholder: 'Production Date',
                datepickerPopup: 'dd-MM-yyyy',
                required: true
            }
        },
        {
            key: 'reference',
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
            type: 'repeatSection',
            key: 'inventories',
            templateOptions: {
                title: 'Inventories',
                btnText: 'Add another Inventory',
                fields: [
                    {
                        key: 'inventoryused',
                        type: 'select',
                        templateOptions: {
                            options: [
                                {
                                    name: 'Inventory Used',
                                    value:''
                                }
                            ],
                            required: true
                        }
                    },
                    {
                        key: 'units',
                        type: 'input',
                        templateOptions: {
                            type: 'number',
                            placeholder: 'Units used',
                            required: true
                        }
                    },
                    {
                        key: 'quantity',
                        type: 'input',
                        templateOptions: {
                            type: 'number',
                            placeholder: 'Quantity of inventory used',
                            required: true
                        }
                    },
                    {
                        key: 'cost',
                        type: 'input',
                        templateOptions: {
                            type: 'number',
                            placeholder: 'Cost of Inventory Used',
                            required: true
                        }
                    }
                ]
            }
        },
        {
            key: 'inventoryproduced',
            type: 'select',
            templateOptions: {
                options: [
                    {
                        name: 'Inventory Produced',
                        value:''
                    }
                ],
                required: true
            }
        },
        {
            key: 'units',
            type: 'input',
            templateOptions: {
                type: 'number',
                placeholder: 'Units of inventory produced',
                required: true
            }
        },
        {
            key: 'quantity',
            type: 'input',
            templateOptions: {
                type: 'number',
                placeholder: 'Quantity Produced',
                required: true
            }
        },
        {
            key: 'cost',
            type: 'input',
            templateOptions: {
                type: 'number',
                placeholder: 'Cost of Inventory Produced',
                required: true
            }
        }
    ];

    vm.onSubmit = onSubmit;
}]);

app.controller('PaymentBeforeCtrl', ['$scope', function($s){
    console.log('PaymentBeforeCtrl', $s);
    $s.pageTitle ='Payment Before';
    $s.vm = {};
    var vm = $s.vm; // vm stands for "View Model" --> see https://github.com/johnpapa/angular-styleguide#controlleras-with-vm
    vm.model = {};

    function onSubmit() {
        console.log('form submitted:', vm.model);
    }

    vm.fields = [
        {
            // the key to be used in the model values
            // so this will be bound to vm.user.username
            key: 'paymentnumber',
            type: 'input',
            templateOptions: {
                placeholder: 'Payment Number',
                disabled: true
            }
        },
        {
            key: 'paymentdate',
            type: 'datepicker',
            templateOptions: {
                type: 'text',
                placeholder: 'Payment Date',
                datepickerPopup: 'dd-MM-yyyy',
                required: true
            }
        },
        {
            key: 'reference',
            type: 'input',
            templateOptions: {
                type: 'text',
                placeholder: 'Reference',
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
            key: 'suppliername',
            type: 'select',
            templateOptions: {
                type: 'text',
                placeholder: 'Supplier Name',
                options: [],
                required: true
            }
        },
        {
            key: 'moneypaid',
            type: 'input',
            templateOptions: {
                type: 'number',
                placeholder: 'Money Paid',
                required: true
            }
        }
    ];

    vm.onSubmit = onSubmit;
}]);

app.controller('PaymentAfterCtrl', ['$scope', function($s){
    console.log('PaymentAfterCtrl', $s);
    $s.pageTitle = 'Payment After';
    $s.vm = {};
    var vm = $s.vm; // vm stands for "View Model" --> see https://github.com/johnpapa/angular-styleguide#controlleras-with-vm
    vm.model = {};

    function onSubmit() {
        console.log('form submitted:', vm.model);
    }

    vm.fields = [
        {
            // the key to be used in the model values
            // so this will be bound to vm.user.username
            key: 'paymentnumber',
            type: 'input',
            templateOptions: {
                placeholder: 'Payment Number',
                disabled: true
            }
        },
        {
            key: 'paymentdate',
            type: 'datepicker',
            templateOptions: {
                type: 'text',
                placeholder: 'Payment Date',
                datepickerPopup: 'dd-MM-yyyy',
                required: true
            }
        },
        {
            key: 'reference',
            type: 'input',
            templateOptions: {
                type: 'text',
                placeholder: 'Reference',
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
            key: 'suppliername',
            type: 'select',
            templateOptions: {
                type: 'text',
                placeholder: 'Supplier Name',
                options: [],
                required: true
            }
        },
        {
            key: 'moneypaid',
            type: 'input',
            templateOptions: {
                type: 'number',
                placeholder: 'Money Paid',
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

    vm.fields = [
        {
            // the key to be used in the model values
            // so this will be bound to vm.user.username
            key: 'stoketakenumber',
            type: 'input',
            templateOptions: {
                placeholder: 'Stoke Take Number',
                disabled: true
            }
        },
        {
            key: 'stoketakedate',
            type: 'datepicker',
            templateOptions: {
                type: 'text',
                placeholder: 'Stoke Take Date',
                datepickerPopup: 'dd-MM-yyyy',
                required: true
            }
        },
        {
            key: 'reference',
            type: 'input',
            templateOptions: {
                type: 'text',
                placeholder: 'Reference',
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
            key: 'stoketakename',
            type: 'select',
            templateOptions: {
                type: 'text',
                placeholder: 'Stoke Take Name',
                options: [],
                required: true
            }
        },
        {
            key: 'inventoryunits',
            type: 'input',
            templateOptions: {
                type: 'number',
                placeholder: 'Units of Inventory',
                required: true
            }
        },
        {
            key: 'currentquantity',
            type: 'input',
            templateOptions: {
                type: 'number',
                placeholder: 'Current Quantity',
                required: true
            }
        }
    ];

    vm.onSubmit = onSubmit;
}]);

app.controller('EmployeeHiringCtrl', ['$scope', function($s){
    $s.pageTitle = 'Employee Hiring';
    $s.vm = {};
    var vm = $s.vm; // vm stands for "View Model" --> see https://github.com/johnpapa/angular-styleguide#controlleras-with-vm
    vm.formData = {};

    function onSubmit() {
        console.log('form submitted:', vm.sales);
    }

    vm.fields = [
        {
            // the key to be used in the model values
            // so this will be bound to vm.user.username
            key: 'employeenumber',
            type: 'input',
            templateOptions: {
                placeholder: 'Employee Number',
                disabled: true
            }
        },
        {
            key: 'employeehiredate',
            type: 'datepicker',
            templateOptions: {
                type: 'text',
                placeholder: 'Employee Hire Date',
                datepickerPopup: 'dd-MM-yyyy',
                required: true
            }
        },
        {
            key: 'reference',
            type: 'input',
            templateOptions: {
                type: 'text',
                placeholder: 'Reference',
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
            key: 'employeename',
            type: 'input',
            templateOptions: {
                type: 'text',
                placeholder: 'Employee Name',
                required: true
            }
        },
        {
            key: 'annualsalary',
            type: 'input',
            templateOptions: {
                type: 'number',
                placeholder: 'Annual Salary',
                required: true
            }
        },
        {
            key: 'monthlysalary',
            type: 'input',
            templateOptions: {
                type: 'number',
                placeholder: 'Monthly Salary',
                required: true
            }
        },
        {
            key: 'dailysalary',
            type: 'input',
            templateOptions: {
                type: 'number',
                placeholder: 'Daily Salary',
                required: true
            }
        }
    ];

    vm.onSubmit = onSubmit;
}]);

app.controller('EmployeeChangeSalaryCtrl', ['$scope', function($s){
    $s.pageTitle = 'Employee Salary Change';
    $s.vm = {};
    var vm = $s.vm; // vm stands for "View Model" --> see https://github.com/johnpapa/angular-styleguide#controlleras-with-vm
    vm.formData = {};

    function onSubmit() {
        console.log('form submitted:', vm.sales);
    }

    vm.fields = [
        {
            // the key to be used in the model values
            // so this will be bound to vm.user.username
            key: 'employeenumber',
            type: 'input',
            templateOptions: {
                placeholder: 'Employee Number',
                disabled: true
            }
        },
        {
            key: 'salarychangedate',
            type: 'datepicker',
            templateOptions: {
                type: 'text',
                placeholder: 'Salary Change Date',
                datepickerPopup: 'dd-MM-yyyy',
                required: true
            }
        },
        {
            key: 'reference',
            type: 'input',
            templateOptions: {
                type: 'text',
                placeholder: 'Reference',
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
            key: 'employeename',
            type: 'input',
            templateOptions: {
                type: 'text',
                placeholder: 'Employee Name',
                required: true
            }
        },
        {
            key: 'annualsalary',
            type: 'input',
            templateOptions: {
                type: 'number',
                placeholder: 'Annual Salary',
                required: true
            }
        },
        {
            key: 'monthlysalary',
            type: 'input',
            templateOptions: {
                type: 'number',
                placeholder: 'Monthly Salary',
                required: true
            }
        },
        {
            key: 'dailysalary',
            type: 'input',
            templateOptions: {
                type: 'number',
                placeholder: 'Daily Salary',
                required: true
            }
        }
    ];

    vm.onSubmit = onSubmit;
}]);

app.controller('EmployeeFiringCtrl', ['$scope', function($s){
    $s.pageTitle = 'Employee Firing';
    $s.vm = {};
    var vm = $s.vm; // vm stands for "View Model" --> see https://github.com/johnpapa/angular-styleguide#controlleras-with-vm
    vm.formData = {};

    function onSubmit() {
        console.log('form submitted:', vm.sales);
    }

    vm.fields = [
        {
            // the key to be used in the model values
            // so this will be bound to vm.user.username
            key: 'employeenumber',
            type: 'input',
            templateOptions: {
                placeholder: 'Employee Number',
                disabled: true
            }
        },
        {
            key: 'employeefiredate',
            type: 'datepicker',
            templateOptions: {
                type: 'text',
                placeholder: 'Employee Fire Date',
                datepickerPopup: 'dd-MM-yyyy',
                required: true
            }
        },
        {
            key: 'reference',
            type: 'input',
            templateOptions: {
                type: 'text',
                placeholder: 'Reference',
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
            key: 'employeename',
            type: 'input',
            templateOptions: {
                type: 'text',
                placeholder: 'Employee Name',
                required: true
            }
        },
        {
            key: 'annualsalary',
            type: 'input',
            templateOptions: {
                type: 'number',
                placeholder: 'Annual Salary',
                required: true
            }
        },
        {
            key: 'monthlysalary',
            type: 'input',
            templateOptions: {
                type: 'number',
                placeholder: 'Monthly Salary',
                required: true
            }
        },
        {
            key: 'dailysalary',
            type: 'input',
            templateOptions: {
                type: 'number',
                placeholder: 'Daily Salary',
                required: true
            }
        }
    ];

    vm.onSubmit = onSubmit;
}]);

app.controller('JournalCtrl', ['$scope', function($s){
    $s.pageTitle = 'Journal';
    $s.vm = {};
    var vm = $s.vm; // vm stands for "View Model" --> see https://github.com/johnpapa/angular-styleguide#controlleras-with-vm
    vm.formData = {};

    function onSubmit() {
        console.log('form submitted:', vm.sales);
    }

    vm.fields = [
        {
            // the key to be used in the model values
            // so this will be bound to vm.user.username
            key: 'journalnumber',
            type: 'input',
            templateOptions: {
                placeholder: 'Journal Number',
                disabled: true
            }
        },
        {
            key: 'journaldate',
            type: 'datepicker',
            templateOptions: {
                type: 'text',
                placeholder: 'Journal Date',
                datepickerPopup: 'dd-MM-yyyy',
                required: true
            }
        },
        {
            key: 'reference',
            type: 'input',
            templateOptions: {
                type: 'text',
                placeholder: 'Reference',
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
            key: 'debitaccount',
            type: 'input',
            templateOptions: {
                type: 'number',
                placeholder: 'Debit Account',
                required: true
            }
        },
        {
            key: 'debitamount',
            type: 'input',
            templateOptions: {
                type: 'number',
                placeholder: 'Debit Amount',
                required: true
            }
        },
        {
            key: 'creditaccount',
            type: 'input',
            templateOptions: {
                type: 'number',
                placeholder: 'Credit Account',
                required: true
            }
        },
        {
            key: 'creditamount',
            type: 'input',
            templateOptions: {
                type: 'number',
                placeholder: 'Credit Amount',
                required: true
            }
        }
    ];

    vm.onSubmit = onSubmit;
}]);

app.controller('EditCtrl', ['$scope', '$uibModal', function($s, $uibModal){
    $s.pageTitle = 'Edit';
    $s.vm = {};
    var vm = $s.vm; // vm stands for "View Model" --> see https://github.com/johnpapa/angular-styleguide#controlleras-with-vm
    vm.formCategories = [
        {"name": "Sales", "value": "sales", "path": "sales.html"},
        {"name": "Journals", "value": "journals", "path": "journal.html"}
    ];
    vm.formPathMap = {};
    vm.formCategories.forEach(function(form) {
        vm.formPathMap[form.value] = form.path;
    });

    function onSubmit() {
        console.log('form submitted:', vm.model);
    }

    vm.fields = [
        {
            key: 'formcategory',
            type: 'select',
            templateOptions: {
                options: vm.formCategories,
                required: true
            }
        },
        {
            key: 'startdate',
            type: 'datepicker',
            templateOptions: {
                type: 'text',
                placeholder: 'Starting Date',
                datepickerPopup: 'dd-MM-yyyy',
                required: true
            }
        },
        {
            key: 'enddate',
            type: 'datepicker',
            templateOptions: {
                type: 'text',
                placeholder: 'Ending Date',
                datepickerPopup: 'dd-MM-yyyy',
                required: true
            }
        }
    ];

    vm.onSubmit = onSubmit;

    $s.gridData = [
        {
            "firstname": "Steve",
            "lastname": "Rogers"
        },
        {
            "firstname": "Peter",
            "lastname": "Parker"
        }
    ];

    $s.gridOptions = {
        data: $s.gridData,
        enableRowSelection: true,
        enableRowHeaderSelection: false,
        multiSelect: false
    };

    $s.gridOptions.modifierKeysToMultiSelect = false;
    $s.gridOptions.noUnselect = true;
    $s.gridOptions.onRegisterApi = function( gridApi ) {
        $s.gridApi = gridApi;
    };

    $s.amend = function () {
        console.log($s.gridApi.selection.getSelectedRows());
        var transactionType = $s.vm.model.formcategory,
            transactionData = $s.gridApi.selection.getSelectedRows()[0];
        $uibModal.open({
            ariaLabelledBy: 'modal-title',
            ariaDescribedBy: 'modal-body',
            templateUrl: 'formModal.html',
            controller: 'FormModalCtrl',
            resolve: {
                data: function () {
                    return {
                        formcategory: transactionType,
                        data: transactionData,
                        formPathMap: vm.formPathMap
                    };
                }
            }
        });
    };

}]);

app.controller('FormModalCtrl', ['$scope', 'CONSTANTS', 'data', '$timeout', function($s, CONSTANTS, data, $timeout){
    console.log('dialog open', data);
    $s.CONSTANTS = CONSTANTS;
    $s.formcategory = data.formcategory;
    $s.vm = {
            'model': data.data
        };
    $s.formPathMap = data.formPathMap;
    $timeout(function () {
        $s.$broadcast("init-model", $s.vm.model);
    });
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
