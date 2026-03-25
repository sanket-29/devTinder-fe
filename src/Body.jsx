import { Outlet } from 'react-router-dom'
import NavBar from './NavBar'
import Footer from './Footer'

const Body = () => {
  return (
    <div>
      <NavBar />
      <Outlet /> {/* any children of the route will be rendered here */}
      <Footer />
    </div>
  )
}

export default Body
