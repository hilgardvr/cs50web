function clearLocal() {
    localStorage.removeItem('cart');
    cart = document.querySelector("#cart");
    cart.innerHTML = "";
    document.querySelector("#getToppings").style.display = "none";
}

function checkout() {
    const localCart = JSON.parse(localStorage.getItem('cart'));
    if (!localCart || !localCart.cartArray || localCart.cartArray.length == 0) {
        alert("Cart is empty");
    } else {
        alert("Todo");
    }
}

function getToppings(pizza) {
    document.querySelector("#getToppings").style.display = "block";
    checked = document.querySelectorAll(".chk:checked");
    console.log(pizza);
    //const num = this.window.pizza.match(/\d/g).map(Number)[0];
    const num = pizza.match(/\d/g).map(Number)[0];
    if (checked.length === num) {
        //console.log("selected:");
        for (let check in checked) {
            console.log(check);
        }
        addToOrder(pizza);
        document.querySelector("#getToppings").style.display = "none";
    }
    //const num = pizza.match(/\d/g).map(Number)[0];
    //console.log(num);
}

function addToOrder(button) {
    pizza = button.dataset.pizza;
    const request = new XMLHttpRequest();
        request.open("GET", "/add_to_order?" + pizza);
        request.onload = () => {
            const res = request.responseText;
            alert("received from server: " + res);       
            if (pizza.includes("Topping")) {
                getToppings(pizza);
            }
            cart = document.querySelector("#cart");
            li = document.createElement('li');
            li.innerHTML = pizza;
            cart.append(li);
            /* localCart.cartArray.push(pizza)
            localStorage.setItem('cart', JSON.stringify(localCart)); */
        }
        request.send();
}

document.addEventListener('DOMContentLoaded', () => {

    document.querySelector("#getToppings").style.display = "none";
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
            } else {
                addToOrder(button)
            }
        }
    });
})