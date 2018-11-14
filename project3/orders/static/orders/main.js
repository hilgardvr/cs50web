let numToppings = 0;

var item = {
    product: "",
    size: "",
    pizzaType: "",
    numToppings: 0,
}

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

function getToppings() {
    checked = document.querySelectorAll(".chk:checked");
    if (checked.length === numToppings) {
        checked.forEach(e => {
            console.log(e.value);
            e.checked = false;
        });
        document.querySelector("#confirmItem").style.display = "none";
    }
}

function showToppings(numTop) {
    numToppings = numTop;
    document.querySelector("#confirmItem").style.display = "block";
}

function addToOrder(button) {
    item.product = button.dataset.product;
    const request = new XMLHttpRequest();
        request.open("GET", "/add_to_order");
        const data = new FormData();
        data.append("product", "pizza");
        request.onload = () => {
            const res = request.responseText;
            alert("received from server: " + res);
            if (product.includes("Topping")) {
                showToppings(product.match(/\d/g).map(Number)[0]);
            }
            const cart = document.querySelector("#cart");
            const li = document.createElement('li');
            li.innerHTML = pizza;
            cart.append(li);
        }
    request.send(data);
}

document.addEventListener('DOMContentLoaded', () => {

    document.querySelector("#confirmItem").style.display = "none";
    let localCart = JSON.parse(localStorage.getItem('cart'));
    if (localCart) {
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
    }
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