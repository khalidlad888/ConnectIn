class ChatEngine{
    constructor(chatBoxId, userName){
        this.chatBox = $(`#${chatBoxId}`);
        this.userName = userName;

        this.socket = io.connect('http://localhost:5000');

        if(this.userName){
            this.connectionHandler();
        }
    }

    connectionHandler(){
        let self= this;

        this.socket.on('connect', function(){
            console.log("Connection established using sockets");

            self.socket.emit('join_room', {
                user_name: self.userName,
                chatroom: 'connectin'
            })

            self.socket.on('user_joined', function(data){
                console.log('an user joined', data)
            })
        })

        $('#send-message').click(function(){
            let msg = $('#chat-message-input').val();

            if(msg != ''){
                self.socket.emit('send_message', {
                    message: msg,
                    user_name: self.userName,
                    chatroom: 'connectin'
                });
            }
        });

        self.socket.on('receive_message', function(data){
            console.log('message received', data.message);

            let newMessage = $('<li>');

            let messageType = 'other-message';

            if (data.user_name == self.userName){
                messageType = 'self-message';
            }

            newMessage.append($('<span>', {
                'html': data.message
            }));

            newMessage.append($('<br>' ));

            newMessage.append($('<sub>', {
                'html': data.user_name
            }));

            newMessage.addClass(messageType);

            $('#chat-messages-list').append(newMessage);
        });
    };
};