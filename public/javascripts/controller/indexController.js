app.controller('indexController',['$scope' , 'indexFactory' , ($scope , indexFactory) => {

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
                console.log(username + ' Baglantiyi Gerceklesti',socket);
                socket.emit('newUser', { username });
            }).catch((err) => {
            console.log(err);
        });
    }







}]);