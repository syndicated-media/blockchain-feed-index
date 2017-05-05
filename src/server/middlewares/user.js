module.exports = (req, res, next) => {
  req.user = new User();
  next();
}

class User {
  constructor () {
    this.id = '';
    this.email = '';
    this.publicKey = Buffer.from('', 'hex');
    this.privateKey = Buffer.from('', 'hex');
    this.feeds = [];
  }

  setKeys (publicKey, privateKey) {
    this.publicKey = Buffer.from(publicKey, 'hex');
    this.privateKey = Buffer.from(privateKey, 'hex');
    console.log(this.publicKey);
  }

  setKeysFromDB (dbRows) {
    return new Promise(resolve => {
      let row = dbRows[0];
      this.setKeys(row.publickey, row.privatekey);
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
