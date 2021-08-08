link = "mY1WFgyNvDC";
email = ["yxhuang@ryerson.ca"];

fetch(
  "https://exocloud.syncedtool.ca/api/2/sharelinks/" +
    link + //change link var
    "?include_subscribers=true"
)
  .then((res) => res.json())
  .then((res) => {
    console.log(res.id);
    var jsonVariable = {};
    for (i = 0; i < res.subscribers.length; i++) {
      if (res.subscribers[i].subscriber_type != "public") {
        var account_id = res.subscribers[i].subscriber.id;

        var account_type = res.subscribers[i].subscriber_type;

        var write_access = res.subscribers[i].write_access;

        var delete_access = res.subscribers[i].delete_access;

        jsonVariable[account_type + "_" + res.subscribers[i].subscriber.id] = {
          account_id: account_id,
          account_type: account_type,
          write_access: write_access,
          delete_access: delete_access,
        };
      }
    }
    console.log(jsonVariable);
    for (j = 0; j < email.length; j++) {
      //change email var
      jsonVariable[email[j]] = {
        account_id: email[j],
        account_type: "email",
        write_access: false,
        delete_access: false, //change
      };
    }
  });
