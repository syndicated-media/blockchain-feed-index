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
    isError: false,
    error: ''
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
        isGettingUrls: true
      };

    case VALIDATE:
      return {
        ...state,
        isValidatingUrls: true
      };

    case POST_TO_PODCHAIN:
      return {
        ...state,
        isPostingUrls: true
      };

    case COMPLETE:
      return {
        ...state,
        isComplete: true,
        response: action.response
      };

    default:
      return state;
  }
}

export function submit (urls) {
  return dispatch => {
    urls = urlsAsArray (urls);
    urls = cleanUrls (urls);

    dispatch (init (urls));
    dispatch (getFromPodchain ());

    fetch ('/api/podcasts?q=' + urls.join (','))
      .then (response => {
        urls = removeAlreadyInPodchain (urls, response.json());

        dispatch (validate ());
        fetch ('/api/validate', {
          method: 'POST',
          body: JSON.stringify (urls)
        })
          .then (response => {
            urls = removeInvalidAndAddMetaData (response.json());

            dispatch (postToBlockchain);
            fetch ('/api/podcasts', {
              method: 'POST',
              body: JSON.stringify({
                urls: urls
              })
            })
              .then (response => {
                dispatch (complete (response.json ()));
              })
          })
      })
      .catch(error => {
        dispatch (error (error.json ()));
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
    error: response
  };
}

// helpers

function urlsAsArray (urls) {
  if (!Array.isArray(urls)) {
    urls = urls.split(' ');
  }
  return urls;
}

function cleanUrls (urls) {
  // TODO
  return urls;
}

function removeAlreadyInPodchain (urls) {
  // TODO
  return urls;
}

function removeInvalidAndAddMetaData (results) {
  let onlyValidUrls = [];
  result.forEach ((result, index) => {
    if (result.valid) {
      onlyValidUrls.push ({
        url: result.url,
        title: result.title,
        email: result.email
      });
    }
  });
  return onlyValidUrls;
}
