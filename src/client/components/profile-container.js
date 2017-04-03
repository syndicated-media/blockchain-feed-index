import React from 'react';
import {connect} from 'react-redux';
import Profile from './profile';

const mapStateToProps = (state) => {
  return {
    profile: state.profile
  };
}

const ProfileContainer = connect(
  mapStateToProps,
)(Profile);

export default ProfileContainer;
