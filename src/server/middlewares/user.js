module.exports = (req, res, next) => {
  req.user = new User();
  next();
}

class User {
  constructor () {
    this.id = '';
    this.email = '';
    this.publicKey = '';
    this.privateKey = '';
    this.feeds = [];
  }

  setKeys (dbRows) {
    return new Promise(resolve => {
      this.publicKey = dbRows[0].publickey;
      this.privateKey = dbRows[0].privatekey;
      resolve();
    });
  }

  setFeeds (feeds) {
    this.feeds.concat(feeds);
  }

  toResponse () {
    return {
      id: this.id,
      email: this.email,
      publicKey: this.publicKey,
      feeds: this.feeds
    };
  }
}
