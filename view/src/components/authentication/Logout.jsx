import React from 'react';

import { withFirebase } from '../firebase';

const LogoutButton = ({ firebase }) => (
    <button type="button" onClick={firebase.doLogout}>
        Logout
    </button>
);

export default withFirebase(LogoutButton);