$(document).ready(function () {
  var link_array = [];
  var email_array = [];
  $("#email_csv").on("change", () => {
    if (document.getElementById("email_csv").value != "") {
      document.getElementById("email-upload-button").style.background = "grey";
      document.getElementById("email-upload-button").disabled = true;

      $("#email_csv").parse({
        config: {
          delimiter: "auto",
          complete: (results) => {
            var data = results.data;
            console.log(data);
            for (i = 1; i < data.length - 1; i++) {
              var cells = data[i].join(",").split(",");
              if (validateEmail(cells[0]) == false) {
                document.getElementById(
                  "email-upload-button"
                ).style.background = "#e05b0d";
                document.getElementById("email-upload-button").disabled = false;
                document.getElementById("alert-message").style.color = "red";
                document.getElementById("alert-message").innerHTML =
                  "Invalid email on row " + (i + 1) + "!";
                email_array = [];
                document.getElementById("email-upload-button").innerHTML =
                  "Email CSV";
                return;
              }
              email_array.push(cells[0].replace(" ", ""));
            }
            document.getElementById("email-upload-button").innerHTML = document
              .getElementById("email_csv")
              .value.replace(/^.*[\\\/]/, "");
            document.getElementById("alert-message").innerHTML = "";
            if (link_array.length != 0) {
              document.getElementById("submit-file").style.background =
                "#e05b0d";
              document.getElementById("submit-file").disabled = false;
            }
          },
        },
        before: function (file, inputElem) {
          console.log("Parsing file...", file);
        },
        error: function (err, file) {
          console.log("ERROR:", err, file);
        },
        complete: function () {
          console.log("Done with all files");
        },
      });
    }
  });
  $("#link_csv").on("change", () => {
    if (document.getElementById("link_csv").value != "") {
      document.getElementById("link-upload-button").style.background = "grey";
      document.getElementById("link-upload-button").disabled = true;
      $("#link_csv").parse({
        config: {
          delimiter: "auto",
          complete: (results) => {
            var data = results.data;
            console.log(data);
            for (i = 1; i < data.length - 1; i++) {
              var cells = data[i].join(",").split(",");
              if (cells.length != 2) {
                document.getElementById("link-upload-button").style.background =
                  "#e05b0d";
                document.getElementById("link-upload-button").disabled = false;
                document.getElementById("alert-message").style.color = "red";
                document.getElementById("alert-message").innerHTML =
                  "Invalid link file format!";
                link_array = [];
                document.getElementById("link-upload-button").innerHTML =
                  "Link CSV";
                return;
              }
              if (cells[1].split("/shares/file/") == 1) {
                document.getElementById("link-upload-button").style.background =
                  "#e05b0d";
                document.getElementById("link-upload-button").disabled = false;
                document.getElementById("alert-message").style.color = "red";
                document.getElementById("alert-message").innerHTML =
                  "Invalid link on row " + (i + 1) + "!";
                link_array = [];
                document.getElementById("link-upload-button").innerHTML =
                  "Link CSV";
                return;
              }
              console.log(
                cells[1]
                  .split("/shares/file/")[1]
                  .replace("/", "")
                  .replace(" ", "")
              );
              link_array.push(
                cells[1]
                  .split("/shares/file/")[1]
                  .replace("/", "")
                  .replace(" ", "")
              );
            }
            document.getElementById("link-upload-button").innerHTML = document
              .getElementById("link_csv")
              .value.replace(/^.*[\\\/]/, "");
            document.getElementById("alert-message").innerHTML = "";
            if (email_array.length != 0) {
              document.getElementById("submit-file").style.background =
                "#e05b0d";
              document.getElementById("submit-file").disabled = false;
            }
          },
        },
        before: function (file, inputElem) {
          console.log("Parsing file...", file);
        },
        error: function (err, file) {
          console.log("ERROR:", err, file);
        },
        complete: function () {
          console.log("Done with all files");
        },
      });
    }
  });
  $("#email-upload-button").on("click", (e) => {
    e.preventDefault();

    document.querySelector("#email_csv").click();
  });
  $("#link-upload-button").on("click", (e) => {
    e.preventDefault();

    document.querySelector("#link_csv").click();
  });

  $("#submit-file").on("click", (e) => {
    e.preventDefault();
    var link_finished = 0;
    var elem = document.getElementById("myBar");

    console.log(link_array.length);
    for (s = 0; s < link_array.length; s++) {
      fetchWithTimeout(
        "https://exocloud.syncedtool.ca/api/2/sharelinks/" +
          link_array[s] + //change link var
          "?include_subscribers=true",
        { timeout: 5000 }
      )
        .then((res) => res.json())
        .then((res) => {
          //   var node = document.createElement("li");
          //   var textnode = document.createTextNode(res["id"]);
          //   node.appendChild(textnode);
          //   document.getElementById("list").appendChild(node);
          var jsonVariable = {};
          link_finished++;
          console.log((link_finished / link_array.length / 2) * 100);
          elem.style.width =
            (link_finished / link_array.length / 2) * 100 + "%";

          for (j = 0; j < email_array.length; j++) {
            //change email var
            var write_access = document.getElementById("write_access").checked;
            var delete_access =
              document.getElementById("delete_access").checked;
            console.log(document.getElementById("write_access").checked);
            jsonVariable[email_array[j]] = {
              account_id: email_array[j],
              account_type: "email",
              write_access: write_access, //change
              delete_access: delete_access, //change
            };
          }
          for (i = 0; i < res.subscribers.length; i++) {
            if (res.subscribers[i].subscriber_type != "public") {
              if (
                email_array.includes(res.subscribers[i].subscriber.email) ==
                true
              ) {
                delete jsonVariable[res.subscribers[i].subscriber.email];
              }
              var account_id = res.subscribers[i].subscriber.id;

              var account_type = res.subscribers[i].subscriber_type;

              var write_access = res.subscribers[i].write_access;

              var delete_access = res.subscribers[i].delete_access;

              jsonVariable[
                account_type + "_" + res.subscribers[i].subscriber.id
              ] = {
                account_id: account_id,
                account_type: account_type,
                write_access: write_access,
                delete_access: delete_access,
              };
            }
          }
          var ele = document.getElementsByName("notify");
          var notify_recipients = "new";
          for (i = 0; i < ele.length; i++) {
            if (ele[i].checked) {
              notify_recipients = ele[i].value;
            }
          }

          fetchWithTimeout(
            "https://exocloud.syncedtool.ca/shares/" +
              res["id"].toString() +
              "/process_subscribers/",
            {
              body: new URLSearchParams({
                login_required: 1,
                expires: "",
                download_limit: 0,
                download_notify: false,
                upload_notify: false,
                notify_recipients: notify_recipients, //all, new, none
                message: "",
                anon_edit: false,
                subscribers_json: JSON.stringify(jsonVariable),
              }),
              method: "post",
              timeout: 5000,
              headers: {
                "Content-Type":
                  "application/x-www-form-urlencoded; charset=UTF-8",
              },
            }
          )
            .then(() => {
              link_finished++;
              console.log((link_finished / link_array.length / 2) * 100);
              elem.style.width =
                (link_finished / link_array.length / 2) * 100 + "%";
              if ((link_finished / link_array.length / 2) * 100 == 100) {
                document.getElementById("alert-message").style.color = "black";
                document.getElementById("alert-message").innerHTML =
                  "Finished!";
                console.log(jsonVariable);
              }
            })
            .catch(() => {
              document.getElementById("alert-message").style.color = "red";
              document.getElementById("alert-message").innerHTML =
                "Error sharing, please try again :(";
            });
        })
        .catch(() => {
          document.getElementById("alert-message").style.color = "red";
          document.getElementById("alert-message").innerHTML =
            "Error sharing, please try again :(";
        });
    }
    document.getElementById("submit-file").style.background = "grey";
    document.getElementById("submit-file").disabled = true;
  });
  function validateEmail(email) {
    const re =
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  }
  async function fetchWithTimeout(resource, options = {}) {
    const { timeout = 5000 } = options;

    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), timeout);

    const response = await fetch(resource, {
      ...options,
      signal: controller.signal,
    });
    clearTimeout(id);

    return response;
  }
});
