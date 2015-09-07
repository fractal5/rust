var Comment = require('../').Comment;
var User = require('../').User;
var Heart = require('../').Heart;
var Flag = require('../').Flag;
var Url = require('../').Url;

// @param getTotalCount: undefined if the total count of these
// comment types is not needed.
var get = function(searchObject, lastCommentId, getTotalCount) {
  console.log('line 8 comment cotrl',searchObject);
  var attributes = ['text', 'User.name', 'RepliesTo']; 
  var queryObject = {
    where: searchObject,
    include: [{
        model: User,
        attributes: ['name']
      }, {
        model: Heart,
        attributes: ['id']
      }, {
        model: Flag,
        attributes: ['id']
      }, {
        model: Url,
        attributes: ['url']
      }]
    };

  if (!(lastCommentId === 'undefined' || lastCommentId === undefined)) {
    console.log('Comments get: lastCommentId not undefined, is ' + lastCommentId);
    queryObject.where.id = {};
    queryObject.where.id.$lt = lastCommentId;
  } 

  // limit the number of comments we send to the user
  queryObject.limit = 25;

  // return in ascending order of commentid
  queryObject.order = [['id', 'DESC']];
  console.log('query', queryObject);
  
  return Comment.findAndCountAll(queryObject)
    .then(function(results) {
      // Iterate over our results array and update the number of hearts and favorites so
      // we don't return the ENTIRE array.
      var resultRows = results.rows;
      resultRows.forEach(function(element, index, array) {
        resultRows[index].dataValues.Hearts = resultRows[index].dataValues.Hearts.length;
        resultRows[index].dataValues.Flags = resultRows[index].dataValues.Flags.length;
      });

      // If we don't require the count value, return the rows only
      console.log("Commments get: total count " + results.count);
      if (!getTotalCount) {
        return results.rows;
      } else {
        return results;
      }
    })
    .catch(function(err) {
      console.log("Err getting comments: ", err);
    });
};

// takes an object with the following format
var post = function(commentObject) {
  var newComment = Comment.build(commentObject);
  if (newComment.repliesToId === undefined){
    newComment.repliesToId = null;
  }
  return newComment.save()
    .then(function(comment) {
      return comment;
    })
    .catch(function(err) {
      console.log('this is the error', err);
      throw err;
    });
};

// will throw error if no id provided
var put = function(commentid, updatesObject) {
  return Comment.update(updatesObject, {
      where: {
        id: commentid
      }
    })
    .then(function() {
      return true;
    })
    .catch(function(error) {
      throw error;
    });
};

var remove = function(commentId) {
  return Comment.destroy({
      where: {
        id: commentId
      }
    })
    .then(function(affectedRows) {
      if (affectedRows === 0) {
        throw new Error('User not found - delete failed');
      } else if (affectedRows > 1) {
        throw new Error('deleted multiple users');
      } else {
        return true;
      }
    })
    .catch(function(error) {
      throw error;
    });
};


exports.get = get;
exports.post = post;
exports.put = put;
exports.remove = remove;