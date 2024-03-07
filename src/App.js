// App.js
import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import Layout from './components/Layout.jsx';
import RoutesComponent from './routers/Routes.jsx';

function App() {
  return (
    <div className="App">
      <Router>
        <Layout>
          <RoutesComponent />
        </Layout>
      </Router>
    </div>
  );
}

export default App;
