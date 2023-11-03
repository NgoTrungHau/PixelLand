const ApiError = require('../api-error');
const Post = require('../models/Post');
const Comment = require('../models/Comment');
const cloudinary = require('../utils/cloudinary');

exports.createPost = async (req, res, next) => {
  try {
    if (!req.body.content && !req.file) {
      return next(new ApiError(400, 'Either content or media is required.'));
    }

    // upload image to cloudinary
    let result;
    if (req.file) {
      result = await new Promise((resolve, reject) => {
        const streamLoad = cloudinary.uploader.upload_chunked_stream(
          { resource_type: req.body.mediaType, folder: 'posts' },
          function (error, result) {
            if (result) {
              resolve(result);
            } else {
              reject(error);
            }
          },
        );
        streamLoad.end(req.file.buffer);
      });
    }

    const post = new Post({
      user: req.user.id,
      privacy: req.body.privacy,
      content: req.body.content,
      media: result
        ? {
            mediaType: req.body.mediaType, //either 'image' or 'video'
            public_id: result.public_id,
            url: result.url,
          }
        : null,
    });
    const createPost = await post.save();

    res.json({
      ...createPost._doc,
      user: {
        _id: req.user._id,
        username: req.user.username,
        avatar: req.user.avatar,
      },
    });
  } catch (error) {
    return next(new ApiError(500, 'An error occurred while creating the post'));
  }
};

exports.getPosts = async (req, res, next) => {
  try {
    const { start, newPostOffset, limit = 4 } = req.query;
    const allPosts = await Post.find()
      .sort({ createdAt: -1 })
      .skip(Number(start) * Number(limit) + Number(newPostOffset))
      .limit(Number(limit))
      .populate('user', 'username avatar');
    const data = allPosts.map((post) => post.toObject()); // convert all posts to JavaScript objects

    const modifiedPosts = await Promise.all(
      data.map(async (post) => {
        if (post.comments.length > 0) {
          const lastComment = await Comment.findById(
            post.comments.slice(-1)[0],
          ).populate('commentedBy', 'username avatar');
          post.comments = post.comments.map((comment) => comment.toString());
          post.comments[post.comments.length - 1] = lastComment;
        }
        return post;
      }),
    );

    // Filter out posts with varied privacy settings except the ones from the request user
    const posts = modifiedPosts.filter((post) => {
      const userIsAuthor = post.user._id.toString() === req.user._id.toString();
      if (userIsAuthor) return true;

      switch (post.privacy) {
        case 'Public':
          return true;
        case 'Only me':
          return false;
        // case 'Followers only':
        //     // You'll replace `checkIfUserIsFollower` function with real implementation
        //     return checkIfUserIsFollower(post.user._id, req.user._id);
        // case 'Members only':
        //     // You'll replace `checkIfUserIsMember` function with real implementation
        //     return checkIfUserIsMember(post.user._id, req.user._id);
        default:
          return false;
      }
    });

    // Update liked status for posts and comments
    posts.forEach((post) => {
      post.liked = post.likes.includes(req.user._id.toString());
      if (post.comments.length > 0) {
        post.comments[post.comments.length - 1]._doc.liked = post.comments[
          post.comments.length - 1
        ].likedBy.includes(req.user._id.toString());
      }
    });

    res.json(posts);
  } catch (error) {
    console.error(error); // Log the error to console for debugging
    return next(new ApiError(500, 'An error occurred while retrieving posts'));
  }
};
exports.getUserPosts = async (req, res, next) => {
  try {
    const { start, newPostOffset, limit = 4 } = req.query;
    const allPosts = await Post.find({ user: req.params.id })
      .sort({ createdAt: -1 })
      .skip(Number(start) * Number(limit) + Number(newPostOffset))
      .limit(Number(limit))
      .populate('user', 'username avatar');
    const data = allPosts.map((post) => post.toObject()); // convert all posts to JavaScript objects

    const modifiedPosts = await Promise.all(
      data.map(async (post) => {
        if (post.comments.length > 0) {
          const lastComment = await Comment.findById(
            post.comments.slice(-1)[0],
          ).populate('commentedBy', 'username avatar');
          post.comments = post.comments.map((comment) => comment.toString());
          post.comments[post.comments.length - 1] = lastComment;
        }
        return post;
      }),
    );

    // Filter out posts with varied privacy settings except the ones from the request user
    const posts = modifiedPosts.filter((post) => {
      const userIsAuthor = post.user._id.toString() === req.user._id.toString();
      if (userIsAuthor) return true;

      switch (post.privacy) {
        case 'Public':
          return true;
        case 'Only me':
          return false;
        // case 'Followers only':
        //     // You'll replace `checkIfUserIsFollower` function with real implementation
        //     return checkIfUserIsFollower(post.user._id, req.user._id);
        // case 'Members only':
        //     // You'll replace `checkIfUserIsMember` function with real implementation
        //     return checkIfUserIsMember(post.user._id, req.user._id);
        default:
          return false;
      }
    });

    // Update liked status for posts and comments
    posts.forEach((post) => {
      post.liked = post.likes.includes(req.user._id.toString());
      if (post.comments.length > 0) {
        post.comments[post.comments.length - 1]._doc.liked = post.comments[
          post.comments.length - 1
        ].likedBy.includes(req.user._id.toString());
      }
    });

    res.json(posts);
  } catch (error) {
    console.error(error); // Log the error to console for debugging
    return next(new ApiError(500, 'An error occurred while retrieving posts'));
  }
};

exports.findOne = async (req, res, next) => {
  try {
    const posts = await Post.find({ $nor: [{ privacy: 'Only me' }] })
      .sort({ createdAt: -1 })
      .populate('user', 'username avatar');
    if (!posts) {
      return next(new ApiError(404, 'Post not found'));
    }
    posts.map((post) => {
      if (post.likes.includes(req.user._id.toString())) {
        post._doc.liked = true;
      }
    });
    return res.json(posts);
  } catch (error) {
    return next(
      new ApiError(500, `Error retrieving post with id=${req.params.id}`),
    );
  }
};

// Update post
exports.update = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return next(new ApiError(401, 'Post not found'));
    }
    if (!req.body.media && post.media.url) {
      await cloudinary.uploader.destroy(post.media.public_id, {
        folder: 'posts',
      });
      post.media = null;
    }
    if (req.file) {
      // Delete the old post and upload the new post
      if (post.media.url) {
        await cloudinary.uploader.destroy(post.media.public_id, {
          folder: 'posts',
        });
      }
      const result = await new Promise((resolve, reject) => {
        const streamLoad = cloudinary.uploader.upload_chunked_stream(
          { resource_type: req.body.mediaType, folder: 'posts' },
          function (error, result) {
            if (result) {
              resolve(result);
            } else {
              reject(error);
            }
          },
        );
        streamLoad.end(req.file.buffer);
      });
      post.media = {
        mediaType: req.body.mediaType,
        public_id: result.public_id,
        url: result.url,
      };
    }

    // save post

    post.content = req.body.content;
    post.privacy = req.body.privacy;

    let savedPost = await post.save();
    savedPost = await savedPost.populate('user', 'username avatar');
    res.send(savedPost);
  } catch (error) {
    return next(
      new ApiError(500, `Error updating post with id=${req.params.id}`),
    );
  }
};

exports.delete = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return next(new ApiError(401, 'Post not found'));
    }

    if (post.media.public_id) {
      await cloudinary.uploader.destroy(post.media.public_id, {
        folder: 'posts',
      });
    }

    const deletePost = await post.remove();
    res.json(deletePost.id);
    if (post.comments > 0) {
      deleteAllComments(post._id, 'post');
    }
  } catch (error) {
    return next(
      new ApiError(500, `Error updating post with id=${req.params.id}`),
    );
  }
};
exports.deleteAll = async (req, res, next) => {
  try {
    const deleteAllPosts = await Post.deleteMany({});
    res.json(deleteAllPosts);
  } catch (error) {
    return next(new ApiError(500, `Error deleting all user `));
  }
};
// Like post
exports.likePost = async (req, res, next) => {
  try {
    const like = await Post.findByIdAndUpdate(
      { _id: req.params.id },
      {
        $addToSet: { likes: req.user._id },
      },
      { new: true },
    );

    if (!like)
      return res.status(400).json({ error: 'This post does not exist.' });
    return res.status(200).send(like);
  } catch (error) {
    return next(
      new ApiError(500, `Error retrieving post with id=${req.params.id}`),
    );
  }
};

// Unlike post
exports.unlikePost = async (req, res, next) => {
  try {
    const unlike = await Post.findByIdAndUpdate(
      req.params.id,
      {
        $pull: { likes: req.user._id },
      },
      { new: true },
    );

    if (!unlike)
      return res.status(400).json({ msg: 'This post does not exist.' });

    return res.status(200).send(unlike);
  } catch (error) {
    return next(
      new ApiError(500, `Error retrieving post with id=${req.params.id}`),
    );
  }
};
