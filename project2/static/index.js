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

function addChannels (channels) {
    for (let key in channels) {
        const option = document.createElement('option');
        option.innerHTML = key;
        document.querySelector("#channel_list").add(option);
        /*for (let user in channels[key]) {
            console.log(user + ": " + channels[key][user]);
            createChatDiv(user, channels[key][user]);
        }*/
    }
}

function createChatDiv (user, message) {
    const div = document.createElement('div');
    div.innerHTML = "<p>" + user + "</p>" + "<p>" + message + "</p>";
    div.setAttribute('class', 'container');
    document.querySelector("#chat_div").appendChild(div);
}

function listChat (channel) {
    //console.log("inside list");
    document.querySelector("#chat_div").innerHTML = "";
    for (let key in channel) {
        const user = key;
        const msg = channel[user];
        createChatDiv(user, msg);
    }
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

    document.querySelector("#channel_list").onchange = e => {
        console.log(e.target.value);
        const chan = e.target.value;
        const request = new XMLHttpRequest();
        request.open('GET', '/api/get-list');
        request.onload = () => {
            const channel = JSON.parse(request.responseText).existing_channels;
            listChat(channel[chan]);
        }
        request.send();
    }

    const request = new XMLHttpRequest();
    request.open('GET', '/api/get-list');
    request.onload = () => {
        const channels = JSON.parse(request.responseText).existing_channels;
        addChannels(channels);
    }
    request.send();

    var socket = io.connect(location.protocol + '//' + document.domain + ':' + location.port);

    //on successfull socket connection
    socket.on('connect', () => {

        //add new channel submission
        document.querySelector('#add_channel_form').onsubmit = e => {
            e.preventDefault();
            const channel_name = document.querySelector("#channel_name").value;
            document.querySelector("#channel_name").value = "";
            socket.emit('add channel', {'channel': channel_name});
            //socket.emit('add channel', {'channel': channel_name, 'user': localStorage.getItem("username"), 'date': Date()} );
        }

        //add new message submission
        document.querySelector('#add_message_form').onsubmit = e => {
            e.preventDefault();
            const channel = document.querySelector('#channel_list').value;
            console.log("channel: " + channel);
            const user = localStorage.getItem('username');
            const message = document.querySelector('#message').value;
            const date = Date();
            document.querySelector('#message').value = "";
            socket.emit('add message', {'channel': channel, 'user': user, 'message': message, 'date': date});
        }
    });

    //receive new channel data via socket
    socket.on('announce channels', data => {
        document.querySelector("#channel_list").innerHTML = "";
        if (data.success) {
            addChannels(data.channels);
            console.log(data.channels.random);
            //listChat(data.channelsdocument.querySelector("#channel_list").value);
        } else {
            alert("Channel/message couldn't be created");
            addChannels(data.channels);
        }
    });
})
