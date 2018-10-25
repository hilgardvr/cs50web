function changeHidden (name) {
    document.querySelector('#set_name_div').style.display = 'none'
    document.querySelector('#name_set').style.display = 'block'
    document.querySelector('#name_span').innerHTML = name;
}

function removeUser () {
    console.log("user wants to be forgotten");
    localStorage.removeItem('username');
    document.querySelector('#set_name_div').style.display = 'block';
    document.querySelector('#name_set').style.display = 'none';
}

document.addEventListener('DOMContentLoaded', () => {
    let name = localStorage.getItem('username');
    if (!name) {
        document.querySelector('#set_name_div').style.display = 'block';
        document.querySelector('#name_set').style.display = 'none';
    } else {
        document.querySelector('#set_name_div').style.display = 'none'
        document.querySelector('#name_set').style.display = 'block'
        document.querySelector('#name_span').innerHTML = name;
    }
    document.querySelector('#set_name_form').onsubmit = e => {
        e.preventDefault();
        const name = document.querySelector('#name').value;
        localStorage.setItem('username', name);
        changeHidden(name);
    };

    var socket = io.connect(location.protocol + '//' + document.domain + ':' + location.port);

    socket.on('connect', () => {
        document.querySelector('#add_channel_form').onsubmit = e => {
            e.preventDefault();
            const channel_name = document.querySelector("#channel_name").value;
            console.log(channel_name);
            socket.emit('add channel', {'channel': channel_name});
        }
    });

    socket.on('announce channels', data => {
        data.forEach(item => {
            const li = document.createElement('li');
            li.innerHTML = item
            document.querySelector("#channel_list").append(li);
        });
    });
})
