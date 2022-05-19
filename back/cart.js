let product = JSON.parse(localStorage.getItem("cartProducts"));
console.log(product);
/* Afichage des infos produits dans le panier pour le(s) produit(s) choisi(s) */
let displayCart = async () => {

    if(product){
        document.getElementById("cart__items").innerHTML = product.map((cartProducts) => `
        <article class="cart__item" data-id="${cartProducts._id}" data-color="${cartProducts.color}">
          <div class="cart__item__img">
            <img src="${cartProducts.imageUrl}" alt="${cartProducts.altTxt}">
          </div>
          <div class="cart__item__content">
            <div class="cart__item__content__description">
              <h2>${cartProducts.name}</h2>
              <p>${cartProducts.color}</p>
              <p>${cartProducts.price} €</p>
            </div>
            <div class="cart__item__content__settings">
              <div class="cart__item__content__settings__quantity">
                <p>Qté : </p>
                <input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value="${cartProducts.quantity}" data-id="${pdt._id}" data-color="${cartProducts.color}">
              </div>
              <div class="cart__item__content__settings__delete">
                <p class="deleteItem" data-id="${cartProducts._id}" data-color="${cartProducts.color}">Supprimer</p>
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
    };
};

displayCart();

/* Modification de la quantité via les flèches de l'input de chaque produit/couleur */

let changeQuantity = async () => {
  await displayCart;
  let change = document.querySelectorAll(".itemQuantity");
  change.forEach((el) => {
    el.addEventListener("change", () => {
      return (
        indexProduct = product.findIndex(pdt => {
          if(el.dataset.id == pdt._id && el.dataset.color == pdt.color) {
            return true;
          }
        }),
        product[indexProduct].quantity = parseInt(el.value),
        localStorage.setItem("cartProducts", JSON.stringify(product)),
        totalAmount() /* Recalcul du total prix à chaque changement de quantité */
      );
    });
  });
};

/* Suppression d'un produit/couleur lorsque l'on clique sur le bouton "supprimer" d'un des produits du panier */

let removeProduct = async (displayCart) => {
  await displayCart;
  let someProducts = [];
  let deleteButton = document.querySelectorAll(".deleteItem");
  deleteButton.forEach((button) => {
    button.addEventListener("click", () => {
      let totalRemovedProducts = product.length;
      if(totalRemovedProducts == 1) {
        return (
        localStorage.removeItem("cartProducts"),
        location.href = "cart.html" /* mise à jour du contenu de façon dynamique */
        );
      } else {
        someProducts = product.filter(el => {
          if(button.dataset.id != el._id || button.dataset.color != el.color) {
            return true;
          }
        })
        localStorage.setItem("cartProducts", JSON.stringify(someProducts));
        totalAmount(); /* Recalcul du total prix à chaque changement de quantité */
        location.href = "cart.html" /* mise à jour du contenu de façon dynamique */
      }
    });
  });
};

/* Calcul du montant total du panier ainsi que la quantité totale de produits sélectionnés */
let totalAmount = async () => {
  await displayCart;
  await changeQuantity;
  await removeProduct;

  let productPrice = [];
  let productQuantity = [];
  let productArray = JSON.parse(localStorage.getItem("cartProducts"));

  productArray.forEach((pdt) => {
    productPrice.push(pdt.price * pdt.quantity);
    productQuantity.push(pdt.quantity);
  });

  totalQuantity.textContent = `${eval(productQuantity.join("+"))}`
  totalPrice.textContent = `${eval(productPrice.join("+"))}`
};

/* Vérification de chaque champ du formulaire (rempli + conforme) */
document.querySelectorAll(".cart__order__form__question > input")
.forEach((input) => {
  input.addEventListener("focusout", () => {
    let RegEx = RegExp(input.pattern);
    let isRegExOk = RegEx.test(input.value);
    let isRequired = input.required;
    console.log(input.parentNode.querySelector("p"))
    if(isRequired == true && input.value == "") { /* si champ vide ... */
      input.parentNode.querySelector("p").innerText = "le champ est requis";
      input.className="error";
    } else if (isRegExOk == false) { /* si champ non conforme ... */
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
    jsonBody.products = product.map((pdt) => {
      return pdt._id;
    });
    
    fetch(`http://localhost:3000/api/products/order`, { /* envoi des données pour la requête POST */
	    method: "POST",
	    headers: { 
        'Accept': 'application/json', 
        'Content-Type': 'application/json' 
      },
      body: JSON.stringify(jsonBody)})
      
      .then(function(res) { /* réception des infos suite à la requête POST */
        if (res.ok) {
          return res.text();
        }
      })
      
      .then(data => { /* ajout de l'order ID dans l'URL de la page confirmation */
        let resPost = JSON.parse(data);
        document.location.href="confirmation.html?orderId="+resPost.orderId;
      });
      
  } else if (localStorage.length == 0) { /* si le panier est vide ... */
    alert("Veuillez ajouter un produit à votre panier");
  }
});