import './styles/Header.css'
import logoPic from './assets/header_logo.png'
import userPic from './assets/default_icon.webp'

function Header() {
    
    return (
      <div className = "headerBar">
        <img className = "headerLogoPic" src = {logoPic} alt="Laboratory Logo"></img> 
        
        <nav>
          <ul>
            <li><a href="/">Home</a></li>
            <li><a href="/">Add Patient Data</a></li>
            <li><a href="/">Add Patient Request</a></li>
            <li><a href="/">View All Patients</a></li>
            <li className="dropdown">
              <a className="dropdown-toggle" id="headerDropdown" role="button" data-bs-toggle="dropdown">
                <img className="headerUserPic" src={userPic} alt="Profile Picture" />
              </a>
              <div className="dropdown-menu" aria-labelledby="headerDropdown">
                <h6 className="dropdown-header">Hello, Name!</h6>
                <div className="dropdown-divider"></div>
                <a className="dropdown-item" href="/">View Profile</a>
                <a className="dropdown-item" href="/">Log Out</a>
              </div>
            </li>
          </ul>
        </nav>
      </div>
    )
  }
  
  export default Header