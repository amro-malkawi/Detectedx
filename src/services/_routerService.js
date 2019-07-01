
////front end
import Home from 'Routes/home';
import Instructions from 'Routes/instructions';
import Test from 'Routes/test';


export default [
	{
		path: 'home',
		component: Home
	},
	{
		path: 'instructions',
		component: Instructions
	},
	{
		path: 'test',
		component: Test
	}
]