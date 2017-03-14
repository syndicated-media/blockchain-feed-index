module.exports = urls => {
  var response = {
    urls: []
  };
  return new Promise ((resolve) => {
    validate (urls, response, resolve);
  });
}

const validate = (urls, response, resolve) => {
  if (urls.length) {
    url = urls.shift();

    validateOne (url)
      .then (result => {
        response.urls.push (result);
        validate (urls, response, resolve);
      })
      .catch (result => {
        response.urls.push (result);
        validate (urls, response, resolve);
      });
  } else {
    resolve(response);
  }
}

const validateOne = url => {
  return new Promise ((resolve, reject) => {
    setTimeout (() => {
      Math.random () < 0.5 ?
        resolve ({
          valid: true,
          url: url,
          title: 'Title for ' + url,
          email: 'some@email.com'
        }) :
        reject ({
          valid: false,
          url: url
        });
    }, 100);
  });
}
