import '../index.css';

const Navbar = () => {
    return (
        <nav>
            <ul>
                <li><a href="/ListenerDashboard">Home</a></li>
                <li><a href="/Mypage">My Uploads</a></li>
                <li><a href="/Settings">Settings</a></li>
                <li><a href="/Logout">Log out</a></li>
            </ul>
        </nav>
    )
}

export default Navbar;