import React from 'react';
import {connect} from 'react-redux';
import {submit} from '../ducks/submit';
import Submit from './submit';

const mapStateToProps = (state) => {
  let submit = state.submit;
  return {
    urls: submit.urls,
    isPostingUrls: submit.isPostingUrls,
    isComplete: submit.isComplete,
    isError: submit.isError,
    response: submit.response
  };
}

const mapDispatchToProps  = (dispatch) => {
  return {
    onSubmit: (urls) => {
      dispatch (submit (urls));
    }
  };
}

const SubmitContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(Submit);

export default SubmitContainer;
