const secp256k1 = require('secp256k1');

const restClient = require('postchain-client').restClient;
const gtxClient = require('postchain-client').gtxClient;

// mock
const UUID = require('uuid4');
class PostchainClient {
    setEndpointBase(url) {
        //`http://35.157.104.6/podchain/2/`
        let rest = restClient.createRestClient(url);
        this.gtx = gtxClient.createClient(rest, ['newUrl', 'transferUrl', 'changeUrl']);
    }

    create(url, title, email, consortiumPrivateKey, podcasterPrivateKey) {
        const consortiumPublicKey = secp256k1.publicKeyCreate(consortiumPrivateKey);
        const podcasterPublicKey = secp256k1.publicKeyCreate(podcasterPrivateKey);

        // If CM assigns ownership to itself we only require
        // one signature. It's unneccesary to make two
        // equal signatures.
        let signers = [consortiumPublicKey];
        if (!consortiumPublicKey.equals(podcasterPublicKey)) {
            signers.push(podcasterPublicKey);
        }

        let req = this.gtx.newRequest(signers);
        req.newUrl(url, title, email, podcasterPublicKey, consortiumPublicKey);
        req.sign(consortiumPrivateKey);
        return this.send(req, url, result => result && result.length === 1);
    }

    getByPublicKey(publicKey) {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                Math.random() < 0.5 ?
                    resolve({
                        id: UUID(),
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

    getByUrl(url) {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                Math.random() < 0.5 ?
                    resolve({
                        id: UUID(),
                        publicKey: UUID(),
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

    update(oldUrl, newUrl, newTitle, newEmail, consortiumPrivateKeyUnusedDELETE, podcasterPrivateKey) {
        const podcasterPublicKey = secp256k1.publicKeyCreate(podcasterPrivateKey);

        let req = this.gtx.newRequest([podcasterPublicKey]);
        req.changeUrl(oldUrl, newUrl, newTitle, newEmail);
        req.sign(podcasterPrivateKey);
        var condition = (result) => {
            if (!result || result.length != 1) {
                return false;
            }
            var updated = false;
            if (newUrl) {
                updated = result[0].url === newUrl;
            }
            if (newTitle) {
                updated |= result[0].title === newTitle;
            }
            if (newEmail) {
                updated |= result[0].email === newEmail;
            }
            return updated;
        }
        return this.send(req, newUrl, condition);
    }

    transfer(url, oldPrivateKey, newPrivateKey) {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                resolve({
                    id: UUID(),
                    publicKey: newPrivateKey,
                    feedUrl: url,
                    title: 'Some podcast title',
                    email: 'some@email.com',
                    deleted: false
                });
            }, 100);
        });
    }

    delete(url, consortiumPrivateKey, podcasterPrivateKey) {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                resolve({
                    id: UUID(),
                    publicKey: UUID(),
                    feedUrl: url,
                    title: 'Some podcast title',
                    email: 'some@email.com',
                    deleted: true
                });
            }, 100);
        });
    }

    send(req, urlToFollFor, pollCondition) {
        return new Promise((resolve, reject) => {
            req.send((error) => {
                if (error) {
                    console.log(error);
                    reject(error);
                }
                let queryObject = {type: "getPodcast", url: urlToFollFor};
                this.queryUntilCondition(queryObject, pollCondition)
                    .then(queryResult => {
                        let pod = queryResult[0];
                        resolve({
                            id: pod.id,
                            publicKey: pod.owner,
                            feedUrl: pod.url,
                            title: pod.title,
                            email: pod.email,
                            deleted: pod.deleted
                        });
                    }, error => {
                        console.log(error);
                        reject(error);
                    });
            });
        });
    }

    queryUntilCondition(queryObject, condition) {
        return new Promise((resolve, reject) => {
            let resultHandler = (error, result) => {
                if (error) {
                    console.error(error);
                    reject(error);
                    return;
                }
                if (!condition(result)) {
                    // Poll every 2 seconds
                    console.log("Condition not met yet, retrying in 2 seconds");
                    setTimeout(() => this.gtx.query(queryObject, resultHandler), 2000);
                    return;
                }
                console.log(JSON.stringify(result));
                resolve(result);
            }
            this.gtx.query(queryObject, resultHandler);
        });
    }
}


let client = new PostchainClient();
client.setEndpointBase('http://35.157.104.6/podchain/2/');
module.exports = client;
