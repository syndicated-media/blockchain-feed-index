
//const PostchainClient = require ('postchain');
// mock
const UUID = require ('uuid4');
class PostchainClient {
  setEndpointBase (url) {
    this.endpoint = url;
  }

  getUrl (url) {
    return new Promise ((resolve, reject) => {
      setTimeout (() => {
        Math.random() < 0.2 ?
          resolve ({
            id: UUID (),
            publicKey: UUID (),
            feedUrl: url,
            title: 'Some podcast title',
            email: 'some@email.com'
          })
          :
          resolve({});
      }, 100);
    });
  }

  newUrl (url, title, email, publicKey, privateKey) {
    return new Promise ((resolve, reject) => {
      setTimeout (() => {
        resolve ({
          id: UUID (),
          publicKey: publicKey,
          feedUrl: url,
          title: title,
          email: email
        });
      }, 100);
    });
  }

  transferUrl (url, newPublicKey, privateKey) {
    return new Promise ((resolve, reject) => {
      setTimeout (() => {
        resolve ({
          id: UUID (),
          publicKey: newPublicKey,
          feedUrl: url,
          title: 'Some podcast title',
          email: 'some@email.com'
        });
      }, 100);
    });
  }
}

let client = new PostchainClient ();
client.setEndpointBase ('http://something');
module.exports = client;
