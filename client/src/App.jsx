import { Footer, Navbar, Services, Transactions, Welcome } from './components'

const App = () => {
	return (
		<div className='min-h-screen'>
			<div className='gradient-bg-welcome'>
				<Navbar />
				<Welcome />
				<h1 className='text-3xl font-bold underline'>Hello world!</h1>
			</div>
			<Services />
			<Transactions />
			<Footer />
		</div>
	)
}

export default App
