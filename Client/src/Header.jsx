import './Header.css'
import logoPic from './assets/header_logo.png'

function Header() {
    
    return (
      <div className="header-bar sticky-top">
        <a href="/"><img className = "header-logo-pic" src = {logoPic} alt="Laboratory Logo"></img></a>

        <nav className="navbar navbar-expand-lg navbar-dark">
          <button className="menu-links navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle Navigation">
            <span className="navbar-toggler-icon"></span>
          </button>

          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <ul className="navbar-nav">
              <li><a className="nav-link" href="/Bioscopic-LIS/home">Home</a></li>
              <li><a className="nav-link" href="/Bioscopic-LIS/addpatient">Add Patient Data</a></li>
              <li><a className="nav-link" href="/Bioscopic-LIS/request">Add Patient Request</a></li>
              <li><a className="nav-link" href="/Bioscopic-LIS/patients">View All Patients</a></li>
              <li className="dropdown">
                <a className="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button" data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                  Name Here
                </a>
                <div className="dropdown-menu dropdown-menu-end" aria-labelledby="navbarDropdown">
                  <a className="dropdown-item" href="/Bioscopic-LIS">View Profile</a>
                  <a className="dropdown-item" href="/Bioscopic-LIS">Log Out</a>
                </div>
              </li>
            </ul>
          </div>
        </nav>
      </div>
    )
  }
  
  export default Header