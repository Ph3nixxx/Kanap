let addProduct = JSON.parse(localStorage.getItem("product"));

let someProduct = [];

/* Afichage des infos produits pour le(s) produit(s) choisi(s) */

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

/* Modification de la quantité via les flèches de l'input */

let changeQuantity = async () => {
  await cartDisplay;
  let change = document.querySelectorAll(".itemQuantity");
  change.forEach((el) => {
    el.addEventListener("change", () => {
      return (
        indexProduct = addProduct.findIndex(product => {
          if(el.dataset.id == product._id && el.dataset.color == product.color) {
            return true;
          }
        }),
        addProduct[indexProduct].quantity = parseInt(el.value),
        localStorage.setItem("product", JSON.stringify(addProduct)),
        totalAmount() /* Recalcul du total prix à chaque changement de quantité */
      );
    });
  });
};

/* Suppression d'un produit lorsque l'on clique sur le bouton "supprimer" d'un des produits du panier */

let removeProduct = async (cartDisplay) => {
  await cartDisplay;
  let deleteButton = document.querySelectorAll(".deleteItem");
  deleteButton.forEach((button) => {
    button.addEventListener("click", () => {
      let totalRemovedProducts = addProduct.length;
      if(totalRemovedProducts == 1) {
        return (
        localStorage.removeItem("product"),
        location.href = "cart.html" /* mise à jour du contenu de façon dynamique */
        );
      } else {
        someProduct = addProduct.filter(el => {
          if(button.dataset.id != el._id || button.dataset.color != el.color) {
            return true;
          }
        })
        localStorage.setItem("product", JSON.stringify(someProduct));
        totalAmount(); /* Recalcul du total prix à chaque changement de quantité */
        location.href = "cart.html" /* mise à jour du contenu de façon dynamique */
      }
    });
  });
};

/* Calcul du montant total du panier ainsi que la quantité totale de produits sélectionnés */

let totalAmount = async (cartDisplay, plusQuantity, lessQuantity, removeProduct) => {
  await cartDisplay;
  await plusQuantity;
  await lessQuantity;
  await removeProduct;

  let productPrice = [];
  let productQuantity = [];
  let dataArray = JSON.parse(localStorage.getItem("product"));

  dataArray.forEach((product) => {
    productPrice.push(product.price * product.quantity);
    productQuantity.push(product.quantity);
  });

  totalQuantity.textContent = `${eval(productQuantity.join("+"))}`
  totalPrice.textContent = `${eval(productPrice.join("+"))}`
};

/* Vérification de chaque champ du formulaire */

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

/* Confirmation de la commande via le bouton "Commander !" */

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
  if(isValidForm && localStorage.length != 0) { /* si le formulaire est bien rempli ... */
    let jsonBody = {}; /* Création de l'objet nécessaire pour la requête POST */
    jsonBody.contact = {};
    jsonBody.contact.firstName = document.getElementById("firstName").value;
    jsonBody.contact.lastName = document.getElementById("lastName").value;
    jsonBody.contact.address = document.getElementById("address").value;
    jsonBody.contact.city = document.getElementById("city").value;
    jsonBody.contact.email = document.getElementById("email").value;
    jsonBody.products = addProduct.map((product) => {
      return product._id;
    });
    /* envoi des données pour la requête POST */
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
  } else if (localStorage.length == 0) { /* si le panier est vide ... */
    alert("Veuillez ajouter un produit à votre panier");
  }
});