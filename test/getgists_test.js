/*global QUnit:false, module:false, test:false, asyncTest:false, expect:false*/
/*global start:false, stop:false ok:false, equal:false, notEqual:false, deepEqual:false*/
/*global notDeepEqual:false, strictEqual:false, notStrictEqual:false, raises:false*/
(function( $ ) {

    /*
        ======== A Handy Little QUnit Reference ========
        http://docs.jquery.com/QUnit

        Test methods:
            expect(numAssertions)
            stop(increment)
            start(decrement)
        Test assertions:
            ok(value, [message])
            equal(actual, expected, [message])
            notEqual(actual, expected, [message])
            deepEqual(actual, expected, [message])
            notDeepEqual(actual, expected, [message])
            strictEqual(actual, expected, [message])
            notStrictEqual(actual, expected, [message])
            raises(block, [expected], [message])
    */

    module( 'jQuery GetGists', {
        setup: function() {
            $.mockjax({
                url: 'https://api.github.com/users/*',
                proxy: 'mock.json'
            });
        }
    });

    test( 'default settings', function() {
        ok( $.fn.getGists.defaults, 'options set up correctly' );
        equal( $.fn.getGists.defaults.count, 10, 'default global options are set' );
        $.fn.getGists.defaults.user = 'test';
        equal( $.fn.getGists.defaults.user, 'test', 'can change the defaults globally' );
    });

    test( 'chainable', 2, function() {
        ok( $('div.container').getGists().addClass('testing'), 'can be chained' );
        equal( $('div.container').hasClass('testing'), true, 'class was added correctly from chaining' );
    });

    asyncTest( 'functionality: fetching', 2, function() {
        $.fn.getGists({
            user: 'tvooo',
            count: 1,
            success: function( data ) {
                equal( data.length, 1, 'one gist returned' );
                start();
            }
        });
        $.fn.getGists({
            user: 'tvooo',
            count: 3,
            success: function( data ) {
                equal( data.length, 3, 'three gists returned' );
                start();
            }
        });
    });

    asyncTest( 'functionality: embedding <div>', 3, function() {
        $('div.container').getGists({
            user: 'tvooo',
            count: 1,
            outputClass: 'test-gist',
            success: function() {
                setTimeout(function() {
                    ok( $('div.container div').length, 'the <div> was created' );
                    ok( $('div.container div').hasClass('test-gist'), 'the class was applied' );
                    ok( $('div.container div.test-gist div.gist').length, 'the gist was embedded' );
                    start();
                }, 1000);
            }
        });
    });

    asyncTest( 'functionality: embedding <li>', 1, function() {
        $('ul.container').getGists({
            user: 'tvooo',
            count: 2,
            outputClass: 'test-gist',
            outputElem: 'li',
            success: function() {
                setTimeout(function() {
                    equal( $('ul.container li.test-gist').length, 2, 'two gists were embedded as list items' );
                    start();
                }, 1000);
            }
        });
    });

}( jQuery ));
