import logo from './logo.svg';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from 'react-router-dom';
import Automation from '@/components/Automation';
import IconNode from '@/components/Automation/IconNode';

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
