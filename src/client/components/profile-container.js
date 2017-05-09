import React from 'react';
import {connect} from 'react-redux';
import Profile from './profile';

const mapStateToProps = (state) => {
  return {
    profile: state.profile,
    isLoading: !state.profile.authenticated || state.profile.isFetchingProfile || state.profile.loggingIn,
    isError: state.profile.error
  };
}

const ProfileContainer = connect(
  mapStateToProps,
)(Profile);

export default ProfileContainer;
