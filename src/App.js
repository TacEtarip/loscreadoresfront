import React from 'react';
import './assets/styles/App.scss';
import RouterComponente from './components/router/RouterComponente';
// const LandingComponente = React.lazy(() => import('./components/LandingComponente'));
function App() {

  return (
    <div className="App">
      <RouterComponente/>
      {
        /*
      <Suspense fallback={<div>Loading...</div>}>
        <BarraTareasComponente/>
      </Suspense>*/
      }
    </div>
  );
}

export default App;
