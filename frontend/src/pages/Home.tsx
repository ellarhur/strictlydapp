import { useNavigate } from 'react-router-dom';

const Home = () => {
    const navigate = useNavigate();

    return (
        <>
            <div className="landing-page-gradient"></div>
            <div className="introduction">
                <h1>Strictly</h1>
                <p>Support your favourite artists directly.</p>
                <button onClick={() => {
                    navigate('/login');
                }} className="getstarted-button">Get started</button>
            </div>
            <div className="landingpage-design">
                <img src="/assets/landingpage-design.png" alt="Strictly landing page design" /> 
            </div>
        </>
    )
}

export default Home;