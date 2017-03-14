const INIT = 'podchain/submit/INIT';
const RETRIEVE_FROM_BLOCKCHAIN = 'podchain/submit/RETRIEVE_FROM_BLOCKCHAIN';
const VALIDATE = 'podchain/submit/VALIDATE';
const POST_TO_BLOCKCHAIN = 'podchain/submit/POST_TO_BLOCKCHAIN';
const COMPLETE = 'podchain/submit/COMPLETE';
const ERROR = 'podchain/submit/ERROR';

const initalState = {
    feeds: [],
    response: '',
    isRetreivingFeeds: false,
    isValidatingFeeds: false,
    isPostingFeeds: false,
    isComplete: false,
    isError: false,
    error: ''
};

export default function reducer (state = initalState, action = {}) {
  switch (action.type) {
    case INIT:
      return {
        ...state,
        feeds: action.feeds
      };

    case RETRIEVE_FROM_BLOCKCHAIN:
      return {
        ...state,
        isRetreivingFeeds: true
      };

    case VALIDATE:
      return {
        ...state,
        isValidatingFeeds: true
      };

    case POST_TO_BLOCKCHAIN:
      return {
        ...state,
        isPostingFeeds: true
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

export function postFeeds (feeds) {
  return dispatch => {
    feeds = feedsAsArray(feeds);
    feeds = cleanFeeds(feeds);

    dispatch(init(feeds));
    dispatch(retrieveFroBlocktchain());

    fetch ('/postchain', {
      method: 'POST',
      body: JSON.stringify(feeds)
    })
      .then(response => {
        feeds = removeDuplicates(feeds, response.json());

        dispatch(validate());
        fetch ('/validate', {
          method: 'POST',
          body: JSON.stringify(feeds)
        })
          .then(response => {
            feeds = removeNotValid(feeds, response.json());
            feeds = addMetaData(feeds, response.json());

            dispatch(postToBlockchain);
            fetch('/submit', {
              method: 'POST',
              body: json.stringify(feeds)
            })
              .then(response => {
                dispatch(complete(response.json()));
              })
          })
      })
      .catch(error => {
        dispatch(error(error.json()));
      });

    dispatch(retreiveFrom)
    submit(feeds);
    retreive()
      .then(validate)
      .then(post)
      .then(complete);
  }
}

// action creators

function init (feeds) {
  return {
    type: INIT,
    feeds: feeds
  };
}

function retrieveFromBlockchain () {
  return {
    type: RETRIEVE_FROM_BLOCKCHAIN
  };
}

function validate () {
  return {
    type: VALIDATE
  };
}

function postToBlockchain () {
  return {
    type: POST_TO_BLOCKCHAIN
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

function feedsAsArray (feeds) {
  if (!Array.isArray(feeds)) {
    feeds = feeds.split(' ');
  }
  return feeds;
}

function cleanFeeds (feeds) {
  // TODO
  return feeds;
}
