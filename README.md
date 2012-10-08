# jQuery GetGists Plugin

A simple jQuery plugin to access the Gist repository of a Github user.

## Getting Started
In your web page:

```html
<script src="jquery.js"></script>
<script src="dist/jquery.getgists.min.js"></script>
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
GetGists provides a high-level method to directly embed Gists into your web page.

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
$.getGists({
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