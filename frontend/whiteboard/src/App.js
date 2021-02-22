import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';

import Room from './components/Room/Room'
import Join from './components/Join/Join'

function App() {
  return (
    <Router>
      <Route path='/' exact component={Join} />
      <Route path='/room/:id' component={Room} />
    </Router>
  )}

export default App;
