/*! jQuery GetGists Plugin - v0.1.0 - 2012-10-08
* https://github.com/tvooo/getgists
* Copyright (c) 2012 Tim von Oldenburg; Licensed MIT */

/*jslint evil: true */

(function( $, window, document, undefined ) {
    'use strict';

    var pluginName = 'getGists';

    /* Helper functions */

    /* Wrap document.write for including Gists via <script> */
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

    function Plugin( element, options ) {
        this.element = element;
        this.options = $.extend( {}, $.fn[pluginName].defaults, options );

        this._defaults = $.fn[pluginName].defaults;
        this._name = pluginName;
    }

    Plugin.prototype = {

        insertGistCSS: function() {
            if ( !$('link[href="https://gist.github.com/stylesheets/gist/embed.css"]').length ) {
                $('<link>').attr( {
                    rel: 'stylesheet',
                    href: 'https://gist.github.com/stylesheets/gist/embed.css'
                } ).appendTo( $('head') );
            }
        },

        fetchGists: function( options, success ) {
            var path = '';
            if ( options.user ) {
                path = '/users/' + options.user + '/gists';
            } else {
                $.error('No user name provided.');
            }
            $.ajax({
                method: 'get',
                dataType: 'json',
                url: 'https://api.github.com' + path,
                success: $.proxy(function( data, textStatus, jqXHR ) {
                    var filteredData =
                        $.grep(data, $.proxy(function( elementOfArray, indexInArray ) {
                            return this.filter( options, elementOfArray );
                        }, this ));
                    var slicedData = filteredData.slice(0, options.count);
                    success( slicedData );
                }, this ),
                error: function( jqXHR, textStatus, errorThrown ) {
                    return errorThrown;
                }
            });
        },

        fetchGist: function() {
            $.error( 'Not yet implemented' );
        },

        filter: function( options, element ) {
            if ( options.language !== undefined && typeof options.language === 'string' && options.language.length ) {
                var add = false;
                for ( var file in element.files ) {
                    if ( element.files[ file ].language && element.files[ file ].language.toLowerCase() === options.language.toLowerCase() ) {
                        add = true;
                    }
                }
                if ( !add ) { return false; }
            }
            // Filter by keyword in description (most simple)
            if ( options.keyword !== undefined && typeof options.keyword === 'string' && options.keyword.length ) {
                if ( element.description.toLowerCase().indexOf( options.keyword.toLowerCase() ) === -1 ) {
                    return false;
                }
            }
            return true;
        },

        list: function( options ) {
            this.fetchGists( options, $.proxy( function( data ) {
                if ( options.success ) {
                    options.success( data );
                }
            }, this));
            return $;
        },

        embed: function( ) {
            this.insertGistCSS();
            this.fetchGists( this.options, $.proxy( function (list ) {
                list.forEach( $.proxy( function (el) {
                    var script = document.createElement( 'script' );
                    script.type = 'text/javascript';
                    script.src = 'https://gist.github.com/' + el.id + '.js';
                    var elem = (this.options.outputElem === 'li') ? $('<li>') : $('<div>');
                    if ( this.options.outputClass ) {
                        elem.addClass( this.options.outputClass );
                    }
                    elem.get( 0 ).appendChild( script );
                    this.element.appendChild( elem.get( 0 ) );
                }, this));
                if(this.options.success) {
                    this.options.success();
                }
            }, this));
            return this;
        }
    };

    $.fn[pluginName] = function ( options ) {
        if ( this instanceof $ ) {
            /* Executed on a jQuery object */
            return this.each(function () {
                if (!$.data(this, 'plugin_' + pluginName)) {
                    $.data(this, 'plugin_' + pluginName,
                    (new Plugin( this, options )).embed());
                }
            });
        } else {
            /* Not executed on a jQuery object */
            Plugin.prototype.list( $.extend( {}, $.fn[pluginName].defaults, options ) );
        }
    };

    /* Defaults */
    $.fn[pluginName].defaults = {
        count: 10,
        outputElem: 'div',
        success: function() {}
    };

}( jQuery, window, document ));
