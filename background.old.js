$(document).ready(function () {
  $("#email-upload-button").on("click", (e) => {
    e.preventDefault();

    document.querySelector("#email_csv").click();
  });
  $("#link-upload-button").on("click", (e) => {
    e.preventDefault();

    document.querySelector("#link_csv").click();
  });

  var link_array = [];
  var email_array = [];

  $("#submit-file").on("click", (e) => {
    e.preventDefault();
    $("#email_csv").parse({
      config: {
        delimiter: "auto",
        complete: (results) => {
          var data = results.data;
          console.log(data);
          for (i = 1; i < data.length - 1; i++) {
            var cells = data[i].join(",").split(",");
            email_array.push(cells[0]);
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
    $("#link_csv").parse({
      config: {
        delimiter: "auto",
        complete: (results) => {
          var data = results.data;
          console.log(data);
          for (i = 1; i < data.length; i++) {
            var cells = data[i].join(",").split(",");
            console.log(
              cells[1].split("syncedtool.ca/shares/file/")[1].replace("/", "")
            );
            link_array.push(
              cells[1].split("syncedtool.ca/shares/file/")[1].replace("/", "")
            );
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
    document.getElementById("submit-file").style.background = "grey";
    var ul = document.createElement("ul");
    ul.setAttribute("id", "list");
    document.getElementById("parsed_csv_list").appendChild(ul);
    for (i = 0; i < link_array.length; i++) {
      fetch(
        "https://exocloud.syncedtool.ca/api/2/sharelinks/" +
          link_array[i] +
          "?include_subscribers=true"
      )
        .then((res) => res.json())
        .then((res) => {
          var node = document.createElement("li");
          var textnode = document.createTextNode(res["id"]);
          node.appendChild(textnode);
          document.getElementById("list").appendChild(node);
          for (j = 0; j < email_array.length; j++) {
            fetch(
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
                  notify_recipients: "new",
                  message: "",
                  anon_edit: false,
                  subscribers_json: JSON.stringify({
                    account: {
                      account_id: email_array[j],
                      account_type: "email",
                      write_access: false,
                      delete_access: false,
                    },
                  }),
                }),
                method: "post",
                headers: {
                  "Content-Type":
                    "application/x-www-form-urlencoded; charset=UTF-8",
                },
              }
            );
          }
        });
    }
  });
});
