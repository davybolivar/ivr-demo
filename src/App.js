import {
  BrowserRouter as Router,
  Switch,
  Route,
} from 'react-router-dom';
import Automation from '@/components/Automation';

import './App.css';

function App() {
  return (
    <Router>
      <main className="h-screen relative">
        <div className="h-full w-full relative">
          <Switch>
            <Route exact path="/">
              <Automation />
            </Route>
          </Switch>
        </div>
      </main>
    </Router>
  );
}

export default App;
