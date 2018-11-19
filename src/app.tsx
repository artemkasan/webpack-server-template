import * as React from "react";

import { hot } from "react-hot-loader";

import * as appCss from "./app.scss";
import { List } from "./list";


const App: () => JSX.Element = (): JSX.Element =>
	<div className={appCss.appMain}>
		<List />
	</div>;

export default hot(module)(App);