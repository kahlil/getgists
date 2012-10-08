/*
 * getgists
 * https://github.com/tvooo/getgists
 *
 * Copyright (c) 2012 Tim von Oldenburg
 * Licensed under the MIT license.
 */

/*jslint evil: true */

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
    script.parentNode.innerHTML = str;
    //script.parentNode.insertBefore(div, script.nextElementSibling);
  };

  var insertGistCSS = function () {
    if($('link[href="https://gist.github.com/stylesheets/gist/embed.css"]').length === 0) {
      $('<link>').attr({ rel: 'stylesheet', href: 'https://gist.github.com/stylesheets/gist/embed.css'} ).appendTo($('head'));
    }
  };

  // Fetch list of Gists
  var fetchGists = function(opts, success) {
    var path = '';
    if(opts.user !== '') {
      path = '/users/' + opts.user + '/gists';
    }
    $.ajax({
      method: 'get',
      dataType: 'json',
      url: 'https://api.github.com' + path,
      success: function (data, textStatus, jqXHR) {
        success(filter(data, opts));
      },
      error: function (jqXHR, textStatus, errorThrown) {
        return errorThrown;
      }
    });
  };

  // Fetch single Gist
  var fetchGist = function(options) {
    throw "Not yet implemented";
  };

  // Filter list of Gists according to language, a keyword, and max count
  var filter = function(list, options) {
    var temp   = [];
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

  /* Plugin Methods */

  // Static methods
  $.getGists = function(method) {
    if ( staticMethods[method] ) {
      return staticMethods[ method ].apply( this, Array.prototype.slice.call( arguments, 1 ));
    } else if ( typeof method === 'object' || ! method ) {
      return staticMethods.list.apply( this, arguments );
    } else {
      $.error( 'Method ' +  method + ' does not exist on jQuery.gist' );
    }
  };

  // Collection methods
  $.fn.getGists = function(method) {
    // Method calling logic
    if ( collectionMethods[method] ) {
      return collectionMethods[ method ].apply( this, Array.prototype.slice.call( arguments, 1 ));
    } else if ( typeof method === 'object' || ! method ) {
      return collectionMethods.embed.apply( this, arguments );
    } else {
      $.error( 'Method ' +  method + ' does not exist on jQuery.fn.gist' );
    }
  };

  /* Actual method implementations, not exposed to jQuery */

  var staticMethods = {
    list: function(opts) {
      var settings = $.extend({}, $.getGists.defaults, opts);
      fetchGists(settings, function (data) {
        if(settings.success) {
            settings.success(data);
          }
      });
      return $;
    }
  };

  var collectionMethods = {
    embed: function (opts) {
      var settings = $.extend( {}, $.fn.getGists.defaults, opts);
      insertGistCSS();
      return this.each(function() {
        fetchGists(settings, $.proxy (function (list, container) {
          list.forEach($.proxy(function (el) {
            var script = document.createElement( 'script' );
            script.type = 'text/javascript';
            script.src = 'https://gist.github.com/' + el.id + '.js';
            var elem = (settings.outputElem === 'li') ? $('<li>') : $('<div>');
            if(settings.outputClass) {
              elem.addClass(settings.outputClass);
            }
            elem.get(0).appendChild(script);
            this.appendChild(elem.get(0));
          }, this));
          if(settings.success) {
            settings.success();
          }
        }, this));
      });
    }
  };

  /* Defaults */
  
  $.fn.getGists.defaults = {
    count: 10,
    outputElem: 'div'
  };

  $.getGists.defaults = {
    count: 10
  };

}(jQuery));
