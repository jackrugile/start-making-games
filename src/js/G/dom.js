/*==============================================================================

DOM / CSS

==============================================================================*/

G.prototype.qS = function( q ) {
	var query = document.querySelectorAll( q );
	if( query.length > 1 ) {
		return query;
	} else {
		return query[ 0 ];
	}
};

G.prototype.cE = function( appendParent, classes ) {
	var elem = document.createElement( 'div' );
	if( appendParent ) {
		appendParent.appendChild( elem );
	}
	if( classes ) {
		this.addClass( elem, classes );
	}
	return elem;
};

G.prototype.text = function( elem, content ) {
	elem.firstChild.nodeValue = content;
};

G.prototype.resetAnim = function( elem ) {
	this.removeClass( elem, 'anim' );
	elem.offsetWidth = elem.offsetWidth;
	this.addClass( elem, 'anim' );
};

// credit: Julian Shapiro - http://julian.com/research/velocity/
//G.prototype.prefixElement = G.cE();
G.prototype.prefixMatches = {};
G.prototype.prefixCheck = function (property) {
	if( !this.prefixElement ) {
		this.prefixElement = this.cE();
	}
	if (this.prefixMatches[property]) {
		return [ this.prefixMatches[property], true ];
	} else {
		var vendors = [ "", "Webkit", "Moz", "ms", "O" ],
			cb = function(match) { return match.toUpperCase(); };
		for (var i = 0, vendorsLength = vendors.length; i < vendorsLength; i++) {
			var propertyPrefixed;
			if (i === 0) {
				propertyPrefixed = property;
			} else {
				propertyPrefixed = vendors[i] + property.replace(/^\w/, cb);
			}
			if (this.isString(this.prefixElement.style[propertyPrefixed])) {
				this.prefixMatches[property] = propertyPrefixed;
				return [ propertyPrefixed, true ];
			}
		}
		return [ property, false ];
	}
};

G.prototype.css = function( elem, prop, val ) {
	if( this.isObject( prop ) ) {
		var cssProps = prop;
		for( prop in cssProps ) {
			if( cssProps.hasOwnProperty( prop ) ) {
				this.css( elem, prop, cssProps[ prop ] );
			}
		}
	} else {
		prop = this.prefixCheck( prop );
		if( prop[ 1 ] ) {
			elem.style[ prop[ 0 ] ] = val;
		}
	}
};

// credit: Todd Motto - https://github.com/toddmotto/apollo
G.prototype.hasClass = function ( elem, className ) {
	if( className ) {
		return elem.classList.contains( className );
	}
};

G.prototype.addClass = function ( elem, className ) {
	if( className.length ) {
		if( className.indexOf( ' ' ) != -1 ) {
			classes = className.split( ' ' );
			classes.forEach( function( className ) {
				if( !G.hasClass( elem, className ) ) {
					G.addClass( elem, className );
				}
			});
		} else {
			elem.classList.add( className );
		}
	}
};

G.prototype.removeClass = function ( elem, className ) {
	if( className.indexOf( ' ' ) != -1 ) {
		classes = className.split( ' ' );
		classes.forEach( function( className ) {
			if( this.hasClass( elem, className ) ) {
				this.removeClass( elem, className );
			}
		});
	} else {
		elem.classList.remove( className );
	}
};

G.prototype.attr = function( elem, attr, val ) {
	if( val ) {
		elem.setAttribute( attr, val );
		return val;
	} else {
		return elem.getAttribute( attr );
	}
};