let product = window.location.search.split("?").join("");

let productInfo = [];

let productGet = async () => {
    await fetch(`http://localhost:3000/api/products/${product}`)
        .then((res) => res.json())
            .then((promise) => {
                productInfo = promise;
                console.log(productInfo);
            });
};

let productDisplay = async () => {
    await productGet();

    document.getElementById("item__img").innerHTML = `
    <img src="${productInfo.imageUrl}" alt="${productInfo.altTxt}">
    `
    document.getElementById("title").innerHTML = `
    ${productInfo.name}
    `
    document.getElementById("price").innerHTML = `
    ${productInfo.price}
    `
    document.getElementById("description").innerHTML = `
    ${productInfo.description}
    `

    let colorSelect = document.getElementById("colors");

    productInfo.colors.forEach((color) => {
        let eachColor = document.createElement("option");
        eachColor.innerHTML = `${color}`;
        eachColor.value = `${color}`;
        colorSelect.appendChild(eachColor);
    });
    addToCart(productInfo);
};

productDisplay();

let addToCart = () => {
    let button = document.getElementById("addToCart");
    button.addEventListener("click", () => {
        let productArray = JSON.parse(localStorage.getItem("product"));

        let colorSelect = document.getElementById("colors");

        let productColor = Object.assign({}, productInfo, {
            color : `${colorSelect.value}`,
            quantity : parseInt(quantity.value)
        });

        console.log(productColor);

        if(productArray == null) {
            productArray = [];
            productArray.push(productColor);
            localStorage.setItem("product", JSON.stringify(productArray));
        } else if(productArray != null) {
            for(i=0; i < productArray.length; i++) {
                if(productArray[i]._id == productInfo._id && productArray[i].color == colorSelect.value) {
                    return(
                        productArray[i].quantity += productColor.quantity,
                        console.log("add quantity"),
                        localStorage.setItem("product",JSON.stringify(productArray)),
                        (productArray = JSON.parse(localStorage.getItem("product")))
                    );
                }
            }
            for(i=0; i < productArray.length; i++) {
                if((productArray[i]._id == productInfo._id && productArray[i].color != colorSelect.value) || productArray[i]._id != productInfo._id) {
                    return(
                        productArray.push(productColor),
                        localStorage.setItem("product", JSON.stringify(productArray)),
                        (productArray = JSON.parse(localStorage.getItem("product")))
                    );
                }
            }
        }
    });
    return(
        productArray = JSON.parse(localStorage.getItem("product")));
};

let onColorChange = () => {
    let colors = document.getElementById("colors");
    let button = document.getElementById("addToCart");
    if(colors.value == "empty") {
        button.disabled = true;
        colors.className="error";
    } else {
        button.disabled = false;
        colors.className="";
    }
};

onColorChange();

