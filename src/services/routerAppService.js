
////front end
import Welcome from 'Routes/welcome';
import Instructions from 'Routes/instructions';
import Test from 'Routes/test';


export default [
	{
		path: 'welcome',
		component: Welcome
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