define("project", ["backbone", "dombuilder", "task", "utils"], function (Backbone, domBuilder, Task, utils) {

  var Projects = Backbone.Collection.extend({
    model: Project,
    url: "/projects"
  });

  var Project = Backbone.Model.extend({
    initialize: function () {
      this.tasks = new Task.TaskList;
      this.tasks.cid = this.cid;
      this.on("change", function () {
        this.tasks.reset(this.get("tasks"));
      }, this);
    },
    url: function () {
      return "/projects/" + this.get("id");
    }
  });
  var ProjectView = Backbone.View.extend({
    className: "span9",
    initialize: function () {
      this.model.on("change", this.render, this);
      this.tasks = new Task.TaskListView({model:this.model.tasks});
    },
    render: function () {
      this.el.textContent = "";
      this.el.appendChild(domBuilder([
        [".hero-unit",
          ["h1", this.model.get("title")],
          ["br"],
          ["p", "From the orginization: Orginization1"],
          ["p", "About the Project: " + this.model.get("description")],
          ["p", "Due: ", utils.formatDate(this.model.get("dueDate"))]
        ],
        [".hero-unit", this.tasks.render().el],
        [".hero-unit",
          ["h3", "Comments"],
          ["br"],
          // ["ul",
          //   ["li", this.comments.user, [br], this.comments.content, [br], this.comments.date]
          // ],
          ["br"],
          ["button.btn", "Add Comment"]
        ]
      ]));
      return this;
    }
  });

  return {
    Project: Project,
    ProjectView: ProjectView
  };

});

