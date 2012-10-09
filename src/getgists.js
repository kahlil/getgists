/*! jQuery GetGists Plugin - v0.1.0 - 2012-10-08
* https://github.com/tvooo/getgists
* Copyright (c) 2012 Tim von Oldenburg; Licensed MIT */

/*jslint evil: true */

(function( $ ) {
    'use strict';

    /* Helper functions */

    var console = window.console;

    // Overwrite document.write
    document._write = document.write;
    document.write = function( str ){
        if ( str.indexOf( '<div id=\"gist-' ) !== 0 ) {
                if( str.indexOf('https://gist.github.com/stylesheets/gist/embed.css') === -1 ) {
                        // if you got this far it's not a github document.write call
                        document._write(str);
                }
                return;
        }
        var id     = /<div id=\"gist-(\d+)/.exec( str )[ 1 ];
        var script = document.querySelector( 'script[src="https://gist.github.com/' + id + '.js"]' );
        var div    = document.createElement( 'div' );
        div.innerHTML = str;
        script.parentNode.innerHTML = str;
    };

    var insertGistCSS = function() {
        if ( !$('link[href="https://gist.github.com/stylesheets/gist/embed.css"]').length ) {
            $('<link>').attr( {
                rel: 'stylesheet',
                href: 'https://gist.github.com/stylesheets/gist/embed.css'
            } ).appendTo( $('head') );
        }
    };

    // Fetch list of Gists
    var fetchGists = function( opts, success ) {
        var path = '';
        if ( opts.user ) {
            path = '/users/' + opts.user + '/gists';
        } else {
            $.error('No user name provided.');
        }
        $.ajax({
            method: 'get',
            dataType: 'json',
            url: 'https://api.github.com' + path,
            success: function( data, textStatus, jqXHR ) {
                success( $.grep(data, function( elementOfArray, indexInArray ) {
                    return filter( elementOfArray, opts );
                }).slice(0, opts.count) );
            },
            error: function( jqXHR, textStatus, errorThrown ) {
                return errorThrown;
            }
        });
    };

    // Fetch single Gist
    var fetchGist = function( options ) {
        $.error( 'Not yet implemented' );
    };

    var filter = function( element, opts ) {
        if ( opts.language !== undefined && typeof opts.language === 'string' && opts.language.length ) {
            var add = false;
            for ( var file in element.files ) {
                if ( element.files[ file ].language && element.files[ file ].language.toLowerCase() === opts.language.toLowerCase() ) {
                    add = true;
                }
            }
            if ( !add ) { return false; }
        }
        // Filter by keyword in description (most simple)
        if ( opts.keyword !== undefined && typeof opts.keyword === 'string' && opts.keyword.length ) {
            if ( element.description.toLowerCase().indexOf( opts.keyword.toLowerCase() ) === -1 ) {
                return false;
            }
        }
        return true;
    };

    /* Plugin Methods */

    $.fn.getGists = function( method ) {
        if ( this instanceof $ ) {
            if ( collectionMethods[ method ] ) {
                return collectionMethods[ method ].apply( this, Array.prototype.slice.call( arguments, 1 ) );
            } else if ( typeof method === 'object' || ! method ) {
                return collectionMethods.embed.apply( this, arguments );
            } else {
                $.error( 'Method ' +  method + ' does not exist on jQuery.fn.getGists' );
            }
        } else {
            if ( staticMethods[ method ] ) {
                return staticMethods[ method ].apply( this, Array.prototype.slice.call( arguments, 1 ) );
            } else if ( typeof method === 'object' || ! method ) {
                return staticMethods.list.apply( this, arguments );
            } else {
                $.error( 'Method ' +  method + ' does not exist on jQuery.fn.getGists' );
            }
        }
    };

    /* Actual method implementations, not exposed to jQuery */

    var staticMethods = {
        list: function( opts ) {
            var settings = $.extend( {}, $.fn.getGists.defaults, opts );
            fetchGists(settings, function( data ) {
                if ( settings.success ) {
                        settings.success( data );
                    } else {
                        $.error( '$.getGists( options ) requires a "success" callback' );
                    }
            });
            return $;
        }
    };

    var collectionMethods = {
        embed: function( opts ) {
            var settings = $.extend( {}, $.fn.getGists.defaults, opts );
            insertGistCSS();
            return this.each(function() {
                fetchGists(settings, $.proxy (function (list, container) {
                    list.forEach( $.proxy(function (el) {
                        var script = document.createElement( 'script' );
                        script.type = 'text/javascript';
                        script.src = 'https://gist.github.com/' + el.id + '.js';
                        var elem = (settings.outputElem === 'li') ? $('<li>') : $('<div>');
                        if ( settings.outputClass ) {
                            elem.addClass( settings.outputClass );
                        }
                        elem.get( 0 ).appendChild( script );
                        this.appendChild( elem.get( 0 ) );
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

}( jQuery ));
