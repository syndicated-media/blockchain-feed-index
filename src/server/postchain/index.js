const secp256k1 = require('secp256k1');
const crypto = require('crypto');
const uuid = require('uuid4');

const restClient = require('postchain-client').restClient;
const gtxClient = require('postchain-client').gtxClient;

class PostchainClient {
    setEndpointBase(url) {
        //`http://35.157.104.6/podchain/2/`
        let rest = restClient.createRestClient(url);
        this.gtx = gtxClient.createClient(rest, ['newUrl', 'transferUrl', 'changeUrl', 'deleteUrl']);
    }

    create(url, title, email, consortiumPrivateKey, podcasterPublicKey) {
        const consortiumPublicKey = secp256k1.publicKeyCreate(consortiumPrivateKey);

        let req = this.gtx.newRequest([consortiumPublicKey]);
        req.newUrl(uuid(), url, title, email, podcasterPublicKey, consortiumPublicKey);
        req.sign(consortiumPrivateKey);
        return this.send(req, url, result => result && result.length === 1);
    }

    get (count, fromId) {
        if (count !== undefined) {
          count = parseInt(count);
        }

        return this.query({type: 'get', count: count, fromId: fromId},
            result => result.map(podcast => podcastObject(podcast)));
    }

    getByPublicKey(publicKey) {
        return this.query({type: 'getPodcastsByOwner', owner: publicKey.toString('hex')},
            result => result.map(podcast => podcastObject(podcast)));
    }

    getByUrl(url) {
        return this.query({type: 'getPodcastByUrl', url: url}, result => singleResult(result))
    }

    getById(id) {
        return this.query({type: 'getPodcastById', id: id}, result => singleResult(result))
    }

    query(queryObject, resultHandler) {
        return new Promise((resolve, reject) => {
            this.gtx.query(queryObject,
                (error, result) => {
                    if (error) {
                        console.log(error);
                        reject(error);
                        return;
                    }
                    resolve(resultHandler(result));
                });
        });
    }

    // The consortiumPrivateKey is not needed here. You can remore that parameter
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

    // I changed newPrivateKey->newOwnerPublicKey because
    // the new owner doesn't have to sign /Kalle
    transfer(url, oldOwnerPrivateKey, newOwnerPublicKey) {
        const oldPublicKey = secp256k1.publicKeyCreate(oldOwnerPrivateKey);
        let req = this.gtx.newRequest([oldPublicKey]);
        req.transferUrl(url, Buffer.from(newOwnerPublicKey, 'hex'));
        req.sign(oldOwnerPrivateKey);
        var condition = (result) => {
            if (!result || result.length != 1) {
                return false;
            }
            return result[0].owner === newOwnerPublicKey.toString('hex');
        }
        return this.send(req, url, condition);
    }

    delete(url, ownerPrivateKey) {
        const ownerPublicKey = secp256k1.publicKeyCreate(ownerPrivateKey);
        let req = this.gtx.newRequest([ownerPublicKey]);
        req.deleteUrl(url);
        req.sign(ownerPrivateKey);
        return this.send(req, url, result => result && result.length === 0);
    }

    send(req, urlToFollFor, pollCondition) {
        return new Promise((resolve, reject) => {
            req.send((error) => {
                if (error) {
                    console.log(error);
                    reject(error);
                }
                let queryObject = {type: 'getPodcastByUrl', url: urlToFollFor};
                this.queryUntilCondition(queryObject, pollCondition)
                    .then(queryResult => {
                        resolve(singleResult(queryResult))
                    }, error => {
                        console.log(error);
                        reject(error);
                    });
            });
        });
    }

    queryUntilCondition(queryObject, condition) {
        return new Promise((resolve, reject) => {
            var timeout = Date.now() + 10000; // Ten seconds timeout
            let resultHandler = (error, result) => {
                if (error) {
                    console.error(error);
                    reject(error);
                    return;
                }
                if (!condition(result)) {
                    if (Date.now() > timeout) {
                        reject(new Error('timeout'));
                        return;
                    }
                    // Poll every 2 seconds
                    console.log('Condition not met yet, retrying in 2 seconds');
                    setTimeout(() => this.gtx.query(queryObject, resultHandler), 2000);
                    return;
                }
                //console.log(JSON.stringify(result));
                resolve(result);
            }
            this.gtx.query(queryObject, resultHandler);
        });
    }

    /**
     * This is an illustration of external signing of a podchain transaction
     *
     * There are two variants: One where this service knows the public key
     * of the podcaster, and one where it is unknown. The difference between the
     * two cases are that in the latter you first need to query podchain to get the owner.
     *
     * This illustrates the case where we DO know the owner, so we don't have to look it up.
     */
    illustrationDeleteFunctionForExternalSigning(url, ownerPublicKey) {
        let req = this.gtx.newRequest([ownerPublicKey]);
        req.deleteUrl(url);
        var bufferToSign = req.getBufferToSign();
        // First get somebody to sign this buffer.
        return someExternalActorSignsThisBufferInHerWebBrowserAndReturnsTheSignature(bufferToSign)
        // then add the signature to the request and send the request.
            .then((signature) => {
                req.addSignature(ownerPublicKey, signature);
                return this.send(req, url, result => result && result.length === 0);
            });
    }

    /**
     * Another approach is a two-step process:
     * 1. Get the bufferToSign
     */
    illustrateGetDeleteRequestBufferToSign(url, ownerPublicKey) {
        let req = this.gtx.newRequest([ownerPublicKey]);
        req.deleteUrl(url);
        return req.getBufferToSign();
    }
    /**
     * 2. Recreate the transaction when the user have signed the message.
     */
    illustrateGetDeleteFinalize(url, ownerPublicKey, signature) {
        let req = this.gtx.newRequest([ownerPublicKey]);
        req.deleteUrl(url);
        req.addSignature(ownerPublicKey, signature);
        return this.send(req, url, result => result && result.length === 0);
    }
}

function sha256(buffer) {
    return crypto.createHash('sha256').update(buffer).digest()
}
function hash256(buffer) {
    return sha256(sha256(buffer))
}
function someExternalActorSignsThisBufferInHerWebBrowserAndReturnsTheSignature(bufferToSign) {
    return new Promise((resolve, reject) => {
        // This code is run in someone's web browser.
        // Dummy private key that will generate a bad signature but you get the picture
        var privKey = Buffer.alloc(32);
        var digestBuffer = hash256(content);
        return secp256k1.sign(digestBuffer, privKey).signature;
    });
}

function singleResult(queryResult) {
    if (!queryResult) {
        throw new Error('queryResult was null');
    }
    if (queryResult.length > 1) {
        throw new Error('Too many results, expected at most 1');
    }
    if (queryResult.length === 0) {
        return null;
    }
    return podcastObject(queryResult[0]);
}

function podcastObject(pod) {
    return {
        id: pod.id,
        publicKey: pod.owner,
        feedUrl: pod.url,
        title: pod.title,
        email: pod.email,
        deleted: pod.deleted
    };
}

let client = new PostchainClient();
client.setEndpointBase('http://35.157.104.6/podchain/2/');
module.exports = client;
