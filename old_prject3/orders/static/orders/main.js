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
    const product = button.dataset.producttype;
    //console.log(button.dataset.pizzatype);
    let getURL = "product=";
    if (product === "pizza") {
        getURL += "pizza&pizza=" + button.dataset.pizza + "&pizzaType=" + button.dataset.pizzatype
            + "&size=" + button.dataset.size + "&price=" + button.dataset.price;
        //console.log(getURL);
    }
    const request = new XMLHttpRequest();
        request.open("GET", "/add_to_order?" + getURL);
        request.onload = () => {
            const res = request.responseText;
            if (product.includes("Topping")) {
                showToppings(product.match(/\d/g).map(Number)[0]);
            }
            const cart = document.querySelector("#cart");
            const li = document.createElement('li');
            li.innerHTML = product;
            cart.append(li);
        }
    request.send();
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
