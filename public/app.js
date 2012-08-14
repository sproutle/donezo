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
      ["li$signout", ["a.signout", {href: ""}, "Sign Out"]],
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

var Project = Backbone.Model.extend({
  initialize: function () {
    this.tasks = new TaskList;
    this.tasks.cid = this.cid;
    this.on("change", function () {
      this.tasks.reset(this.get("tasks"));
    }, this);
  },
  url: function () {
    return "/projects/" + this.get("id");
  }
});

var Projects = Backbone.Collection.extend({
  model: Project,
  url: "/projects"
});

var Task = Backbone.Model.extend({});

var TaskList = Backbone.Collection.extend({ model: Task });

var TaskView = Backbone.View.extend({
  tagName: "li",
  className: "accordion-group",
  initialize: function () {
    this.model.on("change", this.render, this);
  },
  render: function () {
    this.el.textContent = "";
    this.el.appendChild(domBuilder([
      [".accordion-heading",
        ["a.accordion-toggle", {
          "data-toggle": "collapse",
          "data-parent": "#tasks-" + this.model.collection.cid,
          href: "#task-" + this.model.cid
        }, this.model.get("title")]
      ],
      [".accordion-body.collapse", {id: "task-" + this.model.cid},
        [".accordion-inner", this.model.get("description")]
      ]
    ]));
    return this;
  }
});

var TaskListView = Backbone.View.extend({
  tagName: "ul",
  className: "accordion",
  initialize: function () {
    this.el.setAttribute("id", "tasks-" + this.model.cid);
    this.model.on("reset", this.render, this);
  },
  render: function () {
    this.el.textContent = "";
    this.el.appendChild(domBuilder([
      this.model.models.map(function (task) {
        var taskView = new TaskView({model: task});
        return taskView.render().el;
      })
    ]));
    $(this.el).sortable().disableSelection();
    return this;
  }
});

var ProjectView = Backbone.View.extend({
  className: "span9",
  initialize: function () {
    this.model.on("change", this.render, this);
    this.tasks = new TaskListView({model:this.model.tasks});
  },
  render: function () {
    this.el.textContent = "";
    console.log(this.model);
    this.el.appendChild(domBuilder([
      [".hero-unit",
        ["h1", this.model.get("title")],
        ["p", "From the orginization: Orginization1"],
        ["p", "About the Project: " + this.model.get("description")],
        ["p", "Due: ", formatDate(this.model.get("dueDate"))]
      ],
      [".hero-unit", {css:{margin:"20px 0"}}, this.tasks.render().el],
      [".hero-unit", "Loading comments..."]
    ]));
    return this;
  }
});

// defines session and session view
var session = new Session({username:""});
var sessionView = new SessionView({ model: session });
$topbar.append(sessionView.render().el);

var months = [
  "January",
  "Februrary",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December"
];

function formatDate(string) {
  var date = new Date(string);
  return months[date.getMonth()] + " " + date.getDate() + ", " + date.getFullYear();
}

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
    $app.html('<div class="span3"><div class="well sidebar-nav"><ul class="nav nav-list"><li class="nav-header">Projects</li><li><a href="#projects/asd5f4a7sd4f">My Project</a></li></ul></div></div>');
  },

  // Same as projects, but also render all tasks for this project in the right
  project: function (projectId) {
    var project = new Project({id: projectId});
    project.fetch();

    projectView = new ProjectView({model: project});

    $home.hide();
    $app.html('<div class="span3"><div class="well sidebar-nav"><ul class="nav nav-list"><li class="nav-header">Projects</li><li><a href="#projects/asd5f4a7sd4f">My Project</a></li></ul></div></div>');
    $app.append(projectView.el);
    projectView.el.textContent = "Loading...";
    $app.show();

    // $.get("/projects/" + projectId, function (data) {
    //   console.log(data);
    //   $sidebar.append(domBuilder([
    //     ["li.nav-header", "Projects"],
    //     ["li",
    //       ["a", {href:"#projects/asd5f4a7sd4f"}, "My Project"]
    //     ]
    //   ]));
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
