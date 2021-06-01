import {
    Route,
    Switch
} from "react-router-dom";
import SecondPage from "../modules/SecondPage";
import Home from "../modules/Home";

const Routes = () => {
    return (
        <Switch>
            <Route exact path="/">
                <Home />
            </Route>
            <Route path="/second-page">
                <SecondPage />
            </Route>
            <Route path="*">
                <div>No match found</div>
            </Route>
        </Switch>
    )
}

export default Routes;