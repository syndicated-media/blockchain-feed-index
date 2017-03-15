import React from 'react';
import {connect} from 'react-redux';
import {submit} from '../ducks/submit';
import Submit from './submit';

const mapStateToProps = (state) => {
  let submit = state.submit;
  return {
    urls: submit.urls,
    submitting: submit.isGettingUrls || submit.isValidatingUrls || submit.isPostingUrls,
    complete: submit.complete,
    error: submit.error,
  };
}

const mapDispatchToProps  = (dispatch) => {
  return {
    onSubmit: (urls) => {
      dispatch (submit(urls));
    }
  };
}

const SubmitContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(Submit);

export default SubmitContainer;
