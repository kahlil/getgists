# jQuery GetGists Plugin

A simple jQuery plugin to access the Gist repository of a Github user.

## Getting Started
In your web page:

```html
<script src="jquery.js"></script>
<script src="getgists.min.js"></script>
<script>
jQuery(function($) {
  $('.container').getGists({
    user: 'tvooo',
    language: 'javascript'
  });
});
</script>
```
```html
<div class="container"></div>
```

## Documentation

### API
GetGists provides a high-level method to directly embed Gists into your web page, as well as a low-level method that returns the gists as a JavaScript array, according to the [Github Gist API](http://developer.github.com/v3/gists/).

* `$.fn.getGists( options )`
  Receives a list of Gists by a Github user and embeds them into the page.

  If called on a jQuery object (e.g. `$('.container').getGists()`), Gists are received and embedded into each of the selected elements.

  If called on the prototype (e.g. `$.fn.getGists()`), the Gists are only received and can be further processed by the `success` callback.
  * `options`: An object literal which defines the settings to use
    * `count`: Limits the amount of Gists to be embedded; defaults to `10`
    * `keyword`: Only embeds Gists that contain this string in their description _(optional)_
    * `language`: Only embeds Gists that contain at least one file of this programming language _(optional)_
    * `outputElem`: The HTML element to wrap every class in; can be either `'div'` or `'li'`, defaults to `'div'`
    * `outputClass`: A class name, or multiple class names seperated by a space, that are given to the wrapper element _(optional)_
    * `success`: `function ( data )`, a callback function that is called upon successful retrieval of the Gists _(optional)_
      * `data`: An array of Gist meta data for further processing
    * `user`: The user name of the Github user

### Defaults
The default values for both methods are as follows and can be overwritten.
```javascript
/* Defaults */

$.fn.getGists.defaults = {
  count: 10,
  outputElem: 'div'
};
```

## Examples

* Embed a maximum of 5 JavaScript Gists as `<div>` elements:
```javascript
$('.container').getGists({
user: 'tvooo',
language: 'javascript',
outputElem: 'li'
});
```

* Print out a description list of all Gists:
```javascript
$.fn.getGists({
  user: 'tvooo',
  success: function (data) {
    data.forEach(function (item) {
      var li = $('<li>').text(item.description);
      $('ul').append(li);
    });
  }
});
```

## Tests
This library uses QUnit for unit testing. AJAX responses are mocked using jQuery Mockjax.

## Release History
_(Nothing yet)_

## License
Copyright (c) 2012 Tim von Oldenburg
Licensed under the MIT license.