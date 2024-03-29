/* Récupération de l'ID du produit via l'URL */
let product = window.location.search.split("?productID=").join("");

let productInfo = [];

/* Récupération des infos produits de l'API pour le produit choisi seulement */
let getProduct = async () => {
    return fetch(`http://localhost:3000/api/products/${product}`)
        .then((res) => res.json())
            .then((promise) => {
                productInfo = promise;
                return promise;
            });
};

/* Afichage des infos produits pour le produit choisi seulement */
let displayProduct = async () => {
    getProduct()
    .then((param) => {
        document.getElementById("title").innerText = `
        ${param.name}
        `
        document.getElementById("name").innerText = `
        ${param.name}
        `
        document.getElementById("item__img").innerHTML = `
        <img src="${param.imageUrl}" alt="${param.altTxt}">
        `
        document.getElementById("price").innerHTML = `
        ${param.price}
        `
        document.getElementById("description").innerHTML = `
        ${param.description}
        `
    
        let colorSelect = document.getElementById("colors");
    
        param.colors.forEach((color) => {
            let eachColor = document.createElement("option");
            eachColor.innerHTML = `${color}`;
            eachColor.value = `${color}`;
            colorSelect.appendChild(eachColor);
        });
        
        addToCart();
    });
};

displayProduct();

let triggerAlertQuantity = (quantity, productArray) => {
    if(quantity >0 && quantity <=100) {
        localStorage.setItem("cartProducts", JSON.stringify(productArray));
        productArray = JSON.parse(localStorage.getItem("cartProducts"));
        alert("Une nouvelle quantité a été ajouté à votre panier");
    } else {
        alert ("La quantité totale d'un produit doit être entre 1 et 100");
    }
};

/* Au clic sur le bouton "Ajouter au panier", création d'un tableau si produit/couleur n'existe pas. 
Si produit/couleur existe, on ajoute la quantité sélectionnée au tableau existant */
let addToCart = () => {
    let button = document.getElementById("addToCart");
    button.addEventListener("click", () => {
        let productArray = JSON.parse(localStorage.getItem("cartProducts"));    

        let colorSelect = document.getElementById("colors");

        let productWithColorAndQuantity = {
            id : productInfo._id,
            color : `${colorSelect.value}`,
            quantity : parseInt(quantity.value)
        };

        if(productArray == null) { /* panier n'existe pas */
            productArray = [];
            productArray.push(productWithColorAndQuantity);
            triggerAlertQuantity(productArray[0].quantity, productArray);
        } else if(productArray != null) { 
            let index = productArray.findIndex((p) => {
                return p.id == productInfo._id && p.color == colorSelect.value ;
            });
            if(index != -1){ /* produit/couleur existe */
                let newQuantity = productArray[index].quantity += productWithColorAndQuantity.quantity;
                triggerAlertQuantity(newQuantity, productArray);
            } else { /* produit/couleur n'existe pas */
                productArray.push(productWithColorAndQuantity);
                localStorage.setItem("cartProducts", JSON.stringify(productArray));
                productArray = JSON.parse(localStorage.getItem("cartProducts"));
                alert("Un nouveau produit a été ajouté à votre panier");
            }
        };
    });
};

/* Fonctionnalité : impossible d'ajouter un produit sans choisir une couleur au préalable */
let onColorChange = () => {
    let button = document.getElementById("addToCart");
    let colors = document.getElementById("colors");

    if(colors.value == "empty") {
        button.disabled = true;
        colors.className="error";
    } else {
        button.disabled = false;
        colors.className="";
    }
};

onColorChange();

let eventOnColorChange = () => {
    let colors = document.getElementById("colors");
        colors.addEventListener("change", () => {
           onColorChange();
        });
};

eventOnColorChange();