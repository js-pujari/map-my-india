import React, { useEffect } from 'react';
import Routes from './config/RoutesConfig';
import { addTodo } from './store/actions';
import { useDispatch } from 'react-redux';

const App = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(addTodo({ content: 'First Redux Data' }));
  }, [])
  return (
    <div className="my-cls">
      <h2>CRA-template-js-all</h2>
      <Routes />
    </div>
  );
}

export default App;