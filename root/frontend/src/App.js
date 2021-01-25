import { Route, Switch } from 'react-router-dom';
import MapBox from './components/MapBox';
import MarkersList from './components/MarkersList';

function App() {
  return (
    <main>
        <Switch>
            <Route path="/" component={MapBox} exact />
            <Route path="/markers" component={MarkersList} />
        </Switch>
    </main>
)
}

export default App;
