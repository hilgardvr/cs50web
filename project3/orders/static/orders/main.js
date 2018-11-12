function clearLocal() {
    localStorage.removeItem('cart');
    cart = document.querySelector("#cart");
    cart.innerHTML = "";
    document.querySelector("#confirmItem").style.display = "none";
}

function checkout() {
    const localCart = JSON.parse(localStorage.getItem('cart'));
    if (!localCart || !localCart.cartArray || localCart.cartArray.length == 0) {
        alert("Cart is empty");
    } else {
        alert("Todo");
    }
}

function addToOrder(button) {
    item = button.dataset.product;
    const menuDiv = document.querySelector("#showMenu");
    menuDiv.style.display = "none";
    const itemDiv = document.querySelector("#confirmItem");
    itemDiv.style.display = "block";
}

document.addEventListener('DOMContentLoaded', () => {

    document.querySelector("#confirmItem").style.display = "none";
    let localCart = "todo - api get saved db order"
    /* if (localCart) {
        localCart.cartArray.forEach(cartItem => {
            cart = document.querySelector("#cart");
            li = document.createElement('li');
            li.innerHTML = cartItem;
            cart.append(li);
        });
    } else {
        localCart = {
            cartArray: []
        }
    } */
    
    document.querySelectorAll('button').forEach(button => { 
        button.onclick = () => {
            if (button.id == "submitCart") {
                checkout();
            } else if (button.id == "clearCart") {
                clearLocal();
            } else if (button.className == "addToOrder") {
                addToOrder(button)
            } else {
                console.log('no associated functionality..');
            }
        }
    });
})