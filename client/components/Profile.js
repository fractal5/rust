var React = require('react');
var ProfileHeader = require('./ProfileHeader');
var Comment = require('./Comment');

// At the moment, Profile will only be used to display your personal
// profile, not that of others.
// 
// Load all the comments for this user into this.state.comments
// Need to store maxCommentId ... last comment in array id
// comments[length - 1].id
// 
var Profile = React.createClass({
  getInitialState: function() {
    return {
      displayName: '',
      comments: [],
      numComments: 0,
      // API expects string 'undefined' on first load
      oldestLoadedCommentId: 'undefined',
      currentTime: undefined
    }
  },

  // Returns comments ordered from newer to older.
  // TODO: refactor to use to load additional comments too.
  init: function() {
    $.ajax({
      url: window.location.origin + '/api/comments/get/user',
      data: {oldestLoadedCommentId: this.state.oldestLoadedCommentId},
      method: 'GET',
      dataType: 'json',
      success: function(data) {
        console.log('Profile init: successfully loaded user comments');
        console.log(data);

        // XXX EE: what's the right thing to store here?
        // For now, if no comments returned, keep it the same as it was.
        var oldestLoadedCommentId = data.comments.length > 0 ?
          data.comments[data.comments.length - 1].id : oldestLoadedCommentId;
        this.setState({
          displayName: data.displayName,
          comments: data.comments,
          numComments: data.numComments,
          oldestLoadedCommentId: oldestLoadedCommentId,
          currentTime: data.currentTime
        });
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(xhr, status, err.message);
      }
    });
  },

  componentDidMount: function() {
    this.init();
  },

  render: function() {
    var comments = this.state.comments.map(function(comment) {
      return <Comment key={comment.id} comment={comment} />;
    });

    return (
      <div>
        <div className="row">
          <div className="col-md-4">
            <h2>{this.state.displayName}</h2>
            <p>Total Comments: {this.state.numComments}</p>
          </div>
          <div className="col-md-8">
            {comments}
          </div>
        </div>
      </div>
    );
  }
});

module.exports = Profile;