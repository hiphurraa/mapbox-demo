import { Route, Switch } from 'react-router-dom';
import MapBox from './MapBox';
import MarkersList from './MarkersList';

function App() {
  return (
    <main>
        <Switch>
            <Route path="/map" component={MapBox} exact />
            <Route path="/markers" component={MarkersList} />
        </Switch>
    </main>
)
}

export default App;
