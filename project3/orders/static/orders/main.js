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
    const num = pizza.match(/\d/g).map(Number)[0];
    console.log(num);
}

function keepCount() {
    checked = document.querySelectorAll(".chk:checked");
    if (checked.length > 3) {
        console.log(this);
        alert(this.window.pizza);
    }
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
                pizza = button.dataset.pizza;
                if (pizza.includes("Topping")) {
                    getToppings(pizza);
                }
                cart = document.querySelector("#cart");
                li = document.createElement('li');
                li.innerHTML = pizza;
                cart.append(li);
                localCart.cartArray.push(pizza)
                localStorage.setItem('cart', JSON.stringify(localCart));
            }
        }
    });
})