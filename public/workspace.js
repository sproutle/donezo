define("workspace", ["backbone", /*"domBuilder",*/ "project"], function (Backbone, /*domBuilder,*/ Project) {

  // Define the routes
  var Workspace = Backbone.Router.extend({
    routes: {
      "": "home",
      "projects": "projects",
      "projects/:project_id": "project",
      "projects/:project_id/:task_id": "task",
    },

    initialize: function (options) {
      for (var key in options) {
        this[key] = options[key];
      }
    },

    // Hide the app pane and show the home pane which is just static html.
    home: function () {
      this.$home.show();
      this.$app.hide();
    },

    // Draw the list of projects on the left, keep the right blank
    projects: function () {
      this.$home.hide();
      this.$app.show();
      // this.textContent = "";
      // this.appendChild(domBuilder([
      //   [".span3",
      //     [".well sidebar-nav",
      //       ["ul.nav nav-lis",
      //         ["li.nav-header", "Projects"],
      //         ["li",
      //           ["a",
      //             {href: "#projects/asd5f4a7sd47"},
      //             "My Project"
      //           ]
      //         ],
      //         ["br"],
      //         ["br"],
      //         ["li",
      //           ["button.btn",
      //             {data-toggle: "modal", href: "#myModal"}
      //             "Create Project"
      //           ]
      //         ]
      //       ]
      //     ]
      //   ],
      //   [".modal.fade.hide#myModal",
      //     [".modal-header",
      //       ["button.close",
      //         {type: "button", data-dismiss: "modal"},
      //         "x"
      //       ],
      //       ["h3", "New Project"]
      //     ],
      //     [".modal-body",
      //       ["form",
      //         ["input",
      //           {type: "text",
      //           name: "title",
      //           placeholder: "Title",
      //           size: 30}
      //         ],
      //         ["br"],
      //         ["input",
      //           {type: "text",
      //           name: "orginization",
      //           placeholder: "Orginization Associated With",
      //           size: 30}
      //         ],
      //         ["br"],
      //         ["input",
      //           {type: "text",
      //           name: "description",
      //           placeholder: "Description",
      //           size: 30}
      //         ],
      //         ["br"],
      //         ["input",
      //           {type: "text",
      //           name: "due",
      //           placeholder: "Due Date",
      //           size: 30}
      //         ]
      //       ]
      //     ],
      //     [".modal-footer",
      //       ["a.btn.btn-primary",
      //         {href: "#projects"},
      //         "Create"
      //       ]
      //     ]
      //   ],
      //   [".span9",
      //     [".hero-unit",
      //       ["p", "Click on a project or create a new project to get started!"]
      //     ]
      //   ]
      // ]));
      this.$app.html('<div class="span3"><div class="well sidebar-nav"><ul class="nav nav-list"><li class="nav-header">Projects</li><li><a href="#projects/asd5f4a7sd4f">My Project</a></li><br><br><li><button class="btn" data-toggle="modal" href="#myModal">Create Project</button></li></ul></div></div><div class="modal hide fade" id="myModal"><div class="modal-header"><button type="button" class="close" data-dismiss="modal">×</button><h3>Create Project</h3></div><div class="modal-body"><input type="text" name="title" placeholder="Title" size=30 /><br><form><input type="text" name="orginization" placeholder="Orginization Associated With" size=30 /><br><input type="text" name="description" placeholder="Description" size=30 /><br><input type="text" name="due" placeholder="Due Date" size=30 /></form></div><div class="modal-footer"><a href="#projects" class="btn btn-primary">Create</a></div></div><div class="span9"><div class="hero-unit"><p>Click on a project or create a new project to get started!</p></div></div>');
    },
    // $('body').on('click.modal.data-api', '[data-toggle="modal"]', function (evt) {
    //   var $parent = $(this).parent();
    //   if ($parent.hasClass('open')) {
    //     $parent.find("form")[0].title.focus();
    //   }
    // });

    // Same as projects, but also render all tasks for this project in the right
    project: function (projectId) {
      var project = new Project.Project({id: projectId});
      project.fetch();

      projectView = new Project.ProjectView({model: project});

      this.$home.hide();
      this.$app.html('<div class="span3"><div class="well sidebar-nav"><ul class="nav nav-list"><li class="nav-header">Projects</li><li><a href="#projects/asd5f4a7sd4f">My Project</a></li><br><br><li><button class="btn" data-toggle="modal" href="#myModal">Create Project</button></li></ul></div></div><div class="modal hide fade" id="myModal"><div class="modal-header"><button type="button" class="close" data-dismiss="modal">×</button><h3>Create Project</h3></div><div class="modal-body"><input type="text" name="title" placeholder="Title" size=30 /><br><form><input type="text" name="orginization" placeholder="Orginization Associated With" size=30 /><br><input type="text" name="description" placeholder="Description" size=30 /><br><input type="text" name="due" placeholder="Due Date" size=30 /></form></div><div class="modal-footer"><a href="#projects/asd5f4a7sd4f" class="btn btn-primary">Create</a></div></div>');
      this.$app.append(projectView.el);
      projectView.el.textContent = "Loading...";
      this.$app.show();
    },

    // Same as project(projectId), but also expand and scroll to a particular task
    task: function (projectId, taskId) {
    }

  });

  return {
    Workspace: Workspace
  };

});
