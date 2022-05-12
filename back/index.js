let productInfo = [];

let productGet = async () => {
    await fetch("http://localhost:3000/api/products")
        .then((res) => res.json())
            .then((promise) => {
                productInfo = promise;
                console.log(productInfo);
            });
};

let productDisplay = async () => {
    await productGet();
    document.getElementById("items").innerHTML = productInfo.map((product) => `
    <a href="./product.html?${product._id}">
        <article>
            <img src="${product.imageUrl}" alt="${product.altTxt}" />
            <h3 class="productName">${product.name}</h3>
            <p class="productDescription">${product.description}</p>
        </article>
    `
    ) 
        .join("");
};

productDisplay();