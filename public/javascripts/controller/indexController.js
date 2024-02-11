app.controller('indexController',['$scope' , 'indexFactory' , ($scope , indexFactory) => {

    const connectOptions = {

    }

    indexFactory.connectSocket('http://localhost:3000',connectOptions)
        .then((socket) => {
            console.log('Baglanti Gerceklesti');
        }).catch((err) => {
            console.log(err);
    })

}]);