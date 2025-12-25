import { useNavigate } from 'react-router-dom';

const Home = () => {
    const navigate = useNavigate();

    return (
        <>
            <div className="landing-page-gradient"></div>
            <div className="home-container">
                <div className="introduction">
                    <h1>Strictly</h1>
                    <p>Support your favourite artists directly.</p>
                    <button onClick={() => {
                        navigate('/ListenerDashboard');
                    }} className="getstarted-button">Get started</button>
                </div>
       
            </div>
        </>
    )
}

export default Home;