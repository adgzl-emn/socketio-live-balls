app.controller('indexController',['$scope' , 'indexFactory' , ($scope , indexFactory) => {

    $scope.messages = [];

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

                socket.on('newUser', (data) => {
                    const messageData = {
                        type: {
                            code: 0,     //server or user message
                            status: 1   //login or disconnect message
                        },
                        username: data.username
                    };

                    $scope.messages.push(messageData);
                    $scope.$apply();
                });

                socket.on('disUser', (data) => {
                    const messageData = {
                        type: {
                            code: 0,     //server or user message
                            status: 0   //login or disconnect message
                        },
                        username: data.username
                    };

                    $scope.messages.push(messageData);
                    $scope.$apply();
                });

            }).catch((err) => {
            console.log(err);
        });
    }







}]);