// ************** THIS IS YOUR APP'S ENTRY POINT. CHANGE THIS FILE AS NEEDED. **************
// ************** DEFINE YOUR REACT COMPONENTS in ./components directory **************
import './stylesheets/App.css';
import {BrowserRouter} from 'react-router-dom'
import FakeStackOverflow from './components/fakestackoverflow.js'

function App() {
  return (
    <section className="fakeso">
      <BrowserRouter>
      <FakeStackOverflow />
      </BrowserRouter>
    </section>
  );
}

export default App;
