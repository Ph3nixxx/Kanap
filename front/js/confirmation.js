/* Sélection de l'ID de l'URL pour l'injecter dans le numéro de commande en milieu de page */
let orderId = window.location.search.split("?orderId=").join("");
document.getElementById("orderId").innerText = orderId;