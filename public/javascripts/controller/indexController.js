app.controller('indexController',['$scope' , 'indexFactory' , ($scope , indexFactory) => {

    $scope.messages = [];
    $scope.players = {};

    $scope.init = () => {
        const username = prompt('Please Enter Username');

        if (username)
            initSocket(username);
        else
            return false;
    }

    const connectOptions = {
        reconnectionAttempts: 3,  //kac kere baglanmayı denesın
        reconnectionDelay: 600    //kac ms aralıklar ıle denesın
    }

    //scrool ıslemlerı ıcın
    function scrollTop() {
        setTimeout(() => {
            const element = document.getElementById('chat-area');
            element.scrollTop = element.scrollHeight;
        });
    }

    function showBubleMessage(id,message){
        $('#' +id).find('.message').show().html(message);
        setTimeout(() => {
            $('#' +id).find('.message').show().hide();
        },2000);
    }

    function initSocket(username) {
        indexFactory.connectSocket('http://localhost:3000',connectOptions)
            .then((socket) => {
                socket.emit('newUser', { username });

                socket.on('initPlayers', (players) => {
                    $scope.players = players;
                    $scope.$apply();
                    //console.log(players);
                });

                socket.on('newUser', (data) => {
                    const messageData = {
                        type: {
                            code: 0,     //server
                            status: 1   //login message
                        },
                        username: data.username
                    };

                    $scope.messages.push(messageData);
                    $scope.players[data.id] = data;
                    $scope.$apply();
                });

                socket.on('disUser', (data) => {
                    const messageData = {
                        type: {
                            code: 0,     //server or user message
                            status: 0   //disconnect message
                        },
                        username: data.username
                    };

                    $scope.messages.push(messageData);
                    delete $scope.players[data.id];
                    $scope.$apply();
                });

                socket.on('animate',data => {
                    $('#'+ data.socketId).animate({ 'left': data.x , 'top': data.y }, () => {
                        animate = false;
                    });
                });

                socket.on('newMessages' , message => {
                    $scope.messages.push(message);
                    $scope.$apply();
                    showBubleMessage(message.socketId,message.text);
                    scrollTop();
                });

                //kullanici click yaptiginda topu hareket ettirmek icin
                let animate = false;
                $scope.onClickPlayer = ($event) => {
                    if (!animate){
                        //be ye konumun haberını ver
                        let x = $event.offsetX;
                        let y = $event.offsetY;

                        socket.emit('animate',{x,y})

                        animate = true;
                        $('#'+ socket.id).animate({ 'left': x , 'top': y }, () => {
                            animate = false;
                        });
                    }
                };

                //chat den gelen form
                $scope.newMessage = () => {
                    let message = $scope.message;

                    const messageData = {
                        type : {
                            code: 1 // user message
                        },
                        username : username,
                        text: message
                    };
                    //if (messageData.text !== ""){
                        $scope.messages.push(messageData);
                        $scope.message = '';
                        socket.emit('newMessage', messageData);
                    //}
                    showBubleMessage(socket.id,message);
                    scrollTop();
                };

            }).catch((err) => {
            console.log(err);
        });
    }







}]);