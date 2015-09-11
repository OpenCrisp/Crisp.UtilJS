
// [doc of CreateJS](http://opencrisp.wca.at/docs/module-CreateJS.html)<br />
// [doc of utilCreate](http://opencrisp.wca.at/docs/module-BaseJS.html#utilCreate)

// # utilCreate
exports['UtilJS'] = function(assert) {
    var done = assert.done || assert.async();
    assert.expect(1);

    var autos = [{
        "maker": "Nissan",
        "model": "Teana",
        "year": 2011
    }, {
        "maker": "Honda",
        "model": "Jazz",
        "year": 2010
    }, {
        "maker": "Honda",
        "model": "Civic",
        "year": 2007
    }, {
        "maker": "Toyota",
        "model": "Yaris",
        "year": 2008
    }, {
        "maker": "Honda",
        "model": "Accord",
        "year": 2011
    }];

    Crisp.definePath( autos );

    autos.pathFind({
        path: '*.( maker == "Honda" & year > 2009 )',
        complete: function( e ) {
            assert.deepEqual( e.List(), [ { data: autos[1] }, { data: autos[4] } ] );
        }
    });

    done();
};





// // Crisp.definePath( autos );

// autos.pathFind({
//     path: '*.( maker == "Honda" & year > 2009 )'
//     // success: function( data ) {
//     //     console.log( data );
//     // },
//     // complete: function( e ) {
//     //     console.log( e.List() );
//     // }
// });


// // Crisp.definePath( autos );

// autos.pathFind({
//     path: '*.( maker == "Honda" & year > 2009 )'
//     // preset: {},
//     // values: {},
//     // limit: 1,
//     // async: true,
//     // success: function( data ) {
//     //     console.log( data );
//     // },
//     // complete: function( e ) {
//     //     console.log( e.List() );
//     // }
// });