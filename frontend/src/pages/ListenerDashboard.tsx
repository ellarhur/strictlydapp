import { useNavigate } from 'react-router-dom';

const ListenerDashboard = () => {
    const navigate = useNavigate();

    return (
        <>
            <h1>Listener Dashboard</h1>
            <p>Welcome to Strictly. </p>
            <div className="recommended-tracks">
                <h2>Today's top hits</h2>
                <div className="trackcard">
                    <img src="/assets/track-1.jpg" alt="Track 1" />
                    <h3>Track 1</h3>
                    <p>Artist 1</p>
                </div>
                <div className="trackcard">
                    <img src="/assets/track-1.jpg" alt="Track 1" />
                    <h3>Track 1</h3>
                    <p>Artist 1</p>
                </div>
                <div className="trackcard">
                    <img src="/assets/track-1.jpg" alt="Track 1" />
                    <h3>Track 1</h3>
                    <p>Artist 1</p>
                </div>
            </div>
        </>
    )
}