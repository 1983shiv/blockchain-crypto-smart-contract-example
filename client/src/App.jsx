import {Footer, Navbar, Welcome, Loader, Services, Transactions } from './components'

const App = () => {
  return (
    <div className="min-h-screen">
      <div className="gradient-bg-welcome">
        <Navbar />
        <Welcome />
      </div>
        <Loader />
        <Services />
        <Transactions />
        <Footer />

    </div>
  )
}

export default App
