// Component for profile previews that are displayed in search results

import React from 'react';
import { DateTime } from 'luxon';

import DefaultAvatar from '../images/default-avatar.svg';
import '../stylesheets/ProfilePreview.css';

const ProfilePreview = ({ user }) => {
  return (
    <div className="preview-container">
      <img src={ user.picture ? user.picture : DefaultAvatar } 
      alt="User avatar" className='preview-pic' />
      <div className="preview-info">
        <h6 className="preview-name">{user.first_name} {user.family_name}</h6>
        <h6 className="preview-act-created">
          Account created: {DateTime.fromISO(user.account_created).toLocaleString(DateTime.DATE_MED)}
        </h6>
      </div>
    </div>
  );
};

export default ProfilePreview;