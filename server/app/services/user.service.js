const { ObjectId } = require('mongodb');
const moment = require('moment');

class PostService {
  constructor(client) {
    this.Post = client.db().collection('posts');
  }
  // Định nghĩa các phương thức truy xuất CSDL sử dụng mongodb API
  extractPostData(payload) {
    const post = {
      author: payload.author,
      description: payload.description,
      art: payload.art,
      createdAt: moment().format(),
      liked: payload.liked,
      comments: payload.comments,
    };
    Object.keys(post).forEach(
      // eslint-disable-next-line no-undef
      (key) => post[key] === undefined && delete post[key],
    );
    return post;
  }

  async create(payload) {
    const post = this.extractPostData(payload);
    console.log(post);
    const result = await this.Post.findOneAndReplace(post, post, {
      returnDocument: 'after',
      upsert: true,
    });
    return result.value;
  }

  // async find(filter) {
  //   const cursor = await this.Post.find(filter);
  //   return await cursor.toArray();
  // }
  async findByText(description) {
    return await this.find({
      description: { $regex: new RegExp(description), $options: 'i' },
    });
  }
  async findById(id) {
    return await this.Post.findOne({
      _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
    });
  }
}

module.exports = PostService;
