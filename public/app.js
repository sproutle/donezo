// Load all the required libraries.                                 start
require(["backbone", "dombuilder", "session", "workspace"], function (Backbone, domBuilder, Session, Workspace) {

// Store references to certain dom elements in the page.
var $home = $("#home");
var $app = $("#app");
var $main = $("#main");
var $sidebar = $("#sidebar");
var $topbar = $("#topbar");
var $taskList = $("#taskList");
var $comments = $("#comments");


// defines session and session view
var session = new Session.Session({username:""});
var sessionView = new Session.SessionView({ model: session });
$topbar.append(sessionView.render().el);


// defines the workspace that will keep track of the history
var workspace = new Workspace.Workspace({
  $home: $home,
  $app: $app
});
Backbone.history.start();


});
// end

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

    // if (!data.username && attempted) {
    //   <div class="alert alert-error">
    //     <a class="close" data-dismiss="alert" href="#">×</a>
    //     <h4 class="alert-heading">Oops</h4>
    //     Username and password do not match
    //   </div>
    // }
