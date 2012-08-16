define("task", ["backbone", "dombuilder"], function (Backbone, domBuilder) {

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
        [".accordion-body.collapse",
          {id: "task-" + this.model.cid},
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
        ["h2", "Tasks"],
        ["br"],
        this.model.models.map(function (task) {
          var taskView = new TaskView({model: task});
          return taskView.render().el;
        }),
        ["br"],
        ["button.btn", "Add Task"]
      ]));
      $(this.el).sortable().disableSelection();
      return this;
    }
  });

  return {
    Task: Task,
    TaskList: TaskList,
    TaskView: TaskView,
    TaskListView: TaskListView
  };

});
