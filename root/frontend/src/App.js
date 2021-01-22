import { Route, Switch } from 'react-router-dom';
import MapBox from './MapBox';
import Markers from './Markers';

function App() {
  return (
    <main>
        <Switch>
            <Route path="/map" component={MapBox} exact />
            <Route path="/markers" component={Markers} />
        </Switch>
    </main>
)
}

export default App;
