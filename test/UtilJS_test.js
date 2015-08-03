
// [doc of CreateJS](http://opencrisp.wca.at/docs/module-CreateJS.html)<br />
// [doc of utilCreate](http://opencrisp.wca.at/docs/module-BaseJS.html#utilCreate)

// # utilCreate
exports['UtilJS'] = function(assert) {
    var done = assert.done || assert.async();
    assert.expect(1);
    
    assert.ok(1);

    done();
};

