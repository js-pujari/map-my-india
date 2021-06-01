import React from 'react';
import { useHistory } from 'react-router-dom';
import { useSelector } from 'react-redux';

const SecondPage = () => {
    const history = useHistory();
    const reduxData = useSelector(state => state)
    console.log('redux', reduxData);
    return (
        <div>
            <button onClick={() => history.push('/')}>Back</button>
            <h3>Hurryyy..!! Navigation works..!</h3>
        </div>
    );
}

export default SecondPage;
