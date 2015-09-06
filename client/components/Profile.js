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
      comments: [],
      numComments: 0,
      oldestLoadedCommentId: -1
    }
  },

  // Returns comments ordered from newer to older.
  // TODO: refactor to use to load additional comments too.
  init: function() {
    $.ajax({
      url: window.location.origin + '/api/comments/get/user',
      // data: {maxCommentId: this.state.maxCommentId},
      method: 'GET',
      dataType: 'json',
      success: function(data) {
        console.log('Profile init: successfully loaded user comments');
        console.log(data);

        var oldestLoadedCommentId = data.comments[data.comments.length - 1].id;
        this.setState({
          comments: data.comments,
          numComments: data.numComments,
          oldestLoadedCommentId: oldestLoadedCommentId
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
        <ProfileHeader displayName={this.state.comments[0].User.name} numComments={this.state.numComments}/>
        <div className="row">
          <div className="col-md-4">
            <h2>Analytics</h2>
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