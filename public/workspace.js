define("workspace", ["backbone", "project"], function (Backbone, Project) {

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
      this.$app.html('<div class="span3"><div class="well sidebar-nav"><ul class="nav nav-list"><li class="nav-header">Projects</li><li><a href="#projects/asd5f4a7sd4f">My Project</a></li><br><br><li><button class="btn">Create Project</button></li></ul></div></div><div class="span9"><div class="hero-unit"><p>Click on a project or create a new project to get started!</p></div></div>');
    },

    // Same as projects, but also render all tasks for this project in the right
    project: function (projectId) {
      var project = new Project.Project({id: projectId});
      project.fetch();

      projectView = new Project.ProjectView({model: project});

      this.$home.hide();
      this.$app.html('<div class="span3"><div class="well sidebar-nav"><ul class="nav nav-list"><li class="nav-header">Projects</li><li><a href="#projects/asd5f4a7sd4f">My Project</a></li><br><br><li><button class="btn">Create Project</button></li></ul></div></div>');
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
