import { JetView } from "webix-jet";
import { ROOT_URL } from "~/util/constants";

export default class LoginView extends JetView {
  config() {
    return {
      view: "form",
      width: 300,
      elements: [
        { view: "text", label: "Username", id: "username" },
        {
          view: "text",
          type: "password",
          label: "Password",
          id: "password"
        },
        {
          margin: 5,
          cols: [
            {
              view: "button",
              value: "Login",
              css: "webix_primary",
              click: () => {
                const credentials = {
                  username: $$("username").getValue(),
                  password: $$("password").getValue()
                };

                webix
                  .ajax()
                  .headers({
                    "Content-Type": "application/json"
                  })
                  .post(ROOT_URL + "/login", credentials, function(
                    text,
                    data,
                    xhr
                  ) {
                    const auth = xhr.getResponseHeader("Authorization");
                    webix.storage.local.put("auth", auth);
                  })
                  .then(data => {
                    this.app.show("/top");
                  });
              }
            },
            { view: "button", value: "Cancel" }
          ]
        }
      ]
    };
  }

  init() {}
}
