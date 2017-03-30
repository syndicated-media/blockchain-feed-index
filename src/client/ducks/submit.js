const INIT = 'podchain/submit/INIT';
const GET_FROM_PODCHAIN = 'podchain/submit/GET_FROM_PODCHAIN';
const VALIDATE = 'podchain/submit/VALIDATE';
const POST_TO_PODCHAIN = 'podchain/submit/POST_TO_PODCHAIN';
const COMPLETE = 'podchain/submit/COMPLETE';
const ERROR = 'podchain/submit/ERROR';

const initalState = {
    urls: [],
    response: '',
    isGettingUrls: false,
    isValidatingUrls: false,
    isPostingUrls: false,
    isComplete: false,
    isError: false
};

export default function reducer (state = initalState, action = {}) {
  switch (action.type) {
    case INIT:
      return {
        ...state,
        urls: action.urls
      };

    case GET_FROM_PODCHAIN:
      return {
        ...state,
        isGettingUrls: true,
        isValidatingUrls: false,
        isPostingUrls: false,
        isComplete: false
      };

    case VALIDATE:
      return {
        ...state,
        isGettingUrls: false,
        isValidatingUrls: true,
        isPostingUrls: false,
        isComplete: false
      };

    case POST_TO_PODCHAIN:
      return {
        ...state,
        isGettingUrls: false,
        isValidatingUrls: false,
        isPostingUrls: true,
        isComplete: false
      };

    case COMPLETE:
      return {
        ...state,
        isGettingUrls: false,
        isValidatingUrls: false,
        isPostingUrls: false,
        isComplete: true,
        isError: false,
        response: action.response
      };

    case ERROR:
      return {
        ...state,
        isGettingUrls: false,
        isValidatingUrls: false,
        isPostingUrls: false,
        isComplete: true,
        isError: true,
        response: action.response
      };
    default:
      return state;
  }
}

// top level action creator

export function submit (urls) {
  return dispatch => {
    urls = urlsAsArray (urls);
    urls = cleanUrls (urls);

    dispatch (init (urls));
    dispatch (getFromPodchain ());

    fetch ('/api/podcasts?q=' + urls.join (','))
      .then (response => response.json())
      .then (response => {
        //urls = removeAlreadyInPodchain (urls, response);

        if (urls.length) {
          dispatch (validate ());
          fetch ('/api/validate?q=' + urls.join(','))
            .then (response => response.json())
            .then (response => {
              urls = removeInvalidAndAddMetaData (response.urls);

              if (urls.length) {
                dispatch (postToBlockchain);
                fetch ('/api/podcasts', {
                  headers: {
                    'Content-Type': 'application/json'
                  },
                  method: 'POST',
                  body: JSON.stringify({
                    urls
                  })
                })
                  .then (response => response.json())
                  .then (response => {
                    dispatch (complete ('Podcast(s) succesfully submitted'));
                  })
              } else {
                dispatch (complete ('No valid podcast(s) to submit'));
              }
            });
        } else {
          dispatch (complete ('Podcast(s) already in Podchain'));
        }
      })
      .catch(response => {
        dispatch (error (JSON.stringify(response)));
      });
  }
}

// action creators

function init (urls) {
  return {
    type: INIT,
    urls: urls
  };
}

function getFromPodchain () {
  return {
    type: GET_FROM_PODCHAIN
  };
}

function validate () {
  return {
    type: VALIDATE
  };
}

function postToBlockchain () {
  return {
    type: POST_TO_PODCHAIN
  };
}

function complete (response) {
  return {
    type: COMPLETE,
    response: response
  };
}

function error (response) {
  return {
    type: ERROR,
    response: response
  };
}

// helpers

function urlsAsArray (urls) {
  // get as array
  if (!Array.isArray(urls)) {
    let splitChar = ' ';
    if (urls.indexOf(',') !== -1) {
      splitChar = ',';
    }

    urls = urls.split(splitChar);
  }

  // remove white space
  urls = urls.map (url => {
    return url.trim();
  });

  // only return that has length
  urls = urls.filter (url => {
    return url.length > 0;
  });

  return urls;
}

function cleanUrls (urls) {
  return urls.map (url => {
    // remove protocol
    let i = url.indexOf('://');
    if (i > -1 && i < 6) {
      url = url.slice(i + 3);
    }

    // remove query
    i = url.indexOf('?');
    if (i > -1) {
      url = url.slice(0, i);
    }

    // remove trailing slash
    i = url.lastIndexOf('/');
    if (i === url.length - 1) {
      url = url.slice(0, url.length - 1);
    }

    return url;
  });
}

function removeAlreadyInPodchain (urls, inPodchain) {
  return urls.filter (url => {
    let found = inPodchain.find (data => {
      return data.feedUrl === url;
    });
    return found !== undefined ? false : true;
  });
}

function removeInvalidAndAddMetaData (results) {
  let onlyValidUrls = [];
  results.forEach ((result, index) => {
    if (true) {//result.valid) {
      onlyValidUrls.push ({
        url: result.url,
        title: result.title,
        email: result.email
      });
    }
  });
  return onlyValidUrls;
}
