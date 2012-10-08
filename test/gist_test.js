/*global QUnit:false, module:false, test:false, asyncTest:false, expect:false*/
/*global start:false, stop:false ok:false, equal:false, notEqual:false, deepEqual:false*/
/*global notDeepEqual:false, strictEqual:false, notStrictEqual:false, raises:false*/
(function($) {

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

  module('jQuery#getGists', {
    setup: function() {
      //this.elems = $('#qunit-fixture').children();
      $.mockjax({
        // Matches /data/quote, /data/tweet etc.
        url: 'https://api.github.com/users/*',
        proxy: 'mock.json'
      });

    }
  });

  test("default settings", function() {
    ok($.fn.getGists.defaults, "options set up correctly");
    equal($.fn.getGists.defaults.count, 10, "default global options are set");
    $.fn.getGists.defaults.user = "test";
    equal($.fn.getGists.defaults.user, "test", "can change the defaults globally");
});

  test('chainable', 2, function() {
    ok($("div.container").getGists().addClass("testing"), "can be chained");
    equal($("div.container").hasClass("testing"), true, "class was added correctly from chaining");
  });

  asyncTest('functionality: fetching', 2, function() {
    $.getGists({
      user: "tvooo",
      count: 1,
      success: function(data) {
        equal(data.length, 1, "one gist returned");
        start();
      }
    });
    $.getGists({
      user: "tvooo",
      count: 3,
      success: function(data) {
        equal(data.length, 3, "three gists returned");
        start();
      }
    });
  });

  asyncTest('functionality: embedding', 1, function() {
    $("div.container").getGists({
      user: "tvooo",
      count: 1,
      success: function() {
        setTimeout(function() {
          ok($("div.container div").length, "the gist was embedded");
          start();
        }, 1000);
        //start();
      }
    });
  });

}(jQuery));
