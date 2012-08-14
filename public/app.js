// Load all the required libraries.
require(["backbone", "dombuilder"], function (Backbone, domBuilder) {

// Store references to certain dom elements in the page.
var $home = $("#home");
var $app = $("#app");
var $main = $("#main");
var $sidebar = $("#sidebar");
var $topbar = $("#topbar");
var $taskList = $("#taskList");
var $comments = $("#comments");

// makes the Login/Logout functions
var Session = Backbone.Model.extend({
  initialize: function () {
    var session = this;
    this.onAuth = function (data) {
      session.set({username: data.username})
    };
    $.get("/session", this.onAuth);
  },
  logout: function () {
    $.post("/logout", this.onAuth, "json");
    return this;
  },
  login: function (username, password, rememberMe) {
    $.post("/login", {
        username: username,
        password: password,
        rememberMe: rememberMe
      }, this.onAuth, "json");
    return this;
  }
});

// Gives the sessionview function that will load all the elements defined in that route, and add this login/logout functionality
var SessionView = Backbone.View.extend({
  tagName: "ul",
  className: "nav pull-right",
  initialize: function () {
    this.elements = {};
    this.model.bind('change', this.update, this);
  },
  render: function () {
    var model = this.model;
    var elements = this.elements;

    // uses the login/logout functions to make a nice dropdown menu to login with, then returns username if logged in
    this.el.textContent = "";
    this.el.appendChild(domBuilder([
      ["li$username", ["a$usernameLabel", {href: "#projects"}, this.model.get("username")]],
      ["li.divider-vertical$divider"],
      ["li$signout", ["a.signout", {href: "#"}, "Sign Out"]],
      ["li$signup", ["a", {href: "#/signup"}, "Sign Up"]],
      ["li.dropdown$dropdown",
        ["a.dropdown-toggle", {href: "#", "data-toggle": "dropdown"}, "Sign In ", ["strong.caret"]],
        [".dropdown-menu", {css: {padding: "15px"}},
          ["form$form", {css: {margin: 0}},
            ["input", {type: "text", placeholder: "username", name: "username", size: 30}],
            ["input", {type: "password", placeholder: "password", name: "password", size: 30}],
            ["input", {type: "checkbox", name: "remember_me"}],
            ["label.string optional", {"for": "remember_me"}, "Remember me"],
            ["input.btn.btn-primary", {type: "submit", value: "Sign In"}]
          ]
        ]
      ]
    ], elements));
    this.update();

    elements.form.addEventListener("submit", function (evt) {
      evt.preventDefault();
      var form = elements.form;
      model.login(form.username.value, form.password.value, form.remember_me.checked);
    }, true);

    elements.signout.addEventListener("click", function (evt) {
      evt.preventDefault();
      model.logout();
    }, true);

    return this;
  },

  // defines which elements are display block or none
  update: function () {
    var username = this.model.get("username");
    if (username) {
      this.elements.username.style.display = "block";
      this.elements.usernameLabel.textContent = username;
      this.elements.signout.style.display = "block";
      this.elements.signup.style.display = "none";
      this.elements.dropdown.style.display = "none";
    }
    else {
      this.elements.username.style.display = "none";
      this.elements.signout.style.display = "none";
      this.elements.signup.style.display = "block";
      this.elements.dropdown.style.display = "block";
    }
  },
});

// defines session and session view
var session = new Session({username:""});
var sessionView = new SessionView({ model: session });
$topbar.append(sessionView.render().el);

// Define the routes
var Workspace = Backbone.Router.extend({
  routes: {
    "": "home",
    "projects": "projects",
    "projects/:project_id": "project",
    "projects/:project_id/:task_id": "task",
  },

  // Hide the app pane and show the home pane which is just static html.
  home: function () {
    $home.show();
    $app.hide();
  },

  // Draw the list of projects on the left, keep the right blank
  projects: function () {
    $home.hide();
    $app.show();
    $taskList.hide();
    $comments.hide();
    $sidebar.html('<li class="nav-header">Projects</li><li><a href="#projects/asd5f4a7sd4f">My Project</a></li>')
    // jQuery.get("/projects", function (projects) {
    //   document.body.textContent = JSON.stringify(projects);
    //   console.log(projects)
    // });
  },

  // Same as projects, but also render all tasks for this project in the right
  project: function (projectId) {
    $home.hide();
    $app.show();
    $sidebar.empty();
    $main.empty();
    $taskList.empty();
    $.get("/projects/" + projectId, function (data) {
      console.log(data);
      $sidebar.append(domBuilder([
        ["li.nav-header", "Projects"],
        ["li",
          ["a", {href:"#projects/asd5f4a7sd4f"}, "My Project"]
        ]
      ]));
      $main.append(domBuilder([
        [".hero-unit",
          ["h1#projectName", "Project1"], "From the orginization ",
          ["span#projectOrgId", "Orginization1"],
          ["br"], "About the Project: ",
          ["span#projectInfo", "Project is yada yada yada"],
          ["br"], "Due: ",
          ["span#projectDue", "so/me/date"]
        ]
      ]));
      $taskList.append(domBuilder([
        ["h2", "Tasks"],
        ["ul.accordion#accordion", {$: function (el) { $(el).sortable().disableSelection(); }},
          ["li.accordion-group",
            [".accordion-heading",
              ["a.accordion-toggle",
                {"data-toggle": "collapse", "data-parent": "#accordion", href: "#collapseOne"},
                "Basic Task Info"
              ]
            ],
            ["#collapseOne.accordion-body.collapse",
              [".accordion-inner", "Detailed Description"]
            ]
          ],
          ["li.accordion-group",
            [".accordion-heading",
              ["a.accordion-toggle",
                {"data-toggle": "collapse", "data-parent": "#accordion", href: "#collapseTwo"},
                "Basic Task Info2"
              ]
            ],
            ["#collapseTwo.accordion-body.collapse",
              [".accordion-inner", "Detailed Description2"]
            ]
          ]
        ]
      ]));
    });
  },

  // Same as project(projectId), but also expand and scroll to a particular task
  task: function (projectId, taskId) {
  }

});

// defines the workspace that will keep track of the history
var workspace = new Workspace;
Backbone.history.start();

});

// var attempted;
// $(document).ajaxError( function(e, xhr, options){
//   attempted = location.hash;
//   Backbone.history.navigate("login", true);
// });

//   // Fix input element click problem
//   $('.dropdown input, .dropdown label').click(function(e) {
//     e.stopPropagation();
//   });
// });

//   project.fetch().done(function (data) {
//     document.title = data.title;
//     view.render();
//     document.body.textContent = "";
//     document.body.appendChild(view.el);
//   });
