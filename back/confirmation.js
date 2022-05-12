let orderId = window.location.search.split("?orderId=").join("");
console.log(orderId);
document.getElementById("orderId").innerText = orderId;