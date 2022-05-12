let addProduct = JSON.parse(localStorage.getItem("product"));

let someProduct = [];

let cartDisplay = async () => {
    if(addProduct){
        await addProduct;

        document.getElementById("cart__items").innerHTML = addProduct.map((product) => `
        <article class="cart__item" data-id="${product._id}" data-color="${product.color}">
          <div class="cart__item__img">
            <img src="${product.imageUrl}" alt="${product.altTxt}">
          </div>
          <div class="cart__item__content">
            <div class="cart__item__content__description">
              <h2>${product.name}</h2>
              <p>${product.color}</p>
              <p>${product.price} €</p>
            </div>
            <div class="cart__item__content__settings">
              <div class="cart__item__content__settings__quantity">
                <p>Qté : </p>
                <input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value="${product.quantity}" data-id="${product._id}" data-color="${product.color}">
              </div>
              <div class="cart__item__content__settings__delete">
                <p class="deleteItem" data-id="${product._id}" data-color="${product.color}">Supprimer</p>
              </div>
            </div>
          </div>
        </article>
        `
        )
        .join("");

        changeQuantity();
        removeProduct();
        totalAmount();
    }
}

cartDisplay();

let changeQuantity = async () => {
  await cartDisplay;
  let change = document.querySelectorAll(".itemQuantity");
  change.forEach((el) => {
  el.addEventListener("change", (e) => {
    return (
      indexProduct = addProduct.findIndex(product => {
        if(el.dataset.id == product._id && el.dataset.color == product.color) {
          return true;
        }
      }),
      addProduct[indexProduct].quantity = parseInt(el.value),
      localStorage.setItem("product", JSON.stringify(addProduct)),
      totalAmount(),
      console.log("nouvelle quantite")
    );
  });
});
};

let removeProduct = async (cartDisplay) => {
  await cartDisplay;
  let deleteButton = document.querySelectorAll(".deleteItem");
  deleteButton.forEach((button) => {
    button.addEventListener("click", () => {
      console.log(deleteButton);
      let totalRemovedProducts = addProduct.length;
      console.log(totalRemovedProducts);
      if(totalRemovedProducts == 1) {
        return (
        localStorage.removeItem("product"),
        console.log("totalRemovedProducts"),
        (location.href = "cart.html")
        );
      } else {
        someProduct = addProduct.filter(el => {
          if(button.dataset.id != el._id || button.dataset.color != el.color) {
            return true;
          }
        })
        console.log(someProduct);
        localStorage.setItem("product", JSON.stringify(someProduct));
        totalAmount();
        console.log("remove le produit en question");
        location.href = "cart.html"
      }
    });
  });
};

let totalAmount = async (cartDisplay, plusQuantity, lessQuantity, removeProduct) => {
  await cartDisplay;
  await plusQuantity;
  await lessQuantity;
  await removeProduct;

  let productPrice = [];
  let productQuantity = [];
  let dataArray = JSON.parse(localStorage.getItem("product"));
  console.log(dataArray);

  let showQuantity = document.querySelectorAll(".itemQuantity");
  console.log(showQuantity);

  dataArray.forEach((product) => {
    productPrice.push(product.price * product.quantity);
    productQuantity.push(product.quantity);
  });
  console.log(productPrice);
  console.log(productQuantity);

  totalQuantity.textContent = `${eval(productQuantity.join("+"))}`
  totalPrice.textContent = `${eval(productPrice.join("+"))}`
};

/* Redirection vers la page confirmation avec addEventListener sur id="order" */
let order = document.getElementById("order");

order.addEventListener("click", () => {
  let formValidation = document.querySelectorAll(".cart__order__form__question > input");
  let isValidForm = true;
  formValidation.forEach((input) => {
    let RegEx = RegExp(input.pattern);
    isValidForm &= (input.required && RegEx.test(input.value));
    input.focus();
    input.blur();
  })
  if(isValidForm && localStorage.length != 0) {
    let jsonBody = {};
    jsonBody.contact = {};
    jsonBody.contact.firstName = document.getElementById("firstName").value;
    jsonBody.contact.lastName = document.getElementById("lastName").value;
    jsonBody.contact.address = document.getElementById("address").value;
    jsonBody.contact.city = document.getElementById("city").value;
    jsonBody.contact.email = document.getElementById("email").value;
    jsonBody.products = addProduct.map((product) => {
      return product._id;
    });
    console.log(jsonBody);
    /* faire l'appel POST ici */
    fetch(`http://localhost:3000/api/products/order`, {
	    method: "POST",
	    headers: { 
        'Accept': 'application/json', 
        'Content-Type': 'application/json' 
      },
      body: JSON.stringify(jsonBody)})
      .then(function(res) {
        if (res.ok) {
          return res.text();
        }
      })
      .then(data => {
        let resPost = JSON.parse(data);
        document.location.href="confirmation.html?orderId="+resPost.orderId;
      });
  } else if (localStorage.length == 0) {
    alert("Veuillez ajouter un produit à votre panier");
  }
});

document.querySelectorAll(".cart__order__form__question > input")
.forEach((input) => {
  input.addEventListener("focusout", () => {
    let RegEx = RegExp(input.pattern);
    let isRegExOk = RegEx.test(input.value);
    let isRequired = input.required;
    console.log(input.parentNode.querySelector("p"))
    if(isRequired == true && input.value == "") {
      input.parentNode.querySelector("p").innerText = "le champ est requis";
      input.className="error";
    } else if (isRegExOk == false) {
      input.parentNode.querySelector("p").innerText = "le champ n'est pas sous le format souhaité";
      input.className="error";
    } else {
      input.parentNode.querySelector("p").innerText = "";
      input.className="";
    }
  })
});