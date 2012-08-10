// issue: when i load /projects works fine, load /project/project_id works fine, but when i go back to /projects, doesnt work, when I go to projects/project_id it doesnt work either. push refresh on either page while its not working, and it fixes itself...WHAT?
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

  projects: function () {
    $home.hide();
    $app.show();
    $taskList.hide();
    $comments.hide();
    $sidebar.html('<li class="nav-header">Projects</li><li><a href="#projects/123">My Project</a></li>')
    // Draw the list of projects on the left, keep the right blank
    // document.body.textContent = "Loading...";
    // jQuery.get("/projects", function (projects) {
    //   document.body.textContent = JSON.stringify(projects);
    //   console.log(projects)
    // });
  },

  project: function (projectId) {
    $home.hide();
    $app.show();
    $sidebar.html('<li class="nav-header">Projects</li><li><a href="#projects/123">My Project</a></li>');
    $main.html('<div class="hero-unit"><h1 id="projectName">Project1</h1><p>From the organization <span id="projectOrgId">Organization1</span><br>About the Project: <span id="projectInfo">Project is about yada yada yada.</span><br>Due: <span id="projectDue">so/me/date</span></div>');
    $taskList.html('<h3>Tasks</h3><ul id="sortableTasks"><li><span id="taskIsDone"> NOT FINISHED </span><span id="taskName"> NAMED Task1 </span><span id="taskDue"> DUE so/me/date </span></li></ul>');
    // Same as projects, but also render all tasks for this project in the right
  },

  task: function (projectId, taskId) {
    // Same as project(projectId), but also expand and scroll to a particular task
  }

});

var workspace = new Workspace;
Backbone.history.start();

});

// var attempted;
// $(document).ajaxError( function(e, xhr, options){
//   attempted = location.hash;
//   Backbone.history.navigate("login", true);
// });

// $('#sortableTasks').sortable({
//   update: function(event, ui) {
//     var newOrder = $(this).sortable('toArray').toString();
//     $.get('saveSortable.php', {order:newOrder});
//   }
// });

// $(function() {
//   // Setup drop down menu
//   // TODO: get dropdown plugin
//   // $('.dropdown-toggle').dropdown();

//   // Fix input element click problem
//   $('.dropdown input, .dropdown label').click(function(e) {
//     e.stopPropagation();
//   });
// });

// var Project = Backbone.Model.extend({
//   url: function () {
//     return "/projects/" + this.id;
//   }
// });

// var ProjectView = Backbone.View.extend({
//   render: function () {
//     this.el.textContent = "";
//     this.el.appendChild(domBuilder([
//       ["h1", this.model.get("title")],
//       ["ul.tasks", this.model.get("tasks").map(function (task) {
//         return ["li", task.title + " - " + task.description];
//       })]
//     ]));
//   }
// });


  // login: function () {
  //   document.body.textContent = "";
  //   document.title = "Please Login";
  //   document.body.appendChild(domBuilder([
  //     ["h1", "Please Login"],
  //     ["form", {onsubmit: onSubmit},
  //       ["label", {"for":"username"}, "Username:"],
  //       ["input$username", {type: "text", name: "username"}],
  //       ["label", {"for":"password"}, "Password:"],
  //       ["input$password", {type: "password", name: "password"}],
  //       ["input", {type: "submit", value: "Login"}]
  //     ]
  //   ], $));
  //   function onSubmit(evt) {
  //     evt.preventDefault();
  //     var data = {
  //       username: $.username.value,
  //       password: $.password.value,
  //     }
  //     jQuery.ajax("/login", {
  //       type: "POST",
  //       data: JSON.stringify(data),
  //       contentType: "application/json; charset=utf-8",
  //       dataType: "json",
  //       success: function (session) {
  //         if (session.username) {
  //           username = session.username;
  //           var target = "";
  //           if (attempted) {
  //             target = attempted;
  //             attempted = undefined;
  //           }
  //           Backbone.history.navigate(target, true);
  //         }
  //         else {
  //           alert("INVALID LOGIN");
  //         }
  //       }
  //     });
  //   }
  // },

  // project: function (id) {
  //   document.title = "Loading Project...";

  //   project = new Project({id:id});
  //   view = new ProjectView({model: project});

  //   document.body.textContent = "Loading Project...";

  //   project.fetch().done(function (data) {
  //     document.title = data.title;
  //     view.render();
  //     document.body.textContent = "";
  //     document.body.appendChild(view.el);
  //   });

  // }
