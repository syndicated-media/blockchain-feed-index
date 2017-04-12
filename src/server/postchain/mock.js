
//const PostchainClient = require ('postchain');
// mock
const UUID = require ('uuid4');
class PostchainClient {
  setEndpointBase (url) {
    this.endpoint = url;
  }

  create (url, title, email, consortiumPrivateKey, podcasterPrivateKey) {
    return new Promise ((resolve, reject) => {
      setTimeout (() => {
        resolve ({
          id: UUID (),
          publicKey: UUID (),
          feedUrl: url,
          title: title,
          email: email,
          deleted: false
        });
      }, 100);
    });
  }

  getByPublicKey (publicKey) {
    return new Promise ((resolve, reject) => {
      setTimeout (() => {
        Math.random() < 0.5 ?
          resolve ({
            id: UUID (),
            publicKey: publicKey,
            feedUrl: 'http://some.url.com',
            title: 'Some podcast title',
            email: 'some@email.com',
            deleted: false
          })
          :
          reject();
      }, 100);
    });
  }

  getByUrl (url) {
    return new Promise ((resolve, reject) => {
      setTimeout (() => {
        Math.random() < 0.5 ?
          resolve ({
            id: UUID (),
            publicKey: UUID (),
            feedUrl: url,
            title: 'Some podcast title',
            email: 'some@email.com',
            deleted: false
          })
          :
          reject();
      }, 100);
    });
  }

  update (oldUrl, newUrl, newTitle, newEmail, consortiumPrivateKey, podcasterPrivateKey) {
    return new Promise ((resolve, reject) => {
      setTimeout (() => {
        resolve ({
          id: UUID (),
          publicKey: UUID (),
          feedUrl: newUrl,
          title: newTitle,
          email: newEmail,
          deleted: false
        });
      }, 100);
    });
  }

  transfer (url, oldPrivateKey, newPrivateKey) {
    return new Promise ((resolve, reject) => {
      setTimeout (() => {
        resolve ({
          id: UUID (),
          publicKey: newPrivateKey,
          feedUrl: url,
          title: 'Some podcast title',
          email: 'some@email.com',
          deleted: false
        });
      }, 100);
    });
  }

  delete (url, consortiumPrivateKey, podcasterPrivateKey) {
    return new Promise ((resolve, reject) => {
      setTimeout (() => {
        resolve ({
          id: UUID (),
          publicKey: UUID (),
          feedUrl: url,
          title: 'Some podcast title',
          email: 'some@email.com',
          deleted: true
        });
      }, 100);
    });
  }
}

let client = new PostchainClient ();
client.setEndpointBase ('http://something');
module.exports = client;
