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

function checkNumToppings() {
    console.log(this);
}

function addToOrder(button) {
    item = button.dataset.product.split(" ");
    const menuDiv = document.querySelector("#showMenu");
    menuDiv.style.display = "none";
    const itemDiv = document.querySelector("#confirmItem");
    itemDiv.style.display = "block";
    console.log(item);
    if (item.length == 9 && item[0] == "Pizza") {
        document.querySelector("#product").value = item[0];
        document.querySelector("#pizzaType").value = item[1];
        document.querySelector("#size").value = item[2];
        const numToppings = item[3];
        if (numToppings === "1") {
            topping = "1 Topping";
        } else {
            topping = numToppings + " Toppings";
        }
        document.querySelector("#toppings").value = topping;
        document.querySelector("#price").value = parseFloat(item[8]).toFixed(2);
        document.querySelector("#num_toppings").innerHTML = item[3];
    }
}

document.addEventListener('DOMContentLoaded', () => {

    document.querySelector("#confirmItem").style.display = "none";
    let localCart = "todo - api get saved db order";
    
    document.querySelectorAll('button').forEach(button => { 
        button.onclick = () => {
            if (button.id == "submitCart") {
                checkout();
            } else if (button.id == "clearCart") {
                clearLocal();
            } else if (button.className == "addToOrder") {
                addToOrder(button);
            } else {
                console.log('no associated functionality..');
            }
        }
    });
});