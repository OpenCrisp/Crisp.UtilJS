
// [doc of CreateJS](http://opencrisp.wca.at/docs/module-CreateJS.html)<br />
// [doc of utilCreate](http://opencrisp.wca.at/docs/module-BaseJS.html#utilCreate)

// # utilCreate
exports['UtilJS'] = function(assert) {
    var done = assert.done || assert.async();
    assert.expect(1);

    var testList = [];

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
        // path: '*.( maker == "Honda" & year > 2009 )',
        success: function ( item ) {
            testList.push( item );
        },
        complete: function () {
            assert.deepEqual( testList, [ autos[1], autos[4] ] );
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