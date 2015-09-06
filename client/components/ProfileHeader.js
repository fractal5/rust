var React = require('react');

var ProfileHeader = React.createClass({
  propTypes: {
    displayName: React.PropTypes.string.isRequired,
    numComments: React.PropTypes.number.isRequired
  },

  render: function() {
    return (
      <div className="row">
        <p>{this.props.displayName}</p>
        <p>Total Comments: {this.props.numComments}</p>
      </div>
    );
  }
});

module.exports = ProfileHeader;