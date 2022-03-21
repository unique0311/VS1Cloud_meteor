export default class layoutEditor {
  constructor(element) {
    if (element == null) {
      return null;
    }

    console.log(element);

    this.save = element.querySelector(".saveTable"); // save button

    this.accountList = [];

    this.bindEvents();
    console.log("Layout editor loaded");
  }

  /**
   * This will setup the object in the html dom
   */
  async setupTree() {
    const sortableAccounts = document.querySelectorAll(".sortableAccount");
    sortableAccounts.forEach((sortableAccount) => {
      const accountType = sortableAccount
        .querySelector(".avoid")
        .getAttribute("account-type");
      sortableAccount.setAttribute("account-type", accountType);

      const draggables = sortableAccount.querySelectorAll(".draggable");
      draggables.forEach((draggable) => {
        draggable.setAttribute("account-type", accountType);
      });
    });
  }

  /**
   * Build the object of the tree
   */
  async buildTree() {
    const sortableAccounts = document.querySelectorAll(".sortableAccount");
    console.log(sortableAccounts);
    let accounts = [];

    const jsonExpected = [
      {
        "account-type": "my-type",
        position: 8,
        "sub-accounts": [
          {
            "account-id": 7,
            "account-type": "my-type",
            position: 1,
          },
          {
            "account-id": 7,
            "account-type": "my-type",
            position: 1,
          },
        ],
      },
      {
        "account-type": "my-type-2",
        position: 8,
        "sub-accounts": [
          {
            "account-id": 7,
            "account-type": "my-type-2",
            position: 1,
          },
          {
            "account-id": 7,
            "account-type": "my-type-2",
            position: 1,
          },
        ],
      }
    ];

    sortableAccounts.forEach((el) => {
      const position = el.getAttribute("position");
      const accountType = el.getAttribute("account-type");

      let sortableAccount = {
        position: position,
        accountType: accountType,
        "sub-accounts": [],
      };
      const subAccounts = el.querySelectorAll(".draggable");

      subAccounts.forEach((ele) => {
        sortableAccount["sub-accounts"].push({
          "account-id": ele.getAttribute("account-id"),
          "account-type": ele.getAttribute("account-type"),
          position: ele.getAttribute("position"),
        });
      });

      accounts.push(sortableAccount);
    });

    this.accountList = accounts;

    console.log(this.accountList);
  }

  /**
   * Save the jsonObject to database via the API
   */
  async saveData() {
    let formData = new FormData();
    formData.set("accounts", this.accountList);

    const response = await fetch("my-url", {
      method: 'POST',
      body: formData,
    });

    if (response.ok) {
      let data = await response.json();
      // then refresh page
      window.location.reload();
    } else {
      console.log(response);
    }
  }

  bindEvents() {
    // this is our edit listener
    $(this.save).on("click", (e) => {
      e.preventDefault();
      console.log(e);
      const sortableAccounts = document.querySelectorAll(".sortableAccount");
      console.log(sortableAccounts.length);
      this.setupTree().then(() => this.buildTree()).then(() => this.saveData());
      // setTimeout(() => this.buildTree(), 150);
      // setTimeout(() => this.saveData(), 300);

      // this will add a position attribute to each sortableAccount
      for (let i = 0; i < sortableAccounts.length; i++) {
        let sortableAccount = sortableAccounts[i];
        sortableAccount.setAttribute("position", i);

        // this will add a position attribute to each draggable items of this sortableAccount
        const draggables = sortableAccount.querySelectorAll(".draggable");
        for (let si = 0; si < draggables.length; si++) {
          let draggable = draggables[si];
          draggable.setAttribute("position", si);
        }
      }

      // now we'll have to build the new object
    });

    $(".sortableAccountParent").sortable({
      revert: true,
      cancel: ".undraggableDate,.accdate,.edtInfo",
    });
    $(".sortableAccount").sortable({
      revert: true,
      handle: ".avoid",
    });
    $(".draggable").draggable({
      connectToSortable: ".sortableAccount",
      helper: "none",
      revert: "true",
    });
  }
}
