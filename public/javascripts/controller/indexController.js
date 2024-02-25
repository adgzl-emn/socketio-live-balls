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
                            code: 0,     //server or user message
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

                let animate = false;
                socket.on('animate',data => {
                    $('#'+ data.socketId).animate({ 'left': data.x , 'top': data.y }, () => {
                        animate = false;
                    });
                });

                //kullanici click yaptiginda topu hareket ettirmek icin
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
                }
            }).catch((err) => {
            console.log(err);
        });
    }







}]);