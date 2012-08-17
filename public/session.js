define("session", ["backbone","dombuilder"], function (Backbone, domBuilder) {

  // makes the Login/Logout functions
  var Session = Backbone.Model.extend({
    initialize: function () {
      var session = this;

      var attempted;
      $(document).ajaxError(function(e, xhr, options){
        attempted = location.hash;
        Backbone.history.navigate("", true);
      });

      this.onAuth = function (data) {
        session.set({username: data.username});
        if (data.username && attempted) {
          Backbone.history.navigate(attempted, true);
          attempted = false;
        }
        if (!data.username && location.hash !== "") {
          Backbone.history.navigate("", true);
        }
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
    },
    register: function (username, password, passwordConfirm) {
      if (!username) {
        alert("Username Missing");
        return false;
      }
      if (!password) {
        alert("Username Missing");
        return false;
      }
      if (password !== passwordConfirm) {
        alert("Passwords do not match!");
        return false;
      }
      $.post("/register", {
        username: username,
        password: password
      }, this.onAuth, "json");
      return true;
    }
  });

  // Gives the sessionview function that will load all the elements defined in that route,
  // and add this login/logout functionality
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

      // uses the login/logout functions to make a nice dropdown menu to login with,
      //  then returns username if logged in
      this.el.textContent = "";
      this.el.appendChild(domBuilder([
        ["li$username",
          ["a$usernameLabel",
            {href: "#projects"}, this.model.get("username")
          ]
        ],
        ["li$signout",
          ["a.signout",
            {href: ""}, "Sign Out"
          ]
        ],
        ["li.dropdown$signup",
          ["a.dropdown-toggle$signupToggle",
            {href: "#", "data-toggle": "dropdown"}, "Sign Up ",
            ["strong.caret"]
          ],
          [".dropdown-menu",
            {css:
              {padding: "15px"}
            },
            ["form$signupForm",
              {css:
                {margin: 0}
              },
              ["input",
                {type: "text",
                placeholder: "username",
                name: "username",
                size: 30}
              ],
              ["input",
                {type: "password",
                placeholder: "password",
                name: "password",
                size: 30}
              ],
              ["input",
                {type: "password",
                placeholder: "retype password",
                name: "passwordConfirm",
                size: 30}
              ],
              ["input.btn.btn-primary",
                {type: "submit", value: "Create Account"}
              ]
            ]
          ]
        ],
        ["li.divider-vertical$divider"],
        ["li.dropdown$signin",
          ["a.dropdown-toggle$signinToggle",
            {href: "#", "data-toggle": "dropdown"}, "Sign In ",
            ["strong.caret"]
          ],
          [".dropdown-menu",
            {css:
              {padding: "15px"}
            },
            ["form$signinForm",
              {css:
                {margin: 0}
              },
              ["input",
                {type: "text",
                placeholder: "username",
                name: "username",
                size: 30}
              ],
              ["input",
                {type: "password",
                placeholder: "password",
                name: "password",
                size: 30}
              ],
              ["input",
                {type: "checkbox",
                name: "remember_me"}
              ],
              ["label.string optional",
                {"for": "remember_me"}, "Remember me"
              ],
              ["input.btn.btn-primary",
                {type: "submit", value: "Sign In"}
              ],
            ]
          ]
        ]
      ], elements));
      this.update();

      $('body').on('click.dropdown.data-api', '[data-toggle="dropdown"]', function (evt) {
        var $parent = $(this).parent();
        if ($parent.hasClass('open')) {
          $parent.find("form")[0].username.focus();
        }
      });

      elements.signinForm.addEventListener("submit", function (evt) {
        evt.preventDefault();
        var form = elements.signinForm;
        model.login(form.username.value, form.password.value, form.remember_me.checked);
      }, true);

      elements.signupForm.addEventListener("submit", function (evt) {
        evt.preventDefault();
        var form = elements.signupForm;
        if (!model.register(form.username.value, form.password.value, form.passwordConfirm.value)) {
          elements.signupForm.username.focus();
        }
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
        this.elements.signin.style.display = "none";
      }
      else {
        this.elements.username.style.display = "none";
        this.elements.signout.style.display = "none";
        this.elements.signup.style.display = "block";
        this.elements.signin.style.display = "block";
      }
    }
  });

  return {
    Session: Session,
    SessionView: SessionView
  };

});
