document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('button').forEach(button => { 
        button.onclick = () => {
            cart = document.querySelector("#cart");
            li = document.createElement('li');
            li.innerHTML = button.dataset.pizza;
            cart.append(li);
            //console.log(button.dataset.pizza);
        }
    })
})