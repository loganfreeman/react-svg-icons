var React = require('react');
var getSvgBody = require('./svg-body');
var inlineSvg = require('./inline-svg');
var assign = require('react/lib/Object.assign');

var assets = inlineSvg(ASSET_PATH); // asset path will be inlined
var icons = {};

var Icon = React.createClass({
  displayName: 'Icon',

  propTypes: {
    name: React.PropTypes.string.isRequired,
    width: React.PropTypes.number,
    height: React.PropTypes.number,
    color: React.PropTypes.string
  },

  getDefaultProps: function() {
    return {
      width: 16,
      height: 16,
      color: '#000'
    };
  },

  render: function() {
    var icon = resolveIcon(this.props.name);

    if (!icon) {
      return React.createElement('div', {style: {color: '#c1272a'}},
        'Could not find icon called "'+this.props.name+'"'
      );
    }

    var style = assign({ verticalAlign: 'middle' },
      this.props.style
    );

    return React.createElement('svg', {
      viewBox: icon.viewBox,
      preserveAspectRatio: 'xMidYMid meet',  // preserve aspect ratio and center
      width: this.props.width,
      height: this.props.height,
      style: style,
      fill: this.props.color,
      dangerouslySetInnerHTML: { __html:
        icon.body
          .replace(/(stroke)="([^"]+)"/gi, replaceColor(this.props.color))
          .replace(/(fill)="([^"]+)"/gi, replaceColor(this.props.color))
      }
    });
  }
});

// TODO: do this as a pre-process step
function resolveIcon(name) {
  var svgString;

  if (icons[name]) return icons[name];
  if ( !(svgString = assets[name]) ) return null;

  icons[name] = {
    body: getSvgBody(svgString),
    viewBox: (svgString.match(/viewBox=['"]([^'"]*)['"]/) || [])[1]
  };

  return icons[name];
}

function replaceColor(color) {
  return function(_, type, prevColor) {
    return (prevColor === 'none')
      ? type+'="none"'
      : type+'="'+color+'"';
  };
}

module.exports = Icon;