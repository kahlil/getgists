/*
 * gist
 * https://github.com/tim/gist
 *
 * Copyright (c) 2012 Tim von Oldenburg
 * Licensed under the MIT license.
 */

// https://api.github.com

(function($) {
  "use strict";

  /* Helper functions */

  var console = window.console;
  
  document._write = document.write;
  document.write = function(str){
    if (str.indexOf('<div id=\"gist-') !== 0) {
        if(str.indexOf('https://gist.github.com/stylesheets/gist/embed.css') === -1) {
            // if you got this far it's not a github document.write call
            document._write(str);
        }
        return;
    }
    var id = /<div id=\"gist-(\d+)/.exec(str)[1];
    var script = document.querySelector('script[src="https://gist.github.com/' + id + '.js"]');
    var div = document.createElement('div');
    div.innerHTML = str;
    script.parentNode.insertBefore(div, script.nextElementSibling);
  };

  var insertGistCSS = function () {
    if($('link[href="https://gist.github.com/stylesheets/gist/embed.css"]').length === 0) {
      $('<link>').attr({ rel: 'stylesheet', href: 'https://gist.github.com/stylesheets/gist/embed.css'} ).appendTo($('head'));
    }
  };

  // Embed method.
  $.fn.gist = function(settings) {
    insertGistCSS();
    return this.each(function() {
      fetchGists(settings, $.proxy (function (list, container) {
        list.forEach($.proxy(function (el) {
          var script = document.createElement( 'script' );
          script.type = 'text/javascript';
          script.src = 'https://gist.github.com/' + el.id + '.js';
          this.appendChild(script);
        }, this));
      }, this));
    });
  };



// Embed code
// <script src="https://gist.github.com/795257.js?file=README.txt"></script>

  // Fetch list of Gists
  var fetchGists = function(options, success) {
    var path = '/gists/public';
    if(options.user !== '') {
      path = '/users/' + options.user + '/gists';
    }
    // nur ein gist?
    /*if(options.number) {
      path = '/gists/' + options.number;
    }*/
    $.ajax({
      method: 'get',
      dataType: 'json',
      /*headers: {
        //'Access-Control-Request-Headers': 'Origin, Host',
        'Origin': 'http://localhost',
        'Host': 'http://localhost'
        //'Cache-Control': 'max-age=20'
      },*/
      url: 'https://api.github.com' + path,
      success: function (data, textStatus, jqXHR) {
        success(filter(data, options));
      },
      error: function (jqXHR, textStatus, errorThrown) {
        return errorThrown;
      }
    });
  };

  // Fetch single Gist
  var fetchGist = function(options) {

  };

  var filter = function(list, options) {
    var temp   = [],
        result = [];
    for(var i = 0, len = list.length, el = list[0]; i < len; el = list[i], i++) {
      
      // Filter by language
      if(options.language && typeof options.language === "string" && options.language.length > 0) {
        var add = false;
        for(var f in el.files) {
          if(el.files[f].language && el.files[f].language.toLowerCase() === options.language.toLowerCase()) {
            add = true;
          }
        }
        if(!add) { continue; }
      }
      // Filter by keyword in description (most simple)
      if(options.keyword && typeof options.keyword === "string" && options.keyword.length > 0) {
        if(el.description.toLowerCase().indexOf(options.keyword.toLowerCase()) === -1) {
          continue;
        }
      }
      // Max count
      if(options.count && typeof options.count === "number" && !isNaN(options.count)) {
        if(temp.length >= options.count) {
          continue;
        }
      }
      temp.push(el);
    }
    return temp;
  };

  // Static method
  $.gist = function(method) {
    // Method calling logic
    if ( staticMethods[method] ) {
      return staticMethods[ method ].apply( this, Array.prototype.slice.call( arguments, 1 ));
    } else if ( typeof method === 'object' || ! method ) {
      return staticMethods.list.apply( this, arguments );
    } else {
      $.error( 'Method ' +  method + ' does not exist on jQuery.gist' );
    }
  };

  // Collection method
  $.fn.gist = function(method) {
    // Method calling logic
    if ( collectionMethods[method] ) {
      return collectionMethods[ method ].apply( this, Array.prototype.slice.call( arguments, 1 ));
    } else if ( typeof method === 'object' || ! method ) {
      return collectionMethods.embed.apply( this, arguments );
    } else {
      $.error( 'Method ' +  method + ' does not exist on jQuery.fn.gist' );
    }
  };

  var staticMethods = {
    list: function( options ) {
      var settings = $.extend( {
        'user'    : '',
        'count'   : 20
        //'keyword' : '',
        //'language': ''
      }, options);
      fetchGists(settings);
      return $;
    },
    embed: function( options ) {
      var settings = $.extend( {
        'gist' : ''
      }, options);
      // gist? file?
      if(settings.gist !== '') {
        if(typeof settings.gist === "string") {
          var n = parseInt(settings.gist, 10);
          if(isNaN(n)) {
            // Assume it is URL
            //fetchGists($.extend({number:}));
          } else {
            // Assume it is gist number (string)
          }
        } else if(typeof settings.gist === "number") {
          // Assume it is gist number (object)

        } else {
          // Assume it is gist object
        }
      }
      fetchGists(settings);
      return 'awesome';
    }
  };

  var collectionMethods = {
    embed: function (options) {
      var settings = $.extend( {
      }, options);
      insertGistCSS();
      return this.each(function() {
        fetchGists(settings, $.proxy (function (list, container) {
          list.forEach($.proxy(function (el) {
            var script = document.createElement( 'script' );
            script.type = 'text/javascript';
            script.src = 'https://gist.github.com/' + el.id + '.js';
            this.appendChild(script);
          }, this));
        }, this));
      });
    }
  };

}(jQuery));
