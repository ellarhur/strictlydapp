import { useNavigate, useLocation } from 'react-router-dom';
import '../index.css';

const ModeButton = () => {
    const navigate = useNavigate();
    const location = useLocation();
    
    // Kolla vilken sida vi är på
    const isCreatorMode = location.pathname === '/CreatorDashboard';

    return (
        <div className="mode-toggle-container">
            <div className="mode-toggle">
                <div 
                    className={`mode-toggle-slider ${isCreatorMode ? 'artist' : 'listener'}`}
                />
                <button 
                    className={`mode-button ${!isCreatorMode ? 'active' : ''}`}
                    onClick={() => navigate('/ListenerDashboard')}
                >
                    Listener
                </button>
                <button 
                    className={`mode-button ${isCreatorMode ? 'active' : ''}`}
                    onClick={() => navigate('/CreatorDashboard')}
                >
                    Artist
                </button>
            </div>
        </div>
    )
}

export default ModeButton;