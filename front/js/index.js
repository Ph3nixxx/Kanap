let productsInfo = [];

/* Récupération des infos de tous les produits de l'API */
let getProducts = async () => {
    await fetch("http://localhost:3000/api/products")
        .then((res) => res.json())
            .then((promise) => {
                productsInfo = promise;
            });
};

/* Afichage des infos (image/nom/description) de tous les produits */
let displayProducts = async () => {
    await getProducts();
    document.getElementById("items").innerHTML = productsInfo.map((product) => `
    <a href="./product.html?productID=${product._id}">
        <article>
            <img src="${product.imageUrl}" alt="${product.altTxt}" />
            <h3 class="productName">${product.name}</h3>
            <p class="productDescription">${product.description}</p>
        </article>
    `
    )
        .join("");
};

displayProducts();