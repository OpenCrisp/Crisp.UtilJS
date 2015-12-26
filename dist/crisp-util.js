/*! OpenCrisp UtilJS - v0.2.0 - 2015-12-27
* https://github.com/OpenCrisp/Crisp.UtilJS
* Copyright (c) 2015 Fabian Schmid; Licensed MIT */
/*! OpenCrisp BaseJS - v0.5.2 - 2015-12-26
* https://github.com/OpenCrisp/Crisp.BaseJS
* Copyright (c) 2015 Fabian Schmid; Licensed MIT */
/**
 * Basic Crisp functions
 * @namespace       util
 * 
 * @tutorial {@link http://opencrisp.wca.at/tutorials/BaseJS_test.html|use BaseJS}
 * @tutorial {@link http://opencrisp.wca.at/tutorials/BaseJS-Objects_test.html|use BaseJS Objects}
 */

(function(g) {
    
    /**
     * @private
     * @type        {external:Object#toString}
     * @memberOf    util
     *
     * @example
     * toType.call('a') // [object String]
     */
    var toTypeString = Object.prototype.toString;

    /**
     * @private
     * @type {external:RegExp}
     * @memberOf util
     *
     * @example
     * '[object String]'.replace( regTypeTrim, '$1' ); // 'String'
     *  toType.call('a').replace( regTypeTrim, '$1' ); // 'String'
     */
    var regTypeTrim = /^\[object ([a-z]+)\]$/i;


    /**
     * @private
     * @callback util.utilTickCallback
     * 
     * @param       {external:Array<AnyItem>}  args
     * 
     * @this        AnyItem
     *
     * @see  module:BaseJS.utilTick
     * @see  util.utilTickCall
     *
     * @example
     * callback.apply( self, args );
     */

    /**
     * @private
     * @deprecated 
     * 
     * @param       {util.utilTickCallback}  callback
     * @param       {AnyItem}                opt
     * @param       {AnyItem}                [opt.args=opt]  Arguments for {@link util.utilTickCallback}
     * 
     * @memberOf    util
     * 
     * @see  module:BaseJS.utilTick
     *
     * @example
     * utilTickCall( callback, self, opt );
     *
     * @example <caption>async</caption>
     * setTimeout( utilTickCall, 0, callback, self, opt );
     */
    function utilTickCall( callback, self, opt ) {
        var args = opt.args;

        if ( args === undefined ) {
            args = opt;
        }
        
        args = [].concat( args );

        callback.apply( self, args );

        if ( typeof opt.complete === 'function' ) {
            opt.complete.apply( self, args );
        }
    }

    function toType( object ) {
        var type = toTypeString.call( object ).replace( regTypeTrim, "$1" );

        if ( ['global', 'Null', 'DOMWindow'].indexOf( type ) !== -1 ) {
            type = 'Undefined';
        }

        return type;
    }

    function isType( object, type ) {
        if ( type === 'field' ) {
            return isType( object, 'String' ) || isType( object, 'Number' ) || isType( object, 'Boolean' ) || isType( object, 'Date' ) || isType( object, 'RegExp' );
        }
        else {
            return toType( object ) === type;
        }
    }

    /**
     * Global Crisp Object
     * @global
     * @type        {module:BaseJS}
     * 
     * @tutorial {@link http://opencrisp.wca.at/tutorials/BaseJS_test.html#crisp|use Global Crisp}
     *
     * @example
     * // DOM
     * var $$ = window.Crisp;
     *
     * // NodeJS
     * var $$ = global.Crisp;
     * 
     * // OR
     * var $$ = Crisp;
     *
     * // use Crisp in private Block
     * (function($$) {
     *   // code
     * })(Crisp);
     */
    g.Crisp = {
            
        /**
         * @module BaseJS
         */


        /**
         * managed Crisp Namespace
         * 
         * @param       {external:String} name    Dot seperatet Namespace-Path
         * @param       {AnyItem}         [obj]   Any type of Objects
         * 
         * @this        module:BaseJS
         * @return      {AnyItem} node of Namespace
         *
         * @memberOf    module:BaseJS
         *
         * @tutorial {@link http://opencrisp.wca.at/tutorials/BaseJS_test.html#ns|use ns}
         *
         * @example
         * // GET
         * Crisp.ns('a'); // return reference of a = {}
         * 
         * // SET and GET
         * Crisp.ns('b', { a: 'A' }); // return reference of b = { a: 'A' }
         */
        ns: function( name, obj ) {
            var parts = name.split('.'),
                parent = this,
                length;

            length = parts.length - 1;

            for (var i = 0, m = length; i < m; i += 1) {
                parent[ parts[i] ] = parent[ parts[i] ] || {};
                parent = parent[ parts[i] ];
            }

            if ( obj ) {
                if ( !this.isType( parent[ parts[length] ], "Undefined" ) ) {
                    throw new Error("Can't overwrite '" + name + "' of defined!");
                }

                parent[ parts[length] ] = obj;
            }
            else if ("undefined" === typeof parent[parts[length]]) {
                parent[ parts[length] ] = {};
            }

            return parent[parts[length]];
        },


        /**
         * execute function with (async) {@link util.utilTickCall}
         * 
         * @deprecated change to {@linkcode module:BaseJS.utilTack|Crisp.utilTack( opt, success, complete )}
         * 
         * @param       {external:Object}         [self=opt.self] alternate of opt.self and return param
         * @param       {util.utilTickCallback}   callback        Function for apply
         * @param       {external:Object}         [opt]           Options for apply
         * @param       {AnyItem}                 [opt.self]      thisArg of apply 
         * @param       {AnyItem}                 [opt.args]      Arguments for apply
         * @param       {external:Boolean}        [async=false]   Asynchronus apply
         * 
         * @this        module:BaseJS
         * @return      {self}
         *
         * @memberOf module:BaseJS
         *
         * @tutorial {@link http://opencrisp.wca.at/tutorials/BaseJS_test.html#utiltick|use utilTick}
         *
         * @example <caption>synchronous execution of an anonymous function</caption>
         * Crisp.utilTick({ a: 'A' }, function() {
         *   console.log(this);
         * });
         * console.log('end');
         * // logs:
         * // { "a": "A" }
         * // end
         *
         * @example <caption>asynchronous exetution of an named function</caption>
         * function test( b ) {
         *   console.log( b.c );
         * }
         * 
         * Crisp.utilTick( { a: 'A' }, test, { args: 'C' }, true );
         * console.log('end');
         * // logs:
         * // end
         * // { "a": "A" }
         */
        utilTick: function( self, callback, opt, async ) {
            opt = opt || {};
            self = self || opt.self;

            if ( opt.async ) {
                async = true;
                delete opt.async;
            }

            if ( async ) {
                g.Crisp.nextTick( utilTickCall, callback, self, opt );
                return self;
            }
            else {
                utilTickCall( callback, self, opt );
            }

            return self;
        },


        /**
         * @deprecated use {module:BaseJS.type}
         * @function module:BaseJS.toType
         * @param       {AnyItem} object
         */
        toType: toType,


        /**
         * @deprecated use {module:BaseJS.type}
         * @function module:BaseJS.isType
         * @param       {AnyItem}         object
         * @param       {external:String} type
         */
        isType: isType,


        /**
         * create specified data format
         * 
         * @param       {external:String} type="json"
         * 
         * @this        module:BaseJS
         * @returns     {external:String} converted JavaScript Object
         * 
         * @memberOf    module:BaseJS
         *
         * @tutorial {@link http://opencrisp.wca.at/tutorials/BaseJS_test.html#to|use to}
         *
         * @example
         * Crisp.to.call('a'); // '"a"'
         * Crisp.to.call({ a: 'A' }); // '{"a":"A"}'
         */
        to: function() {
            // TODO add more data formates (XML,CSV,HTML) for create Crisp.to('xml');
            return JSON.stringify( this );
        },


        /**
         * parse data format
         * 
         * @param       {external:String} type="json"
         * 
         * @this        module:BaseJS
         * @return      {AnyItem} JavaScript Objects
         * 
         * @memberOf    module:BaseJS
         *
         * @tutorial {@link http://opencrisp.wca.at/tutorials/BaseJS_test.html#parse|use parse}
         *
         * @example
         * Crisp.parse.call('"a"'); // 'a'
         * Crisp.parse.call('{"a":"A"}'); // { a: 'A' }
         */
        parse: function() {
            // TODO add more data formates (XML,CSV,HTML) for parse Crisp.parse('xml');
            return JSON.parse( this.toString() );
        },


        /**
         * get or check ths small type name of objects
         * @param       {external:String} [type]
         * 
         * @this        module:BaseJS
         * @returns     {external:Boolean|external:String}
         *
         * @memberOf    module:BaseJS
         *
         * @tutorial {@link http://opencrisp.wca.at/tutorials/BaseJS_test.html#type|use type}
         * 
         * @example
         * // GET the small type name of JavaScript objects
         * Crisp.type.call( '' );          // 'String'
         * Crisp.type.call( 0 );           // 'Number'
         * Crisp.type.call( true );        // 'Boolean'
         * Crisp.type.call( new Date() );  // 'Date'
         * Crisp.type.call( {} );          // 'Object'
         * Crisp.type.call( [] );          // 'Array'
         * Crisp.type.call( /a/g );        // 'RegExp'
         * 
         * Crisp.type.call( null );        // 'Undefined'
         * Crisp.type.call( undefined );   // 'Undefined'
         * 
         * // CHECK the small type name of JavaScript objects
         * Crisp.type.call( '',         'String' );     // true
         * Crisp.type.call( 0,          'Number' );     // true
         * Crisp.type.call( true,       'Boolean' );    // true
         * Crisp.type.call( new Date(), 'Date' );       // true
         * Crisp.type.call( {},         'Object' );     // true
         * Crisp.type.call( [],         'Array' );      // true
         * Crisp.type.call( /a/g,       'RegExp' );     // true
         * 
         * Crisp.type.call( null,       'Undefined' );  // true
         * Crisp.type.call( undefined,  'Undefined' );  // true
         * 
         * // CHECH group of object type
         * Crisp.type.call(         '', 'field' );  // true
         * Crisp.type.call(          0, 'field' );  // true
         * Crisp.type.call(       true, 'field' );  // true
         * Crisp.type.call( new Date(), 'field' );  // true
         * Crisp.type.call(       /a/g, 'field' );  // true
         */
        type: function( type ) {
            if ( type ) {
                return isType( this, type );
            }
            else {
                return toType( this );
            }
        },


        /**
         * @deprecated
         * @param       {external:String} name name of Math Function
         * 
         * @this        module:BaseJS
         * @return      {external:Number}
         *
         * @memberOf    module:BaseJS
         *
         * @see external:String#toMath
         * 
         * @tutorial {@link http://opencrisp.wca.at/tutorials/BaseJS_test.html#tomath|use toMath}
         *
         * @example
         * Crisp.toMath.call( -1, 'abs'); // 1
         */
        toMath: function( name ) {
            console.warn('Crisp.toMath is not longer supportet! Use Crisp.math');
            return Math[ name ].call( Math, this );
        },

        /**
         * @param       {external:String} name name of Math Function
         * 
         * @this        module:BaseJS
         * @return      {external:Number}
         *
         * @memberOf    module:BaseJS
         *
         * @see external:String#xMath
         * 
         * @tutorial {@link http://opencrisp.wca.at/tutorials/BaseJS_test.html#tomath|use math}
         *
         * @example
         * Crisp.math.call( -1, 'abs'); // 1
         */
        math: function( name ) {
            return Math[ name ].call( Math, this );
        },


        /**
         * create JSON data format
         * 
         * @deprecated change to {@linkcode module:BaseJS.to|Crisp.to('json')}
         * 
         * @param       {external:Boolean} prity=false
         * 
         * @this        module:BaseJS
         * @returns     {external:String} converted JavaScript Object
         * 
         * @memberOf    module:BaseJS
         *
         * @tutorial {@link http://opencrisp.wca.at/tutorials/BaseJS_test.html#tojson|use toJson}
         */
        toJson: function( prity ) {
            console.warn('Crisp.toJson is not longer supportet! Use Crisp.to');
            return prity ? JSON.stringify( this, null, "\t" ) : JSON.stringify( this );
        },


        /**
         * parse this.toString() to JavaScript Objects
         * 
         * @deprecated change to {@linkcode module:BaseJS.parse|Crisp.parse('json')}
         * 
         * @this        module:BaseJS|AnyItem
         * @return      {AnyItem} JavaScript Objects
         * 
         * @memberOf    module:BaseJS
         *
         * @tutorial {@link http://opencrisp.wca.at/tutorials/BaseJS_test.html#parsejson|use parseJson}
         *
         * @example <caption>create a copy of {@link module:BaseJS} with {@link AnyItem}</caption>
         * Crisp.parseJson(); 
         *
         * @example <caption>parse {@link AnyItem} to {@link external:String} and crate a new JavaScript object of {@link AnyItem}</caption>
         * Crisp.parseJson.call('{"a":"A"}'); // { "a": "A" }
         */
        parseJson: function() {
            console.warn('Crisp.parseJson is not longer supportet! Use Crisp.parse');
            return JSON.parse( this.toString() );
        }

    };

})(typeof process !== 'undefined' && typeof process.title !== 'undefined' && typeof global !== 'undefined' ? global : window);

(function($$) {

    /**
     * only a Break controller without aktivities
     * @function util.control.Break
     *
     * @example
     * var Break = Crisp.ns('util.control.Break');
     * 
     * ['a','b'].xEach({
     *   success: function( item ) {
     *     console.log( item );
     *     throw new Break();
     *   }
     * });
     * 
     * // logs:
     * // 'a'
     */
    $$.ns('util.control.Break', function() {});
    

    /**
     * only a End controller without aktivities
     * @function util.control.End
     *
     * @example
     * var End = Crisp.ns('util.control.End');
     *
     * // tigger an End throw
     * throw new End();
     *
     * // use in a try Block
     * try {
     *   throw new End();
     * } 
     * catch (e) { 
     *   if ( e instanceof End ) {
     *     // code
     *   }
     *   else {
     *     throw e;
     *   }
     * }
     */
    $$.ns('util.control.End', function() {});

})(Crisp);

(function($$) {

    var Break = $$.ns('util.control.Break');

    /**
     * nextTick
     * @param  {external.Function}
     * @param  {*}
     */
    var nextTick = (function() {
        if (typeof process === 'object' && typeof process.nextTick === 'function') {
            return process.nextTick;
        }
        else if (typeof setImmediate === 'function') {
            return setImmediate;
        }
        else {
            return function(fn) {
                return setTimeout.apply(null, [fn, 0].concat( Array.prototype.slice.call(arguments).slice(1) ));
            };
        }
    })();

    $$.nextTick = nextTick;


    function nextTickTackDefault( methodCallback, self, opt, success, complete ) {
        methodCallback.call( self, opt, success );
        complete.call( self, opt );
    }

    /**
     * [utilTack description]
     * @param  {external.Function} methodCallback [description]
     * @param  {external.Array}    methodSchema   [description]
     * @return {external.Function}                [description]
     */
    function utilTack( methodCallback, methodSchema ) {
        function tackDefault( opt, success, complete ) {
            var async;

            if ( opt.async ) {
                async = opt.async;
                delete opt.async;
            }

            // reverse compatibility
            success = success || opt.success || Break;
            complete = complete || opt.complete || Break;

            if ( async ) {
                nextTick( nextTickTackDefault, methodCallback, this, opt, success, complete );
            }
            else {
                methodCallback.call( this, opt, success );
                complete.call( this, opt );
            }
            
            return this;
        }

        Object.defineProperty( tackDefault, 'tick', { value: methodSchema || true });
        Object.defineProperty( tackDefault, 'callback', { value: methodCallback });

        return tackDefault;
    }

    $$.utilTack = utilTack;


    /**
     * [callSchema description]
     * @param  {external.Array} schema [description]
     * @param  {external.Arguments} args   [description]
     * @return {external.Object}        [description]
     */
    function callSchema( schema, args ) {
        var key;
        var opt = {};

        if (Crisp.type.call(args[0], 'Object')) {
            return args[0];
        }

        schema = schema || [];

        for (var i=0, m=args.length; i<m; i+=1 ) {
            key = schema[i] || i;
            opt[key] = args[i];
        }

        return opt;
    }

    $$.callSchema = callSchema;


})(Crisp);

(function($$) {

    var Break = $$.ns('util.control.Break');
    var End = $$.ns('util.control.End');
    var utilTack = $$.utilTack;

    
    /**
     * add one or more items/arrays for concat in Array.
     * empty Arrays and undefined items are ignored 
     * 
     * @function external:Array.prototype.xAdd
     * 
     * @param {...AnyItem} item one or more of args
     * 
     * @this module:EventJS
     * @return {module:EventJS}
     * 
     * @example
     * // standard
     * [].xAdd('a'); // ['a']
     * [].xAdd( 'a', 'b' ); // ['a','b']
     * [].xAdd([ 'a', 'b' ]); // ['a','b']
     * [].xAdd(['a'], ['b']); // ['a','b']
     * 
     * // empty items
     * [].xAdd(); // []
     * [].xAdd([]); // []
     * [].xAdd(['a'], []); // ['a']
     * 
     * // undefined items
     * [].xAdd( undefined ); // []
     * [].xAdd( undefined, 'b' ); // ['b']
     * [].xAdd([ 'a', undefined ]); // ['a']
     * [].xAdd(['a'], [ undefined ]); // ['a']
     */
    function xAddArray() {
        var i = 0,
            m = arguments.length,
            a;

        for (; i<m; i+=1 ) {
            a = arguments[i];

            if ( $$.isType( a, 'Array' ) ) {
                xAddArray.apply( this, a );
            }
            else if ( a !== undefined ) {
                this.push(a);
            }
        }

        return this;
    }

    Object.defineProperty( Array.prototype, 'xAdd', {
        value: xAddArray
    });


    /**
     * call of each Array items with {@linkcode module:BaseJS.utilTick|(async) Crisp.utilTick}
     * and execute <code>option.success</code> and/or <code>option.complete</code> with {@linkcode module:BaseJS.utilTick|(async) Crisp.utilTick}
     * 
     * @function external:Array.prototype.xEach
     * 
     * @param {external:Object}         option
     * @param {util.utilTickCallback}   option.success          callback function for execute each item with {@linkcode module:BaseJS.utilTick|(async) Crisp.utilTick}
     * @param {AnyItem}                 [option.self]           use Object for .call() the <code>option.success</code> an <code>option.complete</code> function
     * @param {util.utilTickCallback}   [option.complete]       callback function for exeute on the end of xEach with {@linkcode module:BaseJS.utilTick|(async) Crisp.utilTick}
     * @param {external:Boolean}        [option.async]          enable asynchronus for call of each Array items with {@linkcode module:BaseJS.utilTick|(async) Crisp.utilTick}
     * @param {external:Number}         [option.start=0]        start index of each 
     * @param {external:Number}         [option.limit=length]   limit items of each
     * 
     * @this external:Array
     * @return {external:Array}
     *
     * @tutorial {@link http://opencrisp.wca.at/tutorials/BaseJS-xEach_test.html#array|use Array.xEach}
     * @tutorial {@link http://opencrisp.wca.at/tutorials/BaseJS-xEach_test.html#array-option-start|use Array.xEach( start )}
     * @tutorial {@link http://opencrisp.wca.at/tutorials/BaseJS-xEach_test.html#array-option-limit|use Array.xEach( limit )}
     *
     * @example
     * ['A','B'].xEach({
     *   success: function( item, index ) {
     *     // return; go to the next item 
     *     // throw new Break(); stop each of items
     *     console.log('success:', index, item );
     *   },
     *   complete: function() {
     *     console.log('complete');
     *   }
     * });
     * console.log('end');
     * // logs:
     * // success: 0 A
     * // success: 1 B
     * // complete
     * // end
     *
     * 
     * @example
     * // async
     * ['A','B'].xEach({
     *   async: true,
     *   success: function( item, index ) {
     *     // return; go to the next item 
     *     // throw new Break(); stop each of items
     *     console.log('success:', index, item );
     *   },
     *   complete: function() {
     *     console.log('complete');
     *   }
     * });
     * console.log('end');
     * // logs:
     * // end
     * // success: 0 A
     * // success: 1 B
     * // complete
     */
    function xEachArray( option, success, picker ) {
        var index,
        
            i = 0,
            reverse = 1,
            length = this.length,
            start = option.start ? Number( option.start ) : 0,
            limit = option.limit === undefined ? length : Number( option.limit );

        
        if ( limit <= 0 ) {
            limit = length;
        }

        if ( start < 0 ) {
            start = length + start;
        }

        if ( start + limit > length ) {
            limit -= start + limit - length;
        }

        if ( start < 0 ) {
            start = 0;
            limit = length;
        }

        if ( option.reverse ) {
            reverse = -1;
            start -= length + reverse;
        }

        for (; i<limit; i+=1 ) {
            try {
                index = ( i + start ) * reverse;

                success.call( option.self, this[ index ], index, picker );
            } catch (e) {
                if ( e instanceof Break ) {
                    if ( option.reverse && option.limit ) {
                        limit += 1;
                    }
                }
                else if ( e instanceof End || index < 0 ) {
                    return this;
                }
                else {
                    throw e;
                }
            }
        }
        
        return this;
    }

    $$.xEachArray = xEachArray;

    Object.defineProperty( Array.prototype, 'xEach', {
        value: utilTack( xEachArray )
    });

})(Crisp);

// (function($$) {

    // var Break = $$.ns('util.control.Break');
    // var End = $$.ns('util.control.End');

    
    /**
     * @function external:Boolean.prototype.xTo
     * @implements {module:BaseJS.to}
     * 
     * @param {external:String} [type="json"] data format
     *
     * @this external:Boolean
     * @return {external:String}
     *
     * @example
     * (false).xTo(); // 'false'
     * (true).xTo(); // 'true'
     */
    // Object.defineProperty( Boolean.prototype, 'xTo', {
    //     value: $$.to
    // });

// })(Crisp);

// (function($$) {

    // var Break = $$.ns('util.control.Break');
    // var End = $$.ns('util.control.End');

    
    /**
     * @function external:Date.prototype.xTo
     * @implements {module:BaseJS.to}
     * 
     * @param {external:String} [type="json"] data format
     *
     * @this external:Date
     * @return {external:String}
     *
     * @example
     * new Date('2015-07-13').xTo(); // '"2015-07-13T00:00:00.000Z"'
     */
    // Object.defineProperty( Date.prototype, 'xTo', {
    //     value: $$.to
    // });

// })(Crisp);

(function($$) {

    // var Break = $$.ns('util.control.Break');
    // var End = $$.ns('util.control.End');

    
    /**
     * check given number is an integer
     * @function external:Number.prototype.isInterger
     *
     * @param {external:Number} value
     *
     * @return {external:Boolean}
     *
     * @see  https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/isInteger
     *
     * @example
     * Number.isInteger(1); // true
     * Number.isInteger(0.5); // false
     */
    Number.isInteger = Number.isInteger || function(value) {
        return $$.isType( value, "Number" ) && isFinite(value) && Math.floor(value) === value;
    };


    /**
     * @deprecated use .xMath()
     * @function external:Number.prototype.toMath
     * @implements {module:BaseJS.toMath}
     * 
     * @param {external:String} name name of Math Function
     *
     * @this external:Number
     * @return {external:Math} return Math[name].apply(this, thisArg)
     *
     * @example
     * (1).toMath('abs'); // 1
     * (-1).toMath('abs'); // 1
     * (-0.1).toMath('abs'); // 0.1
     */
    Object.defineProperty( Number.prototype, 'toMath', {
        value: $$.toMath
    });

    /**
     * @function external:Number.prototype.xMath
     * @implements {module:BaseJS.math}
     * 
     * @param {external:String} name name of Math Function
     *
     * @this external:Number
     * @return {external:Math} return Math[name].apply(this, thisArg)
     *
     * @example
     * (1).xMath('abs'); // 1
     * (-1).xMath('abs'); // 1
     * (-0.1).xMath('abs'); // 0.1
     */
    Object.defineProperty( Number.prototype, 'xMath', {
        value: $$.math
    });


    /**
     * @function external:Number.prototype.xTo
     * @implements {module:BaseJS.to}
     * 
     * @param {external:String} [type="json"] data format
     *
     * @this external:Number
     * @return {external:String}
     *
     * @example
     * (0).xTo(); // '0'
     * (1.5).xTo(); // '1.5'
     */
    // Object.defineProperty( Number.prototype, 'xTo', {
    //     value: $$.to
    // });

})(Crisp);

(function($$) {

    var Break = $$.ns('util.control.Break');
    var End = $$.ns('util.control.End');
    var utilTack = $$.utilTack;


    /**
     * @function external:Object.prototype.toString
     * @see  https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/toString
     */
    
    
    /**
     * call of each Object key-items with {@linkcode module:BaseJS.utilTick|(async) Crisp.utilTick}
     * and execute <code>option.success</code> and/or <code>option.complete</code> with {@linkcode module:BaseJS.utilTick|(async) Crisp.utilTick}
     * 
     * @function external:Object.prototype.xEach
     * 
     * @param {external:Object}         option
     * @param {util.utilTickCallback}   option.success     callback function for execute each item with {@linkcode module:BaseJS.utilTick|(async) Crisp.utilTick}
     * @param {AnyItem}                 [option.self]      use Object for .call() the <code>option.success</code> an <code>option.complete</code> function
     * @param {util.utilTickCallback}   [option.complete]  callback function for exeute on the end of xEach with {@linkcode module:BaseJS.utilTick|(async) Crisp.utilTick}
     * @param {external:Boolean}        [option.async]     enable asynchronus for call of each Object key-items with {@linkcode module:BaseJS.utilTick|(async) Crisp.utilTick}
     * @param {external:Number}         [option.start=0]        start index of each
     * @param {external:Number}         [option.limit=length]   limit items of each
     * 
     * @this external:Object
     * @return {external:Object}
     *
     * @tutorial {@link http://opencrisp.wca.at/tutorials/BaseJS-xEach_test.html#object|use Object.xEach}
     * @tutorial {@link http://opencrisp.wca.at/tutorials/BaseJS-xEach_test.html#object-option-start|use Object.xEach( start )}
     * @tutorial {@link http://opencrisp.wca.at/tutorials/BaseJS-xEach_test.html#object-option-limit|use Object.xEach( limit )}
     *
     * @example
     * {a:'A',b:'B'}.xEach({
     *   success: function( item, index ) {
     *     // return; go to the next item 
     *     // throw new Break(); stop each of items
     *     console.log('success:', index, item );
     *   },
     *   complete: function() {
     *     console.log('complete');
     *   }
     * });
     * console.log('end');
     * // logs:
     * // success: a A
     * // success: b B
     * // complete
     * // end
     *
     * @example <caption>async</caption>
     * {a:'A',b:'B'}.xEach({
     *   async: true,
     *   success: function( item, index ) {
     *     // return; go to the next item 
     *     // throw new Break(); stop each of items
     *     console.log('success:', index, item );
     *   },
     *   complete: function() {
     *     console.log('complete');
     *   }
     * });
     * console.log('end');
     * // logs:
     * // end
     * // success: a A
     * // success: b B
     * // complete
     */
    function xEachObject( option, success, picker ) {
        var index,
            keys = Object.keys( this ),
            i = 0,
            reverse = 1,
            length = keys.length,
            start = option.start ? Number( option.start ) : 0,
            limit = option.limit === undefined ? length : Number( option.limit ),
            name;
        
        if ( limit <= 0 ) {
            limit = length;
        }

        if ( start < 0 ) {
            start = length + start;
        }

        if ( start + limit > length ) {
            limit -= start + limit - length;
        }

        if ( start < 0 ) {
            start = 0;
            limit = length;
        }

        if ( option.reverse ) {
            reverse = -1;
            start -= length + reverse;
        }

        for (; i<limit; i+=1 ) {
            try {
                index = ( i + start ) * reverse;
                name = keys[ index ];
                success.call( option.self, this[ name ], name, picker );
            } catch (e) {
                if ( e instanceof Break ) {
                    if ( option.reverse && option.limit ) {
                        limit += 1;
                    }
                }
                else if ( e instanceof End || index < 0 ) {
                    return this;
                }
                else {
                    throw e;
                }
            }
        }
        
        return this;
    }

    $$.xEachObject = xEachObject;

    Object.defineProperty( Object.prototype, 'xEach', {
        value: utilTack( xEachObject )
    });


    /**
     * @function external:Object.prototype.xTo
     * @implements {module:BaseJS.to}
     * 
     * @param {external:String} [type="json"] data format
     *
     * @this external:Object
     * @return {external:String}
     *
     * @example
     * { a: 'A' }.xTo(); // '{"a":"A"}'
     */
    Object.defineProperty( Object.prototype, 'xTo', {
        value: $$.to
    });


    /**
     * @function external:Object.prototype.xType
     * @implements {module:BaseJS.type}
     * 
     * @param {external:String} [type] JavaScript type
     *
     * @this external:Object
     * @return {external:String|external:Boolean}
     *
     * @example
     * (false).xType();          // 'Object'
     * (true).xType('Object');  // 'true'
     */
    Object.defineProperty( Object.prototype, 'xType', {
        value: $$.type
    });


    /**
     * Object to HTTP URL Parameter
     * @return {external:String}
     */
    Object.defineProperty( Object.prototype, 'toURLParam', {
        value: function() {
            var ret = [];

            this.xEach({
                success: function(item, index) {
                    var str = "";

                    if ( $$.isType( item, 'Object' ) ) {
                        str = item.xTo();
                    }
                    else if ( $$.isType( item, 'Array' ) ) {
                        str = item.xTo();
                    }
                    else if ( $$.isType( item, 'Boolean' ) ) {
                        str = item.xTo();
                    }
                    else {
                        str = item.toString();
                    }

                    str = index.concat("=", str);

                    ret.push(str);
                }
            });

            return ret.join("&");
        }
    });

})(Crisp);

(function($$) {

    // var Break = $$.ns('util.control.Break');
    // var End = $$.ns('util.control.End');


    /**
     * Regualar Expression for escape string
     * @private
     * @type {external:RegExp}
     * 
     * @memberOf external:RegExp
     *
     * @see  {@link http://regexper.com/#%2F%5B.*%2B%3F%5E%24%7B%7D()%7C%5B%5C%5D%5C%5C%5D%2Fg|Regexper.com}
     */
    var regExpEscape = /[.*+?^${}()|[\]\\]/g;


    /**
     * escape all regular expression characters in the given string for inlude in a regular espression
     * @function external:RegExp.escape
     * 
     * @param {external:String} str the string to escape
     * 
     * @return {external:String} escaped string
     *
     * @see  https://developer.mozilla.org/en/docs/Web/JavaScript/Guide/Regular_Expressions
     *
     * @example
     * RegExp.escape('a.b'); // 'a\\.b'
     */
    RegExp.escape = RegExp.escape || function( str ) {
        return str.replace( regExpEscape, "\\$&");
    };

    /**
     * @function external:Object.prototype.xTo
     * @implements {module:BaseJS.to}
     * 
     * @param {external:String} [type="json"] data format
     *
     * @this external:Object
     * @return {external:String}
     *
     * @example
     * { a: 'A' }.xTo(); // '{"a":"A"}'
     */
    Object.defineProperty( RegExp.prototype, 'xTo', {
        value: function() {
            return $$.to.call( this.toString() );
        }
    });

})(Crisp);

(function($$) {

    // var Break = $$.ns('util.control.Break');
    // var End = $$.ns('util.control.End');


    /**
     * @deprecated use .xMath()
     * @function external:String.prototype.toMath
     * @implements {module:BaseJS.toMath}
     * 
     * @param {external:String} name name of Math Function
     *
     * @example
     * '1'.toMath('abs'); // 1
     * '-1'.toMath('abs'); // 1
     * '-0.1'.toMath('abs'); // 0.1
     */
    Object.defineProperty( String.prototype, 'toMath', {
        value: $$.toMath
    });

    /**
     * @function external:String.prototype.xMath
     * @implements {module:BaseJS.math}
     * 
     * @param {external:String} name name of Math Function
     *
     * @example
     * '1'.xMath('abs'); // 1
     * '-1'.xMath('abs'); // 1
     * '-0.1'.xMath('abs'); // 0.1
     */
    Object.defineProperty( String.prototype, 'xMath', {
        value: $$.math
    });


    /**
     * @function external:String.prototype.xTo
     * @implements {module:BaseJS.to}
     * 
     * @param {external:String} [type="json"] data format
     *
     * @this external:String
     * @return {external:String}
     *
     * @example
     * 'a'.xTo(); // '"a"'
     * 'b"c'.xTo(); // '"b\\"c"'
     */
    // Object.defineProperty( String.prototype, 'xTo', {
    //     value: $$.to
    // });


    /**
     * @function external:String.prototype.xParse
     * @implements {module:BaseJS.parse}
     * 
     * @param {external:String} [type="json"] data format
     *
     * @this external:String
     * @return {AnyItem}
     *
     * @example
     * // String
     * '"a"'.xParse(); // 'a'
     * '"b\\"c"'.xParse(); // 'b"c'
     * 
     * // Number
     * '1.5'.xParse(); // 1.5
     * 
     * // Boolean
     * 'true'.xParse(); // true
     * 
     * // Date
     * '"2015-07-13T00:00:00.000Z"'.xParse(); // Date()
     * 
     * // Object
     * '{"a":"A"}'.xParse(); // { a: 'A' }
     * 
     * // Array
     * '["a"]'.xParse(); // ['a']
     */
    Object.defineProperty( String.prototype, 'xParse', {
        value: $$.parse
    });

})(Crisp);

/*! OpenCrisp CreateJS - v0.2.8 - 2015-12-26
* Copyright (c) 2015 Fabian Schmid; Licensed MIT */
(function($$) {

    /**
     * @typedef {external:Object} util.create.newBase
     */


    /**
     * left/right seperator for option properties
     * 
     * @private
     * @memberOf util.create
     * @type {external:String}
     * 
     * @example
     * defaultSeperator; // '__'
     */
    var defaultSeperator = "__";

    /**
     * allow redefine prototype functions
     *
     * @privale
     * @memberOf util.create
     * @type {external:Array}
     * 
     * @example
     * prototypeRedefine; // ['toString','valueOf']
     */
    var prototypeRedefine = ['toString','valueOf'];

    /**
     * global cache for utilCreate(once)
     * @private
     * @type {external:Object}
     * @memberOf util.create
     */
    var once = {};


    /**
     * check for existing prototype or propertie
     * 
     * @private
     * @memberOf util.create
     * 
     * @param  {external:String}        name  [description]
     * 
     * @this   {util.create.newBase}
     * @throws {Error} If [this.prototype[ name ] && name !== "toString"]
     * @throws {Error} If [this.hasOwnProperty( name )]
     */
    function inheritTest( name ) {
        if ( this.prototype[ name ] && prototypeRedefine.indexOf( name ) === -1 ) {
            // console.crisp("error", "Redefined prototype " + name );
            throw new Error("Redefined prototype " + name );
        }
        else if ( this.hasOwnProperty( name ) ) {
            // console.crisp("error", "Can't overwride prototype." + name + " with property!");
            throw new Error("Can't overwride prototype." + name + " with property!");
        }
    }




    function utilPrototypeUnit( option, name ) {
        inheritTest.call( this, name );
        this.prototype[ name ] = option;
    }
    
    function utilPrototypeMultiple( options ) {
        options.xEach({
            self: this,
            success: utilPrototypeUnit
        });
    }

    function utilPrototype( prototypes ) {
        prototypes.xEach({
            self: this,
            success: utilPrototypeMultiple
        });
    }





    /**
     * defineProperty with Crisp style to called object
     * 
     * private
     * @memberOf util.create
     * 
     * @param  {external:String}            name
     * @param  {util.create.crispProperty}  prop
     *
     * @this   {newBase}
     */
    function utilProperty( name, prop ) {
        var newProp = {};

        if (prop.proEnu !== undefined) {
            newProp.enumerable = prop.proEnu;
        }

        if (prop.proCon !== undefined) {
            newProp.configurable = prop.proCon;
        }

        if (prop.proWri !== undefined) {
            newProp.writable = prop.proWri;
        }

        if (prop.proVal !== undefined) {
            newProp.value = prop.proVal;
        }
        else if (prop.proGet !== undefined || prop.proSet !== undefined) {
            newProp.get = prop.proGet;
            newProp.set = prop.proSet;
        }

        Object.defineProperty( this, name, newProp );
    }

    /**
     * @function module:BaseJS.utilProperty
     * @see  util.create.utilProperty
     */
    $$.utilProperty = utilProperty;




    function utilPropertiesUnit( option, name ) {
        utilProperty.call( this, name, option );
    }
    
    function utilPropertiesMultiple( options ) {
        options.xEach({
            self: this,
            success: utilPropertiesUnit
        });
    }

    function utilProperties( properties ) {
        properties.xEach({
            self: this,
            success: utilPropertiesMultiple
        });
    }





    function utilOptionsUnit( option, name ) {
        utilProperty.call( this, optionName( name ), option );
    }
    
    function utilOptionsMultiple( options ) {
        options.xEach({
            self: this,
            success: utilOptionsUnit
        });
    }

    function utilOptions( options ) {
        options.xEach({
            self: this,
            success: utilOptionsMultiple
        });
    }









    function optionName( name ) {
        return defaultSeperator.concat( name, defaultSeperator );
    }

    
    function optionValue( name, value ) {
        if (!this.hasOwnProperty(name)) {
            // console.crisp("error", "option "+name+" Property not set in Object!");
            throw new Error("set Option: Property '" + name + "' not defined!");
        }
        
        // console.crisp("debug", "insert/update option "+name+" in Object ");
        this[ name ] = value;

        return this;
    }


    function optionListUnit( item, name ) {
        optionValue.call( this, optionName( name ), item );
    }

    function optionListMultiple( options ) {
        options.xEach({
            self: this,
            success: optionListUnit
        });
    }

    function optionList( options ) {
        [].xAdd( options ).xEach({
            self: this,
            success: optionListMultiple
        });

        return this;
    }

    function optionIni( name, option ) {
        var value = this[ name ];

        if ( value === undefined ) {
            // console.crisp("debug", "option "+ name +" not defined");

            if ( typeof option.preset === "function" ) {
                // console.crisp("debug", "set option.value "+name+" off default-function: " + option.default.toString() );
                value = option.preset.call( this );
            }
            else {
                // console.crisp("debug", "set option.value "+name+" off default: " + option.default.toString() );
                value = option.preset;
            }

            if ( option.insert ) {
                optionValue.call( this, name, value );
            }
        }

        return value;
    }


    function objDataEach( item, name ) {
        var data = this.data[name];

        if ( data !== undefined ) {
            this.obj[name] = data;
        }
    }


    $$.ns('util.create').prototypes = {

        /**
         * initialice newBase
         * @protected
         * @param  {external:Object} option
         * @return {newBase}
         *
         * @memberOf util.create.prototype
         */
        objIni: function( option ) {
            var create = this._('create');

            utilOptions.call( this, create.options );
            utilProperties.call( this, create.properties );

            return optionList.call( this, option );
        },

        /**
         * managed newBase options
         * 
         * @param  {external:String|external:Object}    option
         * @param  {external:String}                    [option.name]
         * @param  {AnyItem|Funtion}                    [option.preset]   if option.name not defined on newBase return preset (execute Function)
         * @param  {external:Boolean}                   [option.insert]   insert option.preset on newBase if option.name not defined
         * @param  {external:Number}                    [option.before]
         * @param  {external:Number}                    [option.after]
         * 
         * @this {newBase}
         * @return {*}
         *
         * @memberOf util.create.prototype
         */
        _: function( option ) {
            var value, name;

            if ( $$.type.call( option, 'String' ) ) {
                return this[ optionName( option ) ];
            }

            name = optionName( option.name );
            value = optionIni.call( this, name, option );

            if ( option.after ) {
                // console.crisp("addAfter option "+name+" += "+ option.after );
                optionValue.call( this, name, value + option.after );
            }

            if ( option.before ) {
                // console.crisp("addBefore option "+name+" += "+ option.before );
                optionValue.call( this, name, value = value + option.before );
            }

            return value;
        },

        /**
         * set single option
         * 
         * @param  {external:String}    name
         * @param  {*}                  value
         * 
         * @this {newBase}
         * @return {newBase}
         *
         * @memberOf util.create.prototype
         */
        objSet: function( name, value ) {
            return optionValue.call( this, optionName( name ), value );
        },

        /**
         * initialice newBase with data Object
         * 
         * @param  {*}                  data
         * 
         * @this {newBase}
         * @return {newBase}
         *
         * @memberOf util.create.prototype
         */
        objData: function( data ) {
            ( this.objNs('util.props') ? this : data ).xEach({
                self: {
                    obj: this,
                    data: data
                },
                success: objDataEach
            });

            return this;
        },

        /**
         * clone newBase without data
         * 
         * @this {newBase}
         * @return {newBase} Clone of newBase
         *
         * @memberOf util.create.prototype
         * 
         * @tutorial {@link http://opencrisp.wca.at/tutorials/CreateJS_test.html#objClone}
         * 
         */
        objClone: function() {
            function Clone() {}
            Clone.prototype = this;
            return new Clone();
        },

        /**
         * check of ns name is inherit on this object
         * @param  {external:String} ns name string of namespace
         * @return {external:Boolean}
         * 
         * @memberOf util.create.prototype
         * 
         * @tutorial {@link http://opencrisp.wca.at/tutorials/CreateJS_test.html#objNs}
         *
         * @example
         * var myObject = Crisp.utilCreate().objIni();
         * myObject.objNs('util.create');    // true
         */
        objNs: function( ns ) {
            return this._('create').ns.indexOf( ns ) !== -1;
        }

    };





    function createNsEach( item ) {
        var namespace = $$.ns( item );
        this.op.xAdd( namespace.options );
        this.pp.xAdd( namespace.properties );
        this.pt.xAdd( namespace.prototypes );
    }


    /**
     * Design Pattern of JavaScript Classes
     *
     * @function module:BaseJS.utilCreate
     * 
     * @param  {external:Object}      [option]
     * @param  {external:Function}    [option.base={@link external:Function}]
     * @param  {external:String}      [option.once]                            unique name of temporary created object
     * @param  {...external:String}   [option.ns]
     * @param  {...external:Object}   [option.properties]
     * @param  {...external:Object}   [option.prototypes]
     * 
     * @return {object}
     *
     * @tutorial {@link http://opencrisp.wca.at/tutorials/CreateJS_test.html#utilCreate}
     *
     * @see  {@link util.event|inherit namespace util.event}
     * 
     * @example
     * var myObject = Crisp.utilCreate().objIni();
     *
     * @example
     * var myObject = Crisp.utilCreate({
     *     options: {
     *         a: { proWri: true }
     *     },
     *     properties: {
     *         b: {
     *             proEnu: true,
     *             proGet: function() { return 'B'; }
     *         }
     *     },
     *     prototypes: {
     *         c: function() { return 'C'; }
     *     },
     * }).objIni({ a: 'A' });
     * 
     * myObject._('a'); // 'A'
     * myObject.b;      // 'B'
     * myObject.c();    // 'C'
     * 
     * myObject.xTo();  // '{"b":"B"}'
     */
    $$.utilCreate = function( option ) {
        var Base, inherit, ns, object;

        option = option || {};

        if ( once[ option.once ] ) {
            return once[ option.once ].objClone();
        }
        
        Base = option.base || function() {};

        inherit = {
            op: [],     // multiple inherit options 
            pp: [],     // multiple inherit properties
            pt: []      // multiple inherit prototypes
        };

        ns = ['util.create'].xAdd( option.ns ).xEach({
            self: inherit,
            success: createNsEach
        });

        utilPrototype.call( Base, inherit.pt.xAdd( option.prototypes ) );

        object = new Base();

        utilProperty.call( object, optionName('create'), { proVal: {
            ns:         ns, 
            options:    inherit.op.xAdd( option.options ),
            properties: inherit.pp.xAdd( option.properties )
        }});

        if ( option.once ) {
            once[ option.once ] = object;
            return object.objClone();
        }

        return object;
    };



    /**
     * create a new object and inherit options
     * 
     * @module CreateJS
     * 
     * @tutorial  {@link http://opencrisp.wca.at/tutorials/CreateJS_test.html}
     * @see {@link util.event|use the namespace of Crisp.EventJS for inherit with Crisp.utilCreate()}
     * @see {@link util.path|use the namespace of Crisp.PathJS for inherit with Crisp.utilCreate()}
     *
     * @example
     * var myObject = Crisp.utilCreate()
     */


}(Crisp));
/*! OpenCrisp EventJS - v0.4.1 - 2015-12-26
* https://github.com/OpenCrisp/Crisp.EventJS
* Copyright (c) 2015 Fabian Schmid; Licensed MIT */
(function($$) {

    /**
     * @typedef {external:String|external:RegExp} util.event.optionFilter
     */

    /**
     * @typedef  {external:Object}  util.event.optionNote
     * @property {external:String}  [action]
     * @property {external:String}  [path]
     *
     * @see  util.event.EventPicker#Note
     * @see  util.event.EventPickerNote#Add
     */

    var nextTick        = $$.nextTick;
    var utilTick        = $$.utilTick;
    var stringToRegExp  = RegExp.escape;
    var type            = $$.type;

    function noop() {}
    

    /**
     * return "own";
     * 
     * @private
     * @type {external:String}
     * @memberOf util.event
     *
     * @example
     * defaultNoteList; // 'own'
     */
    var defaultNoteList = 'own';


    /**
     * return "task";
     * 
     * @private
     * @type {external:String}
     * @memberOf util.event
     *
     * @example
     * defaultPickerAction; // 'task'
     */
    var defaultPickerAction = 'task';

    var defaultOptionEvent = '__event__';
    var defaultOptionParent = '__parent__';

    /**
     * Action to RegExp find left string
     * @private
     * 
     * @param {util.event.optionFilter} [action]
     *
     * @return {external:RegExp}
     * @return {Undefined}
     * 
     * @memberOf util.event
     *
     * @see  util.event.EventListener
     * @see  util.event.EventListener#is
     *
     * @example
     * toRegExpAction('update');        // /^(update)\.?/
     * toRegExpAction('update.doc');    // /^(update\.doc)\.?/
     * toRegExpAction('update insert'); // /^(update|insert)\.?/
     *
     * toRegExpAction(/^update\.?/);    // /^update\.?/
     *
     * toRegExpAction();                // undefined
     */
    function toReqExpAction( action ) {
        var list;

        if ( action === undefined ) {
            return;
        }

        if ( type.call( action, 'RegExp' ) ) {
            return action;
        }

        list = action.split(' ');

        list.map(function( item ) {
            return stringToRegExp( item );
        });

        return new RegExp( '(^|\\s)(' + list.join('|') + ')($|\\s|\\.)' );
    }


    /**
     * Path to RegExp find left string to end
     * @private
     * 
     * @param {util.event.optionFilter} [path]
     *
     * @return {external:RegExp}
     * @return {Undefined}
     * 
     * @memberOf util.event
     *
     * @example
     * toReqExpPath('doc');         // /^(doc)$/
     * toReqExpPath('doc.a');       // /^(doc\.a)$/
     * toReqExpPath('doc doc.a');   // /^(doc|doc\.a)$/
     *
     * toReqExpPath(/^doc\.?/);     // /^doc\.?/
     *
     * toReqExpPath();              // undefined
     */
    function toReqExpPath( path ) {
        var list;

        if ( path === undefined ) {
            return;
        }

        if ( type.call( path, 'RegExp' ) ) {
            return path;
        }

        list = path.split(' ');

        list.map(function( item ) {
            return stringToRegExp( item );
        });

        return new RegExp( '^(' + list.join('|') + ')$' );
    }

    /**
     * @class
     * @private
     * @memberOf util.event
     */
    function EventPickerNote() {
        /**
         * Object of actions
         * @type {external:Object<...util.event.optionNote>}
         */
        this._list = {};
    }

    EventPickerNote.prototype = {

        /**
         * @param     {external:String} [type={@link util.event.defaultNoteList}]
         *
         * @this util.event.EventPickerNote
         * @returns {...util.event.optionNote} List of notes
         */
        List: function( type ) {
            type = type || defaultNoteList;
            return this._list[ type ] = this._list[ type ] || [];
        },

        /**
         * @param {external:String} type
         *
         * @this util.event.EventPickerNote
         * @returns {external:Number} length List of list
         */
        Length: function( type ) {
            var len = 0;
            var i;

            if ( type !== undefined ) {

            }
            else {

                for ( i in this._list ) {
                    len += this._list[i].length;
                }

            }

            return len;
        },
        
        /**
         * @param {external:String} type
         *
         * @this util.event.EventPickerNote
         * @returns {external:Boolean}
         */
        Empty: function( type ) {
            return 0 === this.Length( type );
        },

        /**
         * @param {util.event.optionNote} option
         * @param {external:String} [type=option.type]
         *
         * @this util.event.EventPickerNote
         */
        Add: function( option, type ) {
            this.List( option.type || type ).push( option );
        }
    };



    /**
     * @class
     * @private
     * 
     * @param {module:EventJS}         self
     * @param {external:Object}        picker
     * @param {external:String}        action
     * @param {external:String}        treat
     * @param {external:String}        [path]
     * @param {external:Boolean}       [empty]
     * 
     * @memberOf util.event
     */
    function EventPicker( self, picker, action, treat, path, empty ) {
        this.self = self;
        this.action = action;
        this.path = path;
        this.repeat = true;
        this.picker = picker;

        this._treat = treat;
        this._empty = empty;

        this._wait = 1;
        this._note = new EventPickerNote();
        
    }

    EventPicker.prototype = {

        /**
         * @this util.event.EventPicker
         * @returns {util.event.EventPicker}
         */
        Wait: function() {
            this._wait += 1;
            return this;
        },

        /**
         * trigger this event
         * 
         * @this util.event.EventPicker
         * @returns {util.event.EventPicker}
         */
        Talk: function() {
            this._wait -= 1;

            if ( this._wait > 0 || ( !this._empty && this._note.Empty() ) ) {
                return this;
            }

            return this.End();
        },

        /**
         * trigger this event
         * 
         * @this util.event.EventPicker
         * @returns {util.event.EventPicker}
         */
        End: function() {
            this._wait = 0;

            delete this.picker[ this._treat ];
            this.self.eventTrigger( this );

            return this;
        },

        /**
         * add note to list
         * 
         * @param {util.event.optionNote} option
         * @param {external:String} type
         * 
         * @this util.event.EventPicker
         * @returns {util.event.EventPicker}
         */
        Note: function( option, type ) {
            this._note.Add( option, type );
            return this;
        },

        /**
         * returns the object of note Lists
         * 
         */
        List: function( type ) {
            return this._note.List( type );
        },

        Test: function( event ) {
            var x=0;

            this._note.List( event._noteList ).forEach(function( note ) {
                var testOffList=0;

                if ( event._notePath && !event._notePath.test( note.path ) ) {
                    testOffList+=1;
                }

                if ( event._noteAction && !event._noteAction.test( note.action ) ) {
                    testOffList+=1;
                }

                if ( testOffList===0 ) {
                    x+=1;
                }
            });

            return x===0;
        }

    };







    /**
     * @class
     * @private
     *
     * @param {external:Object}                 option
     * @param {util.utilTickCallback}           option.listen           initialice {@link util.event.EventListener#_listen}
     * @param {*}                               option.self             initialice {@link util.event.EventListener#_self}
     * @param {external:Boolean}                [option.async]          initialice {@link util.event.EventListener#_async}
     * @param {util.event.optionFilter}         [option.action]         initialice {@link util.event.EventListener#_action}
     * @param {util.event.optionFilter}         [option.path]           initialice {@link util.event.EventListener#_path}
     * @param {external:String}                 [option.noteList={@link util.event.defaultNoteList}]    initialice {@link util.event.EventListener#_noteList}
     * @param {util.event.optionFilter}         [option.noteAction]     initialice {@link util.event.EventListener#_noteAction}
     * @param {util.event.optionFilter}         [option.notePath]       initialice {@link util.event.EventListener#_notePath}
     * 
     * @memberOf util.event
     */
    function EventListener( option ) {
        /**
         * function for callback
         * @private
         * @type {util.utilTickCallback}
         */
        this._listen = option.listen;

        /**
         * object for apply {@link util.event.EventListener#_listen}
         * @private
         * @type {*}
         */
        this._self = option.self;

        /**
         * enabled the asynchronus apply of {@link util.event.EventListener#_listen} with {@link module:BaseJS.utilTick}
         * @private
         * @type {external:Boolean}
         */
        this._async = option.async;
        
        /**
         * Regular Expression for {@link util.event.EventListener#talk} apply test 
         * @private
         * @type {external:RegExp}
         */
        this._action = toReqExpAction( option.action );

        /**
         * Regular Expression for {@link util.event.EventListener#talk} apply test 
         * @private
         * @type {external:RegExp}
         */
        this._path = toReqExpPath( option.path );


        /**
         * Regular Expression for {@link util.event.EventListener#talk} apply test 
         * @private
         * @type {external:RegExp}
         */
        this._noteAction = toReqExpAction( option.noteAction );

        /**
         * Regular Expression for {@link util.event.EventListener#talk} apply test 
         * @private
         * @type {external:RegExp}
         */
        this._notePath = toReqExpPath( option.notePath );

        /**
         * name of noteList
         * @private
         * @type {external:String}
         */
        this._noteList = option.noteList || defaultNoteList;
    }

    EventListener.prototype = {

        /**
         * execute event list
         * @param {external:Object} option
         */
        talk: function( option ) {
            if ( this._self === option.exporter ) {
                return;
            }

            if ( this._action && !this._action.test( option.action ) ) {
                return;
            }

            if ( this._path && !this._path.test( option.path ) ) {
                return;
            }

            if ( this._notePath || this._noteAction ) {

                if ( !(option instanceof EventPicker) || option.Test( this ) ) {
                    return;
                }

            }

            utilTick( this._self, this._listen, option, this._async );
        },

        /**
         * @param  {external:Object} option
         * @return {external:Boolean}
         */
        is: function( option ) {
            var action;

            if ( this._action && option.action ) {
                action = this._action.toString() === toReqExpAction( option.action ).toString();
            }
            else {
                action = this._action === undefined || option.action === undefined;
            }

            return ( this._listen === option.listen && action );
        }
    };



    /**
     * @class
     * @private
     * @memberOf util.event
     * 
     * @requires BaseJS
     */
    function Event() {
        /**
         * list of all registered eventListener
         * @private
         * @type {external:Array<util.event.EventListener>}
         */
        this._listener = [];
    }

    Event.prototype = {

        /**
         * @param {external:Object} opt
         * @return {util.event.EventLintener} existing eventListener or new eventListener
         */
        add: function( opt ) {
            var listener,
                list = this._listener;

            for ( var i=0, m=list.length; i<m; i+=1 ) {
                if ( list[i].is( opt ) ) {
                    return list[i];
                }
            }

            listener = new EventListener( opt );

            list.push( listener );

            return listener;
        },

        /**
         * @param  {Object} opt
         * @return {Event}
         */
        trigger: function( opt ) {
            var list = this._listener;

            for ( var i=0, m=list.length; i<m; i+=1 ) {
                list[i].talk( opt );
            }

            return this;
        },

        /**
         * @param  {EventLinstener} obj
         * @return {Event}
         */
        remove: function( obj ) {
            var list = this._listener;

            for ( var i=0, m=list.length; i<m; i+=1 ) {
                if ( list[i] === obj ) {
                    list.splice( i, 1 );
                    break;
                }
            }

            return this;
        }
    };



    /**
     * @private
     * 
     * @param  {util.event.EventListener}   option
     * @param  {external:Object}            [option.self=this]
     * @param  {util.event.__event__|module:EventJS#__event__} propertyEvent
     * 
     * @return {util.event.EventListener}
     *
     * @memberOf util.event
     *
     * @see  util.event#eventListener
     * @see  module:EventJS.eventListener
     */
    function eventListener( option, propertyEvent ) {
        option.self = option.self || this;
        return propertyEvent.add( option );
    }



    /**
     * @private
     * 
     * @param  {util.event.EventListener#talk}                      [option]
     * @param  {external:Object}                                    [option.self=this]
     * @param  {util.event.__event__|module:EventJS#__event__}      propertyEvent
     * @param  {util.event.__parent__|module:EventJS#__parent__}    propertyParent
     * 
     * @this {this}
     * @return {this}
     *
     * @memberOf util.event
     *
     * @see  util.event#eventTrigger
     * @see  module:EventJS.eventTrigger
     */
    function eventTrigger( option, propertyEvent, propertyParent ) {
        option = option || {};
        option.self = option.self || this;

        propertyEvent.trigger( option );

        if ( option.repeat && propertyParent && type.call( propertyParent.eventTrigger, 'Function' ) ) {
            propertyParent.eventTrigger( option );
        }

        return this;
    }



    /**
     * @private
     * 
     * @param  {util.event.eventPicker}   option
     *
     * @this {this}
     * @return {util.event.EventPicker}
     *
     * @memberOf util.event
     *
     * @see  util.event#eventPicker
     * @see  module:EventJS.eventPicker
     */
    function eventPicker( option ) {
        var action, picker, treat;

        picker = option.cache.picker = option.cache.picker || {};
        action = option.action || defaultPickerAction;
        treat = action.split('.')[0];

        if ( picker[ treat ] instanceof EventPicker ) {
            return picker[ treat ].Wait();
        }

        // Extension for Crisp.PropsJS
        if ( !option.path && type.call( this.docPath, 'Function' ) ) {
            option.path = this.docPath();
        }

        return picker[ treat ] = new EventPicker( this, picker, action, treat, option.path, option.empty );
    }



    /**
     * @private
     * 
     * @param  {util.event.EventListener}                       eventObject
     * @param  {util.event.__event__|module:EventJS#__event__}  propertyEvent
     * 
     * @return {this}
     *
     * @memberOf util.event
     *
     * @see  util.event#eventRemove
     * @see  module:EventJS.eventRemove
     */
    function eventRemove( eventObject, propertyEvent ) {
        propertyEvent.remove( eventObject );
        return this;
    }



    var iniEvent    = { name: 'event', preset: function() { return new Event(); }, insert: true };
    var iniParent   = { name: 'parent', preset: {} };
    var conProperty = { proWri: true };


    $$.ns('util.event').options = {

        /**
         * @property {util.event.Event}
         * @name util.event.__event__
         */
        'event': conProperty
    };


    $$.ns('util.event').prototypes = {

        /**
         * @param {util.event.EventListener} option
         *
         * @this module:CreateJS
         * @return {util.event.EventListener}
         *
         * @implements {util.event.eventListener}
         * @memberOf   util.event.prototype
         *
         * @tutorial {@link http://opencrisp.wca.at/tutorials/EventJS-CreateJS_test.html#eventListener}
         *
         * @example
         * var myObject = Crisp.utilCreate({
         *     ns: 'util.event'
         * }).objIni();
         * 
         * myObject.eventListener({
         *     listen: function( e ) {
         *         assert.strictEqual( myObject, this );
         *         assert.strictEqual( myObject, e.self );
         *     }
         * });
         * 
         * myObject.eventTrigger();
         */
        eventListener: function( option ) {
            return eventListener.call( this, option, this._( iniEvent ) );
        },

        /**
         * @param {util.event.EventListener#talk} option
         *
         * @this module:CreateJS
         * @return {module:CreateJS}
         *
         * @implements {util.event.eventTrigger}
         * @memberOf   util.event.prototype
         *
         * @tutorial {@link http://opencrisp.wca.at/tutorials/EventJS-CreateJS_test.html#eventListener}
         *
         * @example
         * var myObject = Crisp.utilCreate({
         *     ns: 'util.event'
         * }).objIni();
         * 
         * myObject.eventListener({
         *     listen: function( e ) {
         *         assert.strictEqual( myObject, this );
         *         assert.strictEqual( myObject, e.self );
         *     }
         * });
         * 
         * myObject.eventTrigger();
         */
        eventTrigger: function( option ) {
            return eventTrigger.call( this, option, this._( iniEvent ), this._( iniParent ) );
        },

        /**
         * @param  {util.event.eventPicker} option
         *
         * @this   module:CreateJS
         * @return {util.event.EventPicker}
         *
         * @implements {util.event.eventPicker}
         * @memberOf   util.event.prototype
         *
         * @tutorial {@link http://opencrisp.wca.at/tutorials/EventJS-CreateJS_test.html#eventPicker}
         *
         * @example
         * var myObject = Crisp.utilCreate({
         *     ns: 'util.event'
         * }).objIni();
         * 
         * var pickerCache = {};
         * 
         * myObject.eventListener({
         *     listen: function( e ) {
         *         assert.strictEqual( 'task', e.action );
         *         assert.strictEqual( '{"_list":{"own":[{"action":"update"}]}}', JSON.stringify( e._note ) );
         *         assert.strictEqual( myObject, this );
         *         assert.strictEqual( myObject, e.self );
         *     }
         * });
         * 
         * var picker = myObject.eventPicker({
         *     cache: pickerCache
         * });
         * 
         * picker.Note({
         *     action: 'update'
         * });
         * 
         * picker.Talk();
         */
        eventPicker: eventPicker,

        /**
         * @param {util.event.EventListener} eventObject
         *
         * @this   module:CreateJS
         * @return {module:CreateJS}
         *
         * @implements {util.event.eventRemove}
         * @memberOf   util.event.prototype
         *
         * @tutorial {@link http://opencrisp.wca.at/tutorials/EventJS-CreateJS_test.html#eventRemove}
         *
         * @example
         * var myObject = Crisp.utilCreate({
         *     ns: 'util.event'
         * }).objIni();
         * 
         * var eventObject = myObject.eventListener({
         *     listen: function( e ) {
         *         assert.strictEqual( myObject, this );
         *         assert.strictEqual( myObject, e.self );
         *     }
         * });
         * 
         * myObject.eventTrigger();
         * 
         * myObject.eventRemove( eventObject );
         * myObject.eventTrigger();
         */
        eventRemove: function( eventObject ) {
            return eventRemove.call( this, eventObject, this._( iniEvent ) );
        }

    };


    function defaultOption( opt ) {
        opt = opt || {};
        opt.event = opt.event || defaultOptionEvent;
        opt.parent = opt.parent || defaultOptionParent;
        return opt;
    }

    /**
     * Create mothods from EventJS on any Object
     * @function module:BaseJS.defineEvent
     * @param  {external:Object} moduleObject any Object for initiate EventJS methods
     * @param  {external:Object} [moduleOption]
     * @param  {external:String} [moduleOption.event=__event__] name of event cache property
     * @param  {external:String} [moduleOption.parent=__parent__] name of parent reference property
     * @return {module:EventJS} returns the given moduleObject
     *
     * @tutorial {@link http://opencrisp.wca.at/tutorials/EventJS_test.html#defineEvent}
     * 
     */
    function defineEvent( moduleObject, moduleOption ) {

        /**
         * define all event functions on your own object
         * 
         * @module EventJS
         * 
         * @tutorial  {@link http://opencrisp.wca.at/tutorials/EventJS_test.html}
         * @tutorial  {@link http://opencrisp.wca.at/tutorials/EventJS_test.html#options}
         *
         * @see  use option.ns={@link util.event} with {@link module:BaseJS.utilCreate}
         *
         * @example
         * var myObject = {};
         * 
         * Crisp.defineEvent( myObject );
         * 
         * myObject.eventListener({
         *     listen: function( e ) {
         *         assert.strictEqual( myObject, this );
         *         assert.strictEqual( myObject, e.self );
         *     }
         * });
         * 
         * myObject.eventTrigger();
         */

        // moduleOption = moduleOption || {};
        // moduleOption.event = moduleOption.event || defaultOptionEvent;
        // moduleOption.parent = moduleOption.parent || defaultOptionParent;
        moduleOption = defaultOption( moduleOption );

        /**
         * @property {util.event.Event}
         * @name module:EventJS#__event__
         *
         * @tutorial {@link http://opencrisp.wca.at/tutorials/EventJS_test.html#__event__}
         *
         * @example
         * var myObject = {};
         * Crisp.defineEvent( myObject, { event: '__myevent__' });
         */
        Object.defineProperty( moduleObject, moduleOption.event, { writabel: true, value: new Event() });

        /**
         * @abstract
         * @property {module:EventJS} 
         * @name  module:EventJS#__parent__
         * 
         * @tutorial {@link http://opencrisp.wca.at/tutorials/EventJS_test.html#__parent__}
         *
         * @example
         * var myObject = {};
         * Crisp.defineEvent( myObject, { parent: '__myparent__' });
         */
        



        Object.defineProperties( moduleObject, {

            /**
             * @function
             * @param {external:Object}                 option
             * @param {util.utilTickCallback}           option.listen
             * @param {external:Object}                 [option.self={@link module:EventJS|EventJS}]
             * @param {external:Boolean}                [option.async=false]
             * 
             * @param {util.event.optionFilter}         [option.action]
             * @param {util.event.optionFilter}         [option.path]
             * 
             * @param {external:String}                 [option.noteList={@link util.event.defaultNoteList|defaultNoteList}] use on eventPicker
             * @param {util.event.optionFilter}         [option.noteAction] use on eventPicker
             * @param {util.event.optionFilter}         [option.notePath] use on eventPicker
             *
             * @this module:EventJS
             * @return {util.event.EventListener}
             *
             * @memberOf module:EventJS
             *
             * @tutorial {@link http://opencrisp.wca.at/tutorials/EventJS_test.html#eventListener|eventListener}
             * @tutorial {@link http://opencrisp.wca.at/tutorials/EventJS_test.html#option-self|eventListener option.self}
             * @tutorial {@link http://opencrisp.wca.at/tutorials/EventJS_test.html#eventtrigger-option-self|eventListener eventTrigger option.self}
             * @tutorial {@link http://opencrisp.wca.at/tutorials/EventJS_test.html#option-self-eventtrigger-option-self|eventListener option.self eventTrigger option.self}
             * @tutorial {@link http://opencrisp.wca.at/tutorials/EventJS_test.html#option-async|eventListener option.async}
             * @tutorial {@link http://opencrisp.wca.at/tutorials/EventJS_test.html#action-string|eventListener option.action String}
             * @tutorial {@link http://opencrisp.wca.at/tutorials/EventJS_test.html#action-namespace|eventListener option.action Namespace}
             * @tutorial {@link http://opencrisp.wca.at/tutorials/EventJS_test.html#action-regexp|eventListener option.action RegExp}
             * @tutorial {@link http://opencrisp.wca.at/tutorials/EventJS_test.html#path-string|eventListener option.path String}
             * @tutorial {@link http://opencrisp.wca.at/tutorials/EventJS_test.html#path-regexp|eventListener option.path RegExp}
             *
             * @example
             * var myObject = {};
             * 
             * Crisp.defineEvent( myObject );
             * 
             * myObject.eventListener({
             *   listen: function( e ) {}
             * });
             */
            eventListener: {
                value: function ( option ) {
                    return eventListener.call( this, option, this[ moduleOption.event ] );
                }
            },

            /**
             * @function
             * @param {external:Object}  [option]
             * @param {external:Boolean} [option.repeat=false]
             * @param {external:Object}  [option.exporter]      ignore the eventListener function if eventListener(option.self) is the same as eventTrigger(option.exporter) 
             * 
             * @param {external:String}  [option.action]
             * @param {external:String}  [option.path]
             * 
             * @param {AnyItem}          [option.args]          alternate arguments for apply the eventListener function
             *
             * @this module:EventJS
             * @return {module:EventJS}
             *
             * @memberOf module:EventJS
             *
             * @tutorial {@link http://opencrisp.wca.at/tutorials/EventJS_test.html#eventTrigger}
             *
             * @example
             * var myObject = {};
             * 
             * Crisp.defineEvent( myObject );
             * 
             * myObject.eventListener({
             *   listen: function( e ) {}
             * });
             *
             * myObject.eventTrigger();
             */
            eventTrigger: {
                value: function ( option ) {
                    return eventTrigger.call( this, option, this[ moduleOption.event ], this[ moduleOption.parent ] );
                }
            },

            /**
             * @function
             * @param {external:Object} option
             * @param {external:Object} option.cache
             * @param {external:String} [option.action={@link util.event.defaultPickerAction}]
             * @param {external:String} [option.path]
             * @param {external:Boolean} [option.empty] execute event when nodelist is empty 
             *
             * @this module:EventJS
             * @return {util.event.EventPicker}
             *
             * @memberOf module:EventJS
             *
             * @tutorial {@link http://opencrisp.wca.at/tutorials/EventJS-picker_test.html}
             * @tutorial {@link http://opencrisp.wca.at/tutorials/EventJS-picker_test.html#eventpicker|eventPicker}
             * @tutorial {@link http://opencrisp.wca.at/tutorials/EventJS-picker_test.html#option-action|eventPicker option.action}
             * @tutorial {@link http://opencrisp.wca.at/tutorials/EventJS-picker_test.html#option-path|eventPicker option.path}
             * @tutorial {@link http://opencrisp.wca.at/tutorials/EventJS-picker_test.html#multi-note|eventPicker multi note}
             * @tutorial {@link http://opencrisp.wca.at/tutorials/EventJS-picker_test.html#eventlistener-filter-path|eventPicker eventListener filter path}
             * @tutorial {@link http://opencrisp.wca.at/tutorials/EventJS-picker_test.html#eventlistener-filter-notepath|eventPicker eventListener filter notePath}
             * @tutorial {@link http://opencrisp.wca.at/tutorials/EventJS-picker_test.html#eventlistener-filter-noteaction|eventPicker eventListener filter noteAction}
             *
             * @example
             * var myObject = {};
             * var pickerCache = {};
             * 
             * Crisp.defineEvent( myObject );
             * 
             * myObject.eventListener({
             *   listen: function( e ) {
             *     console.log('action:', e.action );
             *     console.log('list:', JSON.stringify( e._note ) );
             *   }
             * });
             * 
             * var picker = myObject.eventPicker({
             *   cache: pickerCache
             * });
             * 
             * picker.Note({
             *   action: 'update'
             * });
             * 
             * picker.Talk();
             * 
             * // logs:
             * // action: 'task'
             * // list: '{"list":{"own":[{"action":"update"}]}}'
             */
            eventPicker: {
                value: eventPicker
            },

            /**
             * @function
             * @param {util.event.EventListener} eventObject
             * 
             * @this module:EventJS
             * @return {module:EventJS}
             *
             * @memberOf module:EventJS
             * 
             * @tutorial {@link http://opencrisp.wca.at/tutorials/EventJS_test.html#eventRemove}
             *
             * @example
             * var myObject = {};
             * 
             * Crisp.defineEvent( myObject );
             * 
             * var eventObject = myObject.eventListener({
             *   listen: function( e ) {}
             * });
             *
             * myObject.eventRemove( eventObject );
             */
            eventRemove: {
                value: function ( eventObject ) {
                    return eventRemove.call( this, eventObject, this[ moduleOption.event ] );
                }
            }

        });

        return moduleObject;
    }

    $$.defineEvent = defineEvent;


    /**
     * The hasOwnEvent() method returns a boolean indicating whether the moduleObject has specified the Event module 
     * @param  {external:Object} moduleObject any Object for initiate EventJS methods
     * @param  {external:Object} [moduleOption]
     * @param  {external:String} [moduleOption.event=__event__] name of event cache property
     * @param  {external:String} [moduleOption.parent=__parent__] name of parent reference property
     * @return {Boolean}              [description]
     */
    function hasOwnEvent( moduleObject, moduleOption ) {
        moduleOption = defaultOption( moduleOption );
        return moduleObject.hasOwnProperty( moduleOption.event ) && ( moduleObject[ moduleOption.event ] instanceof Event );
    }

    $$.hasOwnEvent = hasOwnEvent;



    function nextTickPick( methodCallback, self, opt, success, picker ) {
        methodCallback.call( self, opt, success, picker );
        picker.Talk();
    }

    function utilPick( methodCallback, methodSchema ) {
        function tackPick( opt, success, complete ) {
            var event = {};
            var picker;

            success = success || noop;
            
            $$.defineEvent( event );

            if ( complete ) {
                event.eventListener({
                    self: this,
                    listen: complete
                });
            }
            
            picker = event.eventPicker({
                cache: {},
                empty: true
            });

            if ( opt.async ) {
                nextTick( nextTickPick, methodCallback, this, opt, success, picker );
            }
            else {
                methodCallback.call( this, opt, success, picker );
                picker.Talk();
            }

            return this;
        }

        Object.defineProperty( tackPick, 'tick', { value: methodSchema || true });
        Object.defineProperty( tackPick, 'callback', { value: methodCallback });

        return tackPick;
    }

    $$.utilPick = utilPick;






    function nextTickTask( methodCallback, self, opt, success, type ) {
        var eventTask, eventChanged;

        eventTask = self.eventPicker({
            cache: opt,
            action: 'task.doc.' + type
        });

        eventChanged = self.eventPicker({
            cache: opt,
            action: 'changed.doc.' + type
        });

        function note( task ) {
            self.eventTrigger( task );
            eventTask.Note( task );
            eventChanged.Note( task );
        }

        methodCallback.call( self, opt, success, note );

        eventTask.Talk();
        eventChanged.Talk();
    }

    /**
     * [utilTask description]
     * @param  {external.Function} methodCallback [description]
     * @param  {external.String} methodType     [description]
     * @param  {external.Array} methodSchema   [description]
     * @return {this}                [description]
     */
    function utilTask( methodCallback, methodType, methodSchema ) {
        function tackTask( opt, success ) {
            var async;

            success = success || noop;
            
            if ( opt.async ) {
                async = opt.async;
                delete opt.async;
            }

            if ( async ) {
                nextTick( nextTickTask, methodCallback, this, opt, success, methodType );
            }
            else {
                nextTickTask( methodCallback, this, opt, success, methodType );
            }

            return this;
        }

        return Object.defineProperty( tackTask, 'task', { value: methodSchema || true });
    }

    $$.utilTask = utilTask;

})(Crisp);
/*! OpenCrisp PathJS - v1.0.0 - 2015-12-26
* http://opencrisp.wca.at/docs/util.path.html
* Copyright (c) 2015 Fabian Schmid; Licensed MIT */
(function($$) {

    console.log( (function ( _ ) {
        _.view = function ( self, name, set ) {
            // return;
            // console.warn(self);
            var level;
            
            if ( set === 1 ) {
                self._level = self.reason().level = self.reason().level + 1;
            }
            
            level = 4 * self._level;
            
            var str = printFill( '', level ) + name;

            if ( !set ) {
                self.reason().level = self._level - 1;
            }

            // str = printFill( str, 200, '-');

            if (1) {
                return;
            }
            _.log( str );
        };

        function printFill( str, m, fill ) {
            fill = fill || ' ';
            str = ''.concat(str);
            for ( var i = str.length; i<m; i+=1 ) {
             str += fill;
            }
            return str;
        }

        return "set: console.view()";
    })( console ));

    var utilTick        = $$.utilTick;
    var type          = $$.type;
    

    // var Break = $$.ns('util.control.Break');
    var End = $$.ns('util.control.End');
    var EndPath = function() {};
    function EndPicker() {}



    /**
     * Regular Expresion to find /\"/g 
     * @private
     * @type {RegExp}
     *
     * @memberOf util.path
     */
    var regDoubleQuote = /\\"/g;
    
    /**
     * Regular Expresion to find /\'/g 
     * @private
     * @type {RegExp}
     *
     * @memberOf util.path
     */
    var regSingleQuote = /\\'/g;


    // var PICK_COMPLETE = true;


    /**
     * @namespace util.path.pathOperator
     */
    var pathOperator = {
        /**
         * @function util.path.pathOperator.'>'
         * @private
         * 
         * @param  {*} val0 Value a
         * @param  {*} val1 Value b
         * 
         * @return {external:Boolean}
         */
        '>': function( val0, val1 ) {
            return val0 > val1;
        },
        
        /**
         * @function util.path.pathOperator.'<'
         * @private
         * 
         * @param  {*} val0 Value a
         * @param  {*} val1 Value b
         * 
         * @return {external:Boolean}
         */
        '<': function( val0, val1 ) {
            return val0 < val1;
        },
        
        /**
         * @function util.path.pathOperator.'>='
         * @private
         * 
         * @param  {*} val0 Value a
         * @param  {*} val1 Value b
         * 
         * @return {external:Boolean}
         */
        '>=': function( val0, val1 ) {
            return val0 >= val1;
        },

        /**
         * @function util.path.pathOperator.'<='
         * @private
         * 
         * @param  {*} val0 Value a
         * @param  {*} val1 Value b
         * 
         * @return {external:Boolean}
         */
        '<=': function( val0, val1 ) {
            return val0 <= val1;
        },

        /**
         * @function util.path.pathOperator.'=='
         * @private
         * 
         * @param  {*} val0 Value a
         * @param  {*} val1 Value b
         * 
         * @return {external:Boolean}
         */
        '==': function( val0, val1 ) {
            return val0 === val1;
        },

        /**
         * @function util.path.pathOperator.'!='
         * @private
         * 
         * @param  {*} val0 Value a
         * @param  {*} val1 Value b
         * 
         * @return {external:Boolean}
         */
        '!=': function( val0, val1 ) {
            return val0 !== val1;
        }
    };


    function pathFindEach( node, events, success ) {
        // console.log('type of each', type.call( node.itemEach ) );
        var fn = type.call( node.itemEach, 'Function' ) ? node.itemEach : node.xEach;

        success = success || function ( doc ) {
            nextTick.call( this, doc, null, events );
        };

        fn.callback.call(
            node,
            {   
                self: this,
                reverse: this._revlist
            },
            success
        );
    }

    function pathFindEachAll( node, events ) {
        this.child.exec({ node: node }, events );

        // if ( node.isField() ) {
        if ( !type.call( node, 'Array' ) && !type.call( node, 'Object' ) ) {
            return;
        }

        pathFindEach.call( this, node, events, function( item ) {
            pathFind['#'].call( this, item, events );
        });
    }

    /**
     * @namespace util.path.pathFind
     */
    var pathFind = {

        /**
         * @function util.path.pathFind.'*'
         * @private
         * 
         * @param  {*} node
         */
        '*': pathFindEach,

        /**
         * @function util.path.pathFind.'+'
         * @private
         * 
         * @param  {*} node
         */
        '+': function( node, events ) {
            // console.log('pathFind.#', node.docPath(), testSpecific );
            
            var picker = events.eventPicker({
                cache: events,
                action: 'complete',
                empty: true
            });

            if ( this.child ) {
                this._specific = this.child.filter;
            }

            pickValue.call(
                this,
                this.specific(),
                node,
                function ( valueNode ) {
                    if ( valueNode ) {
                        this.child.exec({ node: node }, events );
                    }
                },
                function () {
                    picker.Talk();
                }
            );
        },

        /**
         * @function util.path.pathFind.'#'
         * @private
         * 
         * @param  {*} node
         */
        '#': function( node, events ) {
            var specific = this.specific();

            if ( specific ) {
                pickValue.call(
                    this,
                    specific,
                    node,
                    function ( valueNode ) {
                        // console.log(' spec', valueNode, picker._wait );
                        if ( valueNode ) {
                            pathFindEachAll.call( this, node, events );
                        }
                    },
                    End
                );
            }
            else {
                pathFindEachAll.call( this, node, events );
            }

        }
    };


    /**
     * check of fn is a function
     * 
     * @private
     * @param  {*} fn
     * @return {external:Boolean}
     *
     * @memberOf util.path
     */
    function isFunction( fn ) {
        return type.call( fn, 'Function' );
    }


    /**
     * @private
     * @param  {*}               ref
     * @param  {*}               node
     * @return {*}
     *
     * @memberOf util.path
     */
    function pickValue( ref, node, success, complete ) {
        var self = this;

        if ( !ref ) {
            console.error('pickValue !ref return');
            return;
        }

        var events = {};
        $$.defineEvent( events );

        events.eventListener({
            // limit: 1,
            // self: this,
            action: 'success',
            // listen: success
            listen: function ( doc ) {
                success.call( self, doc );
            }
        });

        events.eventListener({
            action: 'complete',
            // self: this,
            // listen: complete
            listen: function () {
                complete.call( self );
            }
        });

        try {
            // console.log(ref);
            ref.exec({ node: node }, events );
        }
        catch ( err ) {
            if ( err instanceof EndPicker ) {
                // console.error( err );
                return;
            }
            else if ( err instanceof EndPath ) {
                // console.error( err );
                return;
            }

            // throw new EndPath();
            // console.error( err );
            throw err;
        }
    }


    /**
     * @private
     * @type {external:String}
     *
     * @memberOf util.path
     */
    var strCondition = '\\s*(?:' + 
                '(\\!=|[<>=]{1,2})' +                                       // [1] operator
        '|' +   '(\\!+)' +                                                  // [2] reverse
        '|' +   '(&|\\|)' +                                                 // [3] next
        '|' +   '(\\[|\\()' +                                               // [4] child = findPathCondition
        '|' +   '(\\]|\\))\\.?' +                                           // [5] END of this PathConditionGroup

        '|' +   '(-?\\d+(?:\\.\\d+)?)(?![\\.:~\\d])' +                      // [6] Number
        '|' +   '(true|false)' +                                            // [7] Boolean String
        '|' +   '"((?:[^"\\\\]*|\\\\"|\\\\)*)"' +                           // [8] DoubleQuotet String
        '|' +   "'((?:[^'\\\\]*|\\\\'|\\\\)*)'" +                           // [9] SingleQuotet String
        '|' +   '\\/((?:[^\\/\\\\]*|\\\\\\/|\\\\)+)\\/([igm]{1,3})?' +      // [10] RegExp inclusive Flags
        '|' +   '\\$([\\w]+)\\s?(?![\\w\\.:])' +                            // [11] varName for includet values
        
        '|' +   '.+' +                      //     parse() findPathDoc
    ')\\s*';
    

    /**
     * @private
     * @type {external:RegExp}
     *
     * @memberOf util.path
     */
    var regCondition = new RegExp( strCondition, 'g' );
    // console.log( strCondition );

    var countContition = 0;


    /**
     * @private
     * @param  {*} parent
     * @return {util.path.PathConditionGroup}
     */
    function findPathCondition( parent ) {

        var score;
        var stop;
        var prev;
        var condition;

        var conditionGroup = new PathConditionGroup( this, parent );
        condition = prev = conditionGroup.add(1);

        // print( this, 'findPathCondition START' );
        // this.level += 1;

        regCondition.lastIndex = this._index;

        for (; !stop && ( score = regCondition.exec( this._path ) ); ) {
            this._index = regCondition.lastIndex;
            countContition += 1;

            // console.log('findPathCondition', score.xTo() );
            // print( this, 'findPathCondition', score );

            // \\!=|[<>=]{1,2}
            if ( score[1] !== undefined ) {
                condition._operator = score[1];
                // condition.value = [ condition.child, findPathCondition.call( this, condition ) ];
                // condition.value = [ condition.child, condition = conditionGroup.add() ];
                condition = condition.value = conditionGroup.add();
                // stop = true;
            }
            // \\!+
            else if ( score[2] !== undefined ) {
                condition._reverse = score[2].length;
            }
            // &|\\|
            else if ( score[3] !== undefined ) {
                prev._next = score[3];
                condition = prev = conditionGroup.add(1);
                // condition._prev = score[3];
            }
            // \\[|\\(
            else if ( score[4] !== undefined ) {
                condition.child = findPathCondition.call( this, condition );
            }
            // (\\]|\\))\\.?
            else if ( score[5] !== undefined ) {
                    //     complete.call( this );
                    // }
                    // else {
                    //     complete.call( this );
                    // }
                    // else {
                stop = true;
            }
            // (\\d+(?:\\.\\d+)?)(?!\\.|:)
            else if ( score[6] !== undefined ) {
                condition.child = new PathValue( condition, Number(score[6]) );
            }
            // true|false
            else if ( score[7] !== undefined ) {
                condition.child = new PathValue( condition, score[7] === 'true' );
            }
            // "((?:[^"\\\\]*|\\\\"|\\\\)*)"
            else if ( score[8] !== undefined ) {
                condition.child = new PathValue( condition, score[8].replace( regDoubleQuote, '"' ) );
            }
            // \'((?:[^\'\\\\]*|\\\'|\\\\)*)\'
            else if ( score[9] !== undefined ) {
                condition.child = new PathValue( condition, score[9].replace( regSingleQuote, "'" ) );
            }
            // \\/((?:[^\\/\\\\]*|\\\\\\/|\\\\)+)\\/([igm]{1,3})?
            else if ( score[10] !== undefined ) {
                condition.child = new PathValue( condition, new RegExp( score[10], score[11] ) );
            }
            // \\$([\\w]+)
            else if ( score[12] !== undefined ) {
                condition.child = new PathValue( condition, this.valueKey(score[12]) );
            }
            else {
                this._index = score.index;
                condition.parse();
            }

            regCondition.lastIndex = this._index;

            // if ( countContition > 20 ) {
            //  throw new Error();
            // }
        }

        // this.level -= 1;
        // print( this, 'findPathCondition END' );

        return conditionGroup;
    }


    /**
     * @class
     * @private
     * @memberOf util.path
     */
    function PathBaseProto() {}

    PathBaseProto.prototype = {

        /**
         * @param  {external:String} name
         * @return {*}
         */
        parent: function( name ) {
            if ( name ) {
                return this._parent && isFunction( this._parent[ name ] ) && this._parent[ name ]();
            }
            else {
                return this._parent;
            }
        },

        /**
         * @return {*}
         */
        reason: function() {
            return this._reason || this.parent('reason');
        },

        /**
         * @return {*}
         */
        specific: function() {
            return this._specific || this.parent('specific');
        }

    };



    /**
     * @class
                    //     complete.call( this );
                    // }
                    // else {
     * @private
     * @param {*} reason
     * @param {*} parent
     *
     * @memberOf util.path
     */
    function PathConditionGroup( reason, parent ) {
        if ( !parent ) {
            this._reason = reason;
        }

        this._parent = parent;
        // Object.defineProperty( this, '_parent', { value: parent });
        this.condition = [];
    }

    var pathConditionGroupProto = PathConditionGroup.prototype = new PathBaseProto();

    /**
     * @param  {external:Boolean} include
     * @return {util.path.PathCondition}
     */
    pathConditionGroupProto.add = function( include ) {
        var condition = new PathCondition( this );
        if ( include ) {
            this.condition.push( condition );
        }
        return condition;
    };

    /**
     * @private
     * @param  {*} item
     * @return {*}
     */
    

    /**
     * @param  {external:String} node
     * @return {*}
     */
    // pathConditionGroupProto.exec = Crisp.utilPick( function ( option, success ) {
    pathConditionGroupProto.exec = function ( option, events ) {
        // console.log('pathConditionGroupProto.exec');
        console.view( this, '(', 1 );
        // console.log(this.condition);

        var picker = events.eventPicker({
            cache: events,
            action: 'complete',
            empty: true
        });
        
        this.condition.xEach(
            {
                self: this
            },
            function conditionGroupExecSuccess( item ) {
                // console.log('PathConditionGroup.exec', this.node.xTo() );
                
                picker.Wait();

                if ( item.next('&') ) {
                    // console.log('== next &&&&&&&&&&&&');

                    pickValue.call(
                        this,
                        item,
                        option.node,
                        function ( valueNode ) {
                            // valuePicker.Talk();

                            if ( !valueNode ) {
                                picker.Talk();
                                throw new End();
                            }
                        },
                        function () {
                            picker.Talk();
                        }
                    );

                    return;
                }
                else if ( item.next('|') ) {
                    // console.log('== next |||||||||||||');
                    console.view( this, '|', 2 );

                    pickValue.call(
                        this,
                        item,
                        option.node,
                        function ( valueNode ) {
                            // console.log('.. ', valueNode, (picker === valuePicker) );
                            // console.log('--', valueNode );
                            if ( valueNode ) {
                                nextTick.call( this, valueNode, picker, events );
                                picker.Talk();
                                throw new End();
                            }
                        },
                        function () {
                            picker.Talk();
                        }
                    );

                    return;
                }

                item.exec({ node: option.node }, events );
                picker.Talk();
            },
            function () {
                // console.warn('pathConditionGroupProto.exec complete')
                console.view( arguments[0].self, ')' );
                picker.Talk();
            }
        );
    };


    /**
     * reverse given node
     * 
     * @private
     * @param  {external:Number} reverse
     * @param  {*}               node
     * @return {external:Boolean}
     *
     * @memberOf util.path
     */
    


    function pickReverseEach( reverse, node, callback ) {
        var test = type.call( node, 'Undefined' ) ||
            node==='false' ||
            node===false ||
            (
                type.call( node, 'Boolean' ) && 
                !node.valueOf()
            );

        if ( test ) {
            pickReverse.call( this, reverse, true, callback );
        }
        else if ( type.call( node.isBoolean, 'Function' ) ) {
            if ( node.isBoolean.tick ) {

            }
            else {
                pickReverse.call( this, reverse, ( ( node.isBoolean() && !node.valueOf() ) || !node ), callback );
            }
        }
        else {
            pickReverse.call( this, reverse, !node, callback );
        }
    }


    function pickReverse( reverse, node, callback ) {
        // console.error('pickReverse', reverse);

        if ( reverse > 0 ) {
            reverse = reverse - 1;
            pickReverseEach.apply( this, arguments );
        }
        else {
            callback.call( this, node );
        }
    }


    function pickOperator( operator, node, success, complete ) {
        if ( !operator ) {
            success.call( this, node );
            complete.call( this );
            return;
        }

        pickValue.call(
            this,
            this.value,
            node,
            function ( valueNode ) {

                if ( valueNode instanceof RegExp ) {
                    node = valueNode.test( node );
                    valueNode = true;
                }

                node = pathOperator[ operator ]( node, valueNode );

                // console.log('-- operator:', operator, node, valueNode );
                success.call( this, node );
            },
            complete
        );
    }

    /**
     * @class
     * @private
     * @param {*} parent
     *
     * @memberOf util.path
     */
    function PathCondition( parent ) {
        this._parent = parent;
        // Object.defineProperty( this, '_parent', { value: parent });
    }

    var pathConditionProto = PathCondition.prototype = new PathBaseProto();

    /**
     * @return {util.path.PathCondition}
     */
    pathConditionProto.parse = function() {
        this.child = findPathDoc.call( this.reason(), this );
        return this;
    };

    /**
     * @param  {*} node
     * @return {*}
     */
    pathConditionProto.exec = function ( option, events )  {
        // console.log('pathConditionProto.exec', option.node.xTo(), ( !this.reverse() && !this.operator() ) );
        console.view( this, '>', 1 );

        var picker = events.eventPicker({
            cache: events,
            action: 'complete',
            empty: true
        });
        
        if ( !this.reverse() && !this.operator() ) {
            // callback.call( this, option.node );
            // console.log('no reverse|operator');
            nextTick.call( this, option.node, picker, events );
            picker.Talk();
            console.view( this, '< simple' );
            return;
        }

        // child = execValue( this.child, option.node );
        // console.log('start', option.node );
        pickValue.call(
            this,
            this.child,
            option.node,
            function ( valueNode ) {
                // console.log('valueNode', valueNode );
                pickReverse.call(
                    this,
                    this.reverse(),
                    valueNode,
                    function ( reverseNode ) {
                        // console.log('reverseNode', valueNode );
                        picker.Wait();
                        pickOperator.call(
                            this,
                            this.operator(),
                            reverseNode,
                            function ( operatorNode ) {
                                events.eventTrigger({
                                    action: 'success',
                                    args: operatorNode
                                });
                            },
                            function () {
                                picker.Talk();
                            }
                        );
                    }
                );
            },
            function () {
                picker.Talk();
                console.view( this, '<' );
            }
        );
    };


    /**
     * @return {*}
     */
    pathConditionProto.reverse = function() {
        return this._reverse || 0;
    };

    /**
     * @return {*}
     */
    pathConditionProto.operator = function() {
        return this._operator || 0;
    };

    /**
     * @param {*} next
     * @return {*}
     */
    pathConditionProto.next = function( next ) {
        return next ? this._next === next : this._next;
    };


    /**
     * @private
     * @type {external:String}
     */
    var strPathDoc = '\\s*(?:' +
                '(\\.)' +                                  // [1]   Parent Doc
        '|' +   '(\\^)?(-?\\d*~\\d*|-\\d+)\\.?' +          // [2,3] Limit items
        '|' +   '(\\d+|[a-z][a-z\\d\\-]*)\\.?' +           // [4]   Doc Attribute-Name
        '|' +   '(\\^)?([*#+])\\.?' +                      // [5,6] Value Node
        '|' +   '\\$([a-z\\d_]+)\\.?' +                    // [7]   Repeat
        '|' +   '(:)' +                                    // [8]   findFunction
        '|' +   '(\\[|\\()' +                              // [9]   findCondition
        '|' +   '.+' +                                     //       END of findDoc
    ')\\s*';
    
    /**
     * @private
     * @type {external:RegExp}
     */
    var regPathDoc = new RegExp( strPathDoc, 'g' );

    /**
     * @private
     * @param  {*} parent
     * @return {util.path.PathParent|util.path.PathDoc|util.path.PathRepeat|util.path.PathFilter}
     *
     * @memberOf util.path
     */
    function findPathDoc( parent ) {
        var obj;
        // print( this, 'findPathDoc' );

        regPathDoc.lastIndex = this._index;
        var score = regPathDoc.exec( this._path );

        if ( !score ) {
            return;
        }

        this._index = regPathDoc.lastIndex;

        // console.log( 'findPathDoc', score.xTo() );
        // print( this, 'findPathDoc', score );

        // (\\.)
        if ( score[1] !== undefined ) {
            obj = new PathParent( parent ).parse();
        }
        // (\\^)?(-?\\d*~\\d*|-\\d+)\\.?
        else if ( score[3] !== undefined ) {
            obj = new PathLimit( parent, score[3] ).parse();
            obj._revlist = score[2];
        }
        // (\\d+|[a-z][a-z\\d\\-]*)\\.?
        else if ( score[4] !== undefined ) {
            obj = new PathDoc( parent, score[4] ).parse();
        }
        // (\\^)?([*#+])\\.?
        else if ( score[6] !== undefined ) {
            obj = new PathRepeat( parent, score[6] ).parse();
            obj._revlist = score[5];
        }
        // \\$([a-z\\d_]+)\\.?
        else if ( score[7] !== undefined ) {
            obj = new PathDoc( parent, this.valueKey( score[7] ) ).parse();
            obj._valkey = score[7];
        }
        // (:)
        else if ( score[8] !== undefined ) {
            obj = findPathFunction.call( this, parent );
        }
        // (\\[|\\()
        else if ( score[9] !== undefined ) {
            obj = new PathFilter( parent ).parse();
        }
        else {
            this._index = score.index;
            return;
        }

        return obj;
    }


    /**
     * @class
     * @private
     * @param {*} parent
     *
     * @memberOf util.path
     */
    function PathFilter( parent ) {
        this._parent = parent;
        // Object.defineProperty( this, '_parent', { value: parent });
    }

    var pathFilterProto = PathFilter.prototype = new PathBaseProto();

    /**
     * @return {*}
     */
    pathFilterProto.parse = function() {
        this.filter = findPathCondition.call( this.reason(), this );
        this.child = findPathDoc.call( this.reason(), this );
        return this;
    };

    /**
     * @return {*}
     */
    // var filterCount = 0;
    pathFilterProto.exec = function ( option, events ) {
        // console.log('PathFilter.exec', option.node );
        var node = option.node;
        // var filter = filterCount = filterCount + 1;
        console.view( this, '[', 1 );

        // console.log('PathFilter.exec', !execValue( this.filter, node ) );
        // console.log('============== PathFilter.exec ============' );

        var picker = events.eventPicker({
            cache: events,
            action: 'complete',
            empty: true
        });

        // console.log('-- filter', node );

        var self = this;



        
        pickValue.call(
            this,
            this.filter,
            node,
            function ( valueNode ) {
                // console.log('filter', filter, valueNode );
                // node = valueNode;
                // console.log('pathFilterProto', filter, valueNode );
                if ( valueNode ) {
                    nextTick.call( self, node, picker, events );
                }
                // picker.Talk();
            },
            function () {
                console.view( this, ']' );
                // console.log('pathFilterProto', filter, node );
                // if ( node ) {
                //     nextTick.call( this, option.node, picker );
                // }
                picker.Talk();
            }
        );
    };


    var regPathLimit = /^(-?\d+)?~(\d+)?$/;

    /**
     * interface fore util.props
     * @param  {external:String} fn   uitl.props config function
     * @param  {external:Number}   conf [description]
     * @param  {external:Number}   alt  [description]
     * @return {external:Number}        [description]
     */
    // function configPropsTop( fn, conf, alt ) {
    //     try {
    //         return this._('config')[ fn ]( conf );
    //     }
    //     catch (e) {
    //         return conf || alt;
    //     }
    // }


    /**
     * @class
     * @private
     * @param {*} parent
     *
     * @memberOf util.path
     */
    // function PathLimit( parent, start, limit ) {
    function PathLimit( parent, conf ) {
        this._parent = parent;
        
        // console.log('PathLimit', conf );

        if ( regPathLimit.test( conf ) ) {
            conf = regPathLimit.exec( conf );

            this._start = conf[1];
            this._limit = conf[2];
        }
        else {
            this._start = conf;
        }
    }

    var pathLimitProto = PathLimit.prototype = new PathBaseProto();

    /**
     * @return {*}
     */
    pathLimitProto.parse = function() {
        this.child = findPathDoc.call( this.reason(), this );
        return this;
    };

    /**
     * @return {*}
     */
    pathLimitProto.exec = function( option, events ) {
        // console.log('== limit', node );
        console.view( this, '>~', 1 );

        var picker = events.eventPicker({
            cache: events,
            action: 'complete',
            empty: true
        });

        function success( item ) {
            var specific = this.specific();
 
            if ( specific ) {
                pickValue.call(
                    this,
                    specific,
                    item,
                    function ( valueNode ) {
                        // console.log(' spec', valueNode, picker._wait );
                        if ( valueNode ) {
                            nextTick.call( this, item, null, events );
                        }
                    }
                );
            }
            else {
                nextTick.call( this, item, null, events );
            }
        }

        var opt = {
            self: this,
            reverse: this._revlist
        };

        var fn;

        if ( type.call( option.node.itemLimit, 'Function' ) ) {
            opt.start = this._start;
            opt.limit = this._limit;

            // console.log('limit.exec itemLimit', opt );
            // option.node.itemLimit( opt, success, complete );
            fn = option.node.itemLimit;
        }
        else {
            opt.start = this._start || 0;
            opt.limit = this._limit || 10;

            // console.log('limit.exec xEach', opt );
            // option.node.xEach( opt, success, complete );
            fn = option.node.xEach;
        }

        fn.callback.call( option.node, opt, success );
        picker.Talk();
        
        console.view( this, '<~' );
    };
    

    /**
     * @class
     * @private
     * @param {*} parent
     *
     * @memberOf util.path
     */
    function PathParent( parent ) {
        this._parent = parent;
        // Object.defineProperty( this, '_parent', { value: parent });
    }

    var pathParentProto = PathParent.prototype = new PathBaseProto();

    /**
     * @return {*}
     */
    pathParentProto.parse = function() {
        this.child = findPathDoc.call( this.reason(), this );
        return this;
    };

    /**
     * @return {*}
     */
    pathParentProto.exec = function( option, events ) {
        // console.log('PathParent.exec' );
        console.view( this, '..', 1 );
        nextTick.call( this, option.node.__parent__, null, events );
    };


    /**
     * @class
     * @private
     * @param {*} reason
     * @param {external:String} attr
     *
     * @memberOf util.path
     */
    function PathDoc( reason, attr ) {
        // this._ = reason;
        Object.defineProperty( this, '_parent', { value: reason });
        this._attr = attr;
    }

    var pathDocProto = PathDoc.prototype = new PathBaseProto();

    /**
     * @return {*}
     */
    pathDocProto.parse = function() {
        // console.log('PathDoc.parse child:', this.child );
        this.child = findPathDoc.call( this.reason(), this );
        return this;
    };

    /**
     * @return {*}
     */
    pathDocProto.exec = function( option, events ) {
        // console.log('PathDoc.exec', this.attr() );
        var self = this;
        
        var picker = events.eventPicker({
            cache: events,
            action: 'complete',
            empty: true
        });
        
        if ( !type.call( option.node[ this.attr() ], 'Undefined' ) ) {
            nextTick.call( this, option.node[ this.attr() ], picker, events );
            picker.Talk();
            return;
        }

        if ( this._valkey ) {
            option.node = this.child.exec({ node: this.attr() }, events);
            picker.Talk();
            return;
        }
        else if ( !type.call( option.node.pathInclude, 'Function' ) ) {
            picker.Talk();
            return;
        }


        option.node.pathInclude( this.attr(), function( item ) {
            nextTick.call( self, item, picker, events );
            picker.Talk();
        });
    };

    /**
     * @return {*}
     */
    pathDocProto.attr = function() {
        return this._attr;
    };



    /**
     * @class
     * @private
     * @param {*} parent
     * @param {*} type
     *
     * @memberOf util.path
     */
    function PathRepeat( parent, type ) {
        this._parent = parent;
        // Object.defineProperty( this, '_parent', { value: parent });
        this._type = type;
    }

    var pathRepeatProto = PathRepeat.prototype = new PathBaseProto();

    /**
     * @return {*}
     */
    pathRepeatProto.parse = function() {
        this.child = findPathDoc.call( this.reason(), this );
        return this;
    };

    /**
     * @return {*}
     */
    pathRepeatProto.exec = function( option, events ) {
        // console.log('PathRepeat.exec', this.type(), option.node );
        console.view( this, '>' + this.type(), 1 );

        pathFind[ this.type() ].call( this, option.node, events );
        console.view( this, '<' + this.type() );
    };

    /**
     * @return {*}
     */
    pathRepeatProto.type = function() {
        return this._type;
    };




    var tplFunctionArgs = '(?:[^)\\\\]*|\\\\\\)|\\\\)+';
    var strFunction = '(?:(\\.)|(\\w+)(?:\\((' + tplFunctionArgs + ')\\))?\\.?)\\s*|.+';
    var regFunction = new RegExp( strFunction, 'g' );
    var reqFunctionEscape = /\\([\(\)])/g;

    function findPathFunction( parent ) {
        var score;
        var obj;

        if ( !(parent instanceof PathFunction) ) {
            obj = new PathFunction( parent );
        }

        // print( this, 'findPathFunction' );

        regFunction.lastIndex = this._index;
        score = regFunction.exec( this._path ); 
        
        if ( !score ) {
            return obj;
        }

        this._index = regFunction.lastIndex;
        // print( this, 'findPathFunction', score );

        if ( score[1] !== undefined ) {
            obj = new PathFunction( parent );
        }
        else if ( score[2] !== undefined ) {
            obj = new PathFunction( parent, score[2] );

            if ( score[3] && score[3].length > 0 ) {
                obj._args = JSON.parse('[' + score[3].replace( reqFunctionEscape, '$1' ) + ']');
            }
        }
        else {
            this._index = score.index;
            return obj;
        }

        return obj.parse();
    }


    /**
     * @class
     * @private
     * @param {*} parent
     * @param {*} name
     *
     * @memberOf util.path
     */
    function PathFunction( parent, name ) {
        this._parent = parent;
        // Object.defineProperty( this, '_parent', { value: parent });
        this._name = name;
        // this._name = name || 'toString';
    }

    var pathFunctionProto = PathFunction.prototype = new PathBaseProto();

    /**
     * @return {*}
     */
    pathFunctionProto.parse = function() {
        this.child = findPathFunction.call( this.reason(), this );
        return this;
    };

    /**
     * @return {*}
     */
    pathFunctionProto.exec = function( option, events ) {
        // console.log('PathFunction.exec', this.name() );
        var opt, picker;
        var self = this;
        var fn = option.node[ this.name() ];

        if ( !isFunction( fn ) ) {
            // throw new Error('PathFunction ' + this.name() + ' is not defined!');
            return;
        }

        console.view( this, '>:' + this.name(), 1 );

        
        picker = events.eventPicker({
            cache: events,
            action: 'complete',
            empty: true
        });

        if ( !fn.tick ) {
            option.node = fn.apply( option.node, this.args() );
            // console.log('-- fn:', option.node );
            nextTick.call( this, option.node, picker, events );
            picker.Talk();
            console.view( this, '<:' + this.name() );
            return;
        }

        opt = $$.callSchema( fn.schema || fn.tick, this.args() );
        // console.log('pathFunctionProto');

        function successExec( doc ) {
            // console.log( self.name(), 'pathFunctionProto successExec', option.node);
            console.view( self, '- ' + option.node.xTo(), 2 );
            // console.log('successExec:', doc );
            nextTick.call( self, doc, picker, events );
        }
        
        function completeExec() {
            // console.log( self.name(), 'pathFunctionProto completeExec', option.node);
            console.view( self, '<::' + self.name() );
            picker.Talk();
        }
        
        fn.call( option.node, opt, successExec, completeExec, picker );
    };

    /**
     * @return {*}
     */
    pathFunctionProto.name = function() {
        return this._name || 'toString';
    };

    /**
     * @return {*}
     */
    pathFunctionProto.args = function() {
        return [].xAdd( this._args );
    };



    /**
     * @class
     * @private
     * @param {*} parent
     * @param {*} value
     *
     * @memberOf util.path
     */
    function PathValue( parent, value ) {
        this._parent = parent;
        // Object.defineProperty( this, '_parent', { value: parent });
        this._value = value;
    }

    var pathValueProto = PathValue.prototype = new PathBaseProto();

    /**
     * @return {*}
     */
    pathValueProto.exec = function( option, events ) {
        // console.log('PathValue.exec', this.name() );
        
        var picker = events.eventPicker({
            cache: events,
            action: 'complete',
            empty: true
        });

        nextTick.call( this, this._value, picker, events );
        picker.Talk();
    };





    function nextTick( node, picker, events ) {
        // console.log('nextTick:', node );

        if ( this.child ) {
            this.child.exec({ node: node }, events );
            return;
        }

        var reason = this.reason();

        // stop callback of success if ._start > 0
        if ( ( reason._count += 1 ) <= reason._start ) {
            return;
        }

        events.eventTrigger({
            action: 'success',
            // path: path,
            args: [ node ]
        });

        // console.log('--- nextTick', reason._count, reason._limit );

        if ( reason._limit !== -1 && reason._count >= reason._limit ) {
            // console.log('nextTick.limit', reason._limit, picker.note.list.own );
            
            picker = events.eventPicker({
                cache: events,
                action: 'complete',
                empty: true
            });

            picker.End();
            throw new EndPath();
        }
    }






    function _parsePath( reason, events ) {
        // console.log('path:', reason.path );

        var condition = findPathCondition.call( reason );
        // console.log( JSON.stringify( condition ) );
        // console.log( JSON.stringify(condition,null,"\t") );
        // throw new Error();

        // return condition.exec( this );

        try {
            condition.exec({ node: this }, events );
        }
        catch (err) {

            if ( err instanceof EndPath ) {
                console.error( err );
                return;
            }
            else if ( reason._preset !== undefined ) {
                
                events.eventTrigger({
                    action: 'success',
                    args: reason._preset
                });

                console.error( err );

                return;
            }
            // else if ( err instanceof Break ) {
            //     return;
            // }

            throw err;
        }

    }


    /**
     * @class
     * @private
     * @param {*} option
     *
     * @memberOf util.path
     */
    function Path( option ) {
        this._path = option.path;
        this._values = option.values;
        this._preset = option.preset;
        this._limit = option.limit;
        this._start = option.start;
        this._async = option.async;
        
        this._count = 0;        // count of finde node for ._start
        this._index = 0;        // Zeichenposition für regexp
        // this.level = option.level;        // console log
        // this.filter = option.filter;       // delete

        // this._success = option.success;
        // this._complete = option.complete;
    }

    Path.prototype = {
        /**
         * @return {*}
         */
        valueKey: function( key ) {
            return this._values[ key ];
        }
    };


    /**
     * _pathNode
     * 
     * @private
     * 
     * @param  {external:Object} option
     *
     * @this {this}
     * @return {*}
     *
     * @memberOf util.path
     *
     * @see  util.path#pathNode
     * @see  module:PathJS.pathNode
     *
     * @tutorial {@link http://opencrisp.wca.at/tutorials/PathJS_test.html#pathNode|use pathNode}
     * @tutorial {@link http://opencrisp.wca.at/tutorials/PathJS-path_test.html|more Examples}
     *
     * @example
     * myObject.pathNode('a:'); // 'A'
     */
    function _pathNode( option ) {
        var node;

        option = option || "";

        if ( option.xType('String') ) {
            option = { path: option };
        }

        option.limit = 1;
        option.async = false;
        option.success = function(e) {
            node = e;
        };

        this.pathFind( option );

        if ( type.call( node, 'Undefined' ) ) {
            if ( type.call( option.preset, 'Function' ) ) {
                node = option.preset.call( this );
            }
            else {
                node = option.preset;
            }
        }

        return node;
    }


    /**
     * _pathFind
     * @private
     * 
     * @param  {external:Object} option
     * @param {AnyItem} option.self alternate thisArg of callback
     *
     * @this {this}
     * @return {*}
     *
     * @memberOf util.path
     * 
     * @see  util.path#pathFind
     * @see  module:PathJS.pathFind
//     {
//         path: [
//             '+( :xType("Array").. == "false" ).#:xTo',
//             // '+(!:xType("Array"))#:xTo',
//             // '+.(!:xType("Array")).#.:xTo.',
//             // ' + ( !:xType("Array") ) # : xTo ',
//         ],
//         value: [
//             { data: '{"a":{"b":"B","c":"C"},"g":[{"h":"H0","i":"I0"},{"h":"H1","i":"I1"},{"h":"H2","i":"I2"},{"h":"H3","i":"I3"},{"h":"H4","i":"I4"},{"h":"H5","i":"I5"}]}' },
//             { data: '{"b":"B","c":"C"}' },
//             { data: '"B"' },
//             { data: '"C"' }
//         ]
//     }
// ];
     *
     * @tutorial {@link http://opencrisp.wca.at/tutorials/PathJS_test.html#pathFind|use pathFind}
     * @tutorial {@link http://opencrisp.wca.at/tutorials/PathJS-path_test.html|more Examples}
     *
     */
    function _pathFind( option, success, complete ) {
        // console.log('_pathFind');
        var self;

        option = option || {};
        success = success || option.success;
        complete = complete || option.complete;

        self = option.self || this;
        option.limit = option.limit || -1;
        option.start = option.start || 0;
        
        option.values = option.values || {};
        option.values.self = option.values.self || this;


        var object = new Path( option );
        object.level = 0;

        var events = {};

        $$.defineEvent( events );

        if ( isFunction( success ) ) {
            events.eventListener({
                action: 'success',
                self: self,
                listen: success
            });
        }

        if ( isFunction( complete ) ) {
            events.eventListener({
                action: 'complete',
                self: self,
                listen: complete
            });
        }

        // _parsePath.call( this, object, events );
        utilTick( this, _parsePath, [ object, events ], option.async );

        return this;
    }

    /**
     * _pathExists
     * @private
     * 
     * @param  {external:String} path
     *
     * @this {this}
     * @return {external:Boolean}
     *
     * @memberOf util.path
     * 
     * @see  util.path#pathExists
     * @see  module:PathJS.pathExists
     *
     * @tutorial {@link http://opencrisp.wca.at/tutorials/PathJS_test.html#pathExists|use pathExists}
     * @tutorial {@link http://opencrisp.wca.at/tutorials/PathJS-path_test.html|more Examples}
     *
     */
    function _pathExists( path ) {
        return this.pathNode({ path: path }) !== undefined;
    }

    $$.ns('util.path').prototypes = {

        /**
         * @function
         * @implements {util.path._pathNode}
         * @memberOf   util.path.prototype
         *
         * @example
         * var myObject = Crisp.utilCreate({ ns: 'util.path' });
         */
        pathNode: _pathNode,

        /**
         * @function
         * @implements {util.path._pathFind}
         * @memberOf   util.path.prototype
         *
         */
        pathFind: _pathFind,

        /**
         * @function
         * @implements {util.path._pathExists}
         * @memberOf   util.path.prototype
         *
         */
        pathExists: _pathExists

    };

    /**
     * Create mothods from PathJS on any Object
     * @function module:BaseJS.definePath
     * 
     * @param  {external:Object} moduleObject any Object for initiate PathJS methods
     * 
     * @return {module:PathJS} returns the given moduleObject
     *
     * @tutorial {@link http://opencrisp.wca.at/tutorials/PathJS_test.html#definePath}
     * 
     */
    $$.definePath = function( moduleObject ) {

        /**
         * OpenCrisp module of PathJS allows to navigate in JavaScript objects
         * 
         * @module PathJS
         * 
         * @tutorial  {@link http://opencrisp.wca.at/tutorials/PathJS_test.html}
         * 
         */

        Object.defineProperties( moduleObject, {

            /**
             * @function
             * @implements {util.path._pathNode}
             * @memberOf module:PathJS
             */
            pathNode: {
                value: _pathNode
            },

            /**
             * @function
             * @implements {util.path._pathFind}
             * @memberOf module:PathJS
             */
            pathFind: {
                value: _pathFind
            },

            /**
             * @function
             * @implements {util.path._pathExists}
             * @memberOf module:PathJS
             */
            pathExists: {
                value: _pathExists
            }
        });

    };


}(Crisp));
