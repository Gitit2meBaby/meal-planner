import { Route, Routes } from 'react-router-dom'
import './styles.scss'
import { Nav } from './components/Nav'
import { Head } from './components/Head'
import { Dashboard } from './components/Dashboard'
import { ShoppingList } from './components/ShoppingList'

function App() {

  return (
    <>
      <main>
        <Nav />
        <Routes>
          <Route path="/" element={
            <div className="container">
              <Head />
              <Dashboard />
            </div>
          } />
          <Route path='/shopping-list'
            element={<ShoppingList />} />
        </Routes>
      </main>
    </>
  )
}

export default App
