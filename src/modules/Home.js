import React from 'react'
import { useHistory } from 'react-router-dom';

const Home = () => {
    const history = useHistory();

    const handleNavigation = () => {
        history.push('/second-page');
    }

    return (
        <div>
            <a style={{ color: 'blue' }} onClick={handleNavigation}>Click here for navigation</a>
        </div>
    )
}

export default Home;