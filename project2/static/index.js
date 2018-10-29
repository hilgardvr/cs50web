//shows hidden channel & chat info on submission of name
function changeHidden (name) {
    document.querySelector('#set_name_div').style.display = 'none'
    document.querySelector('#name_set').style.display = 'block'
    document.querySelector('#name_span').innerHTML = name;
}

//deletes username from local storage
function removeUser () {
    localStorage.removeItem('username');
    document.querySelector('#set_name_div').style.display = 'block';
    document.querySelector('#name_set').style.display = 'none';
}

//add a new channels
function addChannels (channels) {
    const select = document.querySelector("#channel_list");
    for (let key in channels) {
        const option = document.createElement('option');
        option.innerHTML = key;
        select.add(option);
    }
}

//creates div and inserts into DOM
function createChatDiv (user, message, date) {
    const div = document.createElement('div');
    div.innerHTML = "<p><b>" + user + "</b></p>" + "<p>" + message + "</p>" + "<p class='time-right'>" + date + "</p>";
    div.setAttribute('class', 'container');
    document.querySelector("#chat_div").appendChild(div);
}

//lists channel chat with helper function createChatDiv
function listChat (channel) {
    document.querySelector("#chat_div").innerHTML = "";
    channel.forEach(e => {
        const user = e.user;
        const message = e.message;
        const date = e.date;
        createChatDiv(user, message, date);
    });
}

//updates the channel status value and user that updated it
function changeStatus(status, name) {
    document.querySelector("#channel_status_text").innerHTML = status;
    document.querySelector("#channel_status_user").innerHTML = name;
}

document.addEventListener('DOMContentLoaded', () => {

    //check if username has been saved before - prompt for username in not
    let name = localStorage.getItem('username');
    if (!name) {
        document.querySelector('#set_name_div').style.display = 'block';
        document.querySelector('#name_set').style.display = 'none';
    } else {
        document.querySelector('#set_name_div').style.display = 'none'
        document.querySelector('#name_set').style.display = 'block'
        document.querySelector('#name_span').innerHTML = name;
    }

    //save username in localstorage on submission
    document.querySelector('#set_name_form').onsubmit = e => {
        e.preventDefault();
        const name = document.querySelector('#name').value;
        localStorage.setItem('username', name);
        changeHidden(name);
    };

    //load channel chat messages on change of channel
    document.querySelector("#channel_list").onchange = e => {
        const chan = e.target.value;
        const request = new XMLHttpRequest();
        request.open('GET', '/api/get-list');
        request.onload = () => {
            const channels = JSON.parse(request.responseText).existing_channels;
            listChat(channels[chan]);
            localStorage.setItem('channel', chan);

            //get channel status
            const statusRequest = new XMLHttpRequest();
            statusRequest.open('GET','/api/get-status');
            statusRequest.onload = () => {
                const channelStatus = JSON.parse(statusRequest.responseText).statuses;
                if (chan in channelStatus) {
                    changeStatus(channelStatus[chan].status, channelStatus[chan].user);
                } else {
                    changeStatus("Not Set", "Not Updated");
                }
            }
            statusRequest.send()
        }
        request.send();
    }

    //get existing channels
    const request = new XMLHttpRequest();
    request.open('GET', '/api/get-list');
    request.onload = () => {
        const channels = JSON.parse(request.responseText).existing_channels;
        addChannels(channels);
        oldChannel = localStorage.getItem('channel');
        if (oldChannel) {
            document.querySelector('#channel_list').value = oldChannel;
        }
        const currentChannel = document.querySelector('#channel_list').value;

        //if a channel is set list chat messages and get channel status
        if (currentChannel) {

            listChat(channels[currentChannel]);

            //get channel status
            const statusRequest = new XMLHttpRequest();
            statusRequest.open('GET','/api/get-status');
            statusRequest.onload = () => {
                const channelStatus = JSON.parse(statusRequest.responseText).statuses;
                if (currentChannel in channelStatus) {
                    changeStatus(channelStatus[currentChannel].status, channelStatus[currentChannel].user);
                } else {
                    changeStatus("Not Set", "Not Updated");
                }
            }
            statusRequest.send();
        }
    }
    request.send();

    //connect websocket
    var socket = io.connect(location.protocol + '//' + document.domain + ':' + location.port);
    //on successfull socket connection
    socket.on('connect', () => {

        //add new channel submission
        document.querySelector('#add_channel_form').onsubmit = e => {
            e.preventDefault();
            const channel_name = document.querySelector("#channel_name").value;
            document.querySelector("#channel_name").value = "";
            socket.emit('add channel', {'channel': channel_name});
        }

        //add new message submission
        document.querySelector('#add_message_form').onsubmit = e => {
            e.preventDefault();
            const channel = document.querySelector('#channel_list').value;
            const user = localStorage.getItem('username');
            const message = document.querySelector('#message').value;
            const date = Date();
            document.querySelector('#message').value = "";
            socket.emit('add message', {'channel': channel, 'user': user, 'message': message, 'date': date});
        }

        //add event listener for channel status
        document.querySelector('#channel_status_form').onsubmit = e => {
            e.preventDefault();
            const channel = document.querySelector('#channel_list').value;
            const status = document.querySelector('#channel_status_field').value;
            const user = localStorage.getItem('username');
            document.querySelector('#channel_status_field').value = "";
            socket.emit('set channel status', {'channel': channel, 'status': status, 'user': user});
        }
    });

    //receive new channel data
    socket.on('announce channel', data => {
        if (data.success) {
            const option = document.createElement('option');
            option.innerHTML = data.channel;
            document.querySelector("#channel_list").add(option);
        } else {
            alert("Channel couldn't be created");
        }
    });

    //receive new message data
    socket.on('announce message', data => {
        if (data.success) {
            if (document.querySelector('#channel_list').value === data.channel) {
                createChatDiv(data.message.user, data.message.message, data.message.date);
            }
        } else {
            alert("Empty message can't be sent");
        }
    });

    //change channel status if current channel has a new status
    socket.on('set channel status', data => {
        thisChannel = document.querySelector('#channel_list').value;
        if (thisChannel == data.channel) {
            changeStatus(data.status, data.user);
        }
    });
})
