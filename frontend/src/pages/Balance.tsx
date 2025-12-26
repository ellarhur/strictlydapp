import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ethers } from 'ethers';
import Navbar from '../components/Navbar';
import { useTracks } from '../contexts/TracksContext';
import { useWallet } from '../contexts/WalletContext';
import { useStrictlyContract } from '../hooks/useStrictlyContract';
import ModeButton from '../components/ModeButton';
import '../index.css';

const Balance = () => {
    const navigate = useNavigate();
    const { currentTrack } = useTracks();
    const { address, isConnected, isLoading: walletLoading, signer } = useWallet();
    const contract = useStrictlyContract(signer);

    const [monthlyFee, setMonthlyFee] = useState<string>('0');
    const [billingPeriod, setBillingPeriod] = useState<number>(0);
    const [epochStart, setEpochStart] = useState<number>(0);
    const [currentPeriod, setCurrentPeriod] = useState<number>(0);
    const [hasSubscription, setHasSubscription] = useState<boolean>(false);
    const [playedTracks, setPlayedTracks] = useState<number[]>([]);
    const [isSubscribing, setIsSubscribing] = useState(false);
    const [isSettling, setIsSettling] = useState(false);
    const [loading, setLoading] = useState(true);

    // Redirecta till login om inte ansluten (vänta på loading)
    useEffect(() => {
        if (!walletLoading && !isConnected) {
            navigate('/login');
        }
    }, [walletLoading, isConnected, navigate]);

    // Hämta contract data
    useEffect(() => {
        const fetchContractData = async () => {
            if (!contract || !address) {
                setLoading(false);
                return;
            }

            try {
                setLoading(true);

                // Hämta variabler från kontraktet
                const fee = await contract.monthlyFee();
                const period = await contract.BILLING_PERIOD();
                const epoch = await contract.epochStart();
                const current = await contract.currentPeriod();
                const hasSub = await contract.hasActiveSubscription(address);

                setMonthlyFee(ethers.formatEther(fee));
                setBillingPeriod(Number(period));
                setEpochStart(Number(epoch));
                setCurrentPeriod(Number(current));
                setHasSubscription(hasSub);

                // Hämta played tracks för current period
                if (hasSub) {
                    const tracks = await contract.playedTrackIdsByPeriod(address, current);
                    setPlayedTracks(tracks.map((t: bigint) => Number(t)));
                }

            } catch (error) {
                console.error('Fel vid hämtning av contract data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchContractData();
    }, [contract, address]);

    const handleSubscribe = async () => {
        if (!contract || !address) return;

        try {
            setIsSubscribing(true);

            // Preflight: undvik revert (och "missing revert data") genom att kolla state först
            const period = await contract.currentPeriod();
            const alreadyPaid = await contract.hasPaidForPeriod(address, period);
            if (alreadyPaid) {
                setHasSubscription(true);
                alert(`You already have an active subscription for period ${Number(period)}! ✅`);
                return;
            }

            const fee = await contract.monthlyFee();
            if (!fee || fee <= 0n) {
                alert('Contract monthly fee is 0 - cannot subscribe.');
                return;
            }

            const tx = await contract.subscribe({ value: fee });

            console.log('Subscribing, transaction hash:', tx.hash);
            await tx.wait();

            alert('Subscription successful! 🎉');
            
            // Uppdatera subscription status
            const hasSub = await contract.hasActiveSubscription(address);
            setHasSubscription(hasSub);

        } catch (error: any) {
            console.error('Subscription error:', error);
            
            if (error.code === 'ACTION_REJECTED' || error.code === 4001) {
                alert('You cancelled the subscription');
            } else if (error.message?.includes('already paid')) {
                alert('You already have an active subscription for this period!');
            } else if (error.message?.includes('incorrect fee')) {
                alert('Incorrect subscription fee. Try refreshing the page to reload the fee from the contract.');
            } else {
                alert(`Subscription failed: ${error.message || 'Unknown error'}`);
            }
        } finally {
            setIsSubscribing(false);
        }
    };

    const handleSettlePeriod = async () => {
        if (!contract || !address || currentPeriod === 0) return;

        try {
            setIsSettling(true);

            // Settle förra perioden (current - 1)
            const periodToSettle = currentPeriod - 1;
            
            console.log(`Settling period ${periodToSettle}...`);
            const tx = await contract.settleListenerPeriod(address, periodToSettle);

            console.log('Settling, transaction hash:', tx.hash);
            await tx.wait();

            alert('Period settled! Payments distributed to artists 💰');

        } catch (error: any) {
            console.error('Settlement error:', error);
            
            if (error.code === 'ACTION_REJECTED' || error.code === 4001) {
                alert('You cancelled the settlement');
            } else if (error.message?.includes('period still active')) {
                alert('Cannot settle current period - wait until it ends!');
            } else if (error.message?.includes('period unpaid')) {
                alert('You did not pay for that period');
            } else if (error.message?.includes('already settled')) {
                alert('This period has already been settled');
            } else {
                alert(`Settlement failed: ${error.message || 'Unknown error'}`);
            }
        } finally {
            setIsSettling(false);
        }
    };

    const calculateNextPaymentDate = () => {
        if (epochStart === 0 || billingPeriod === 0) return 'Loading...';
        
        const nextPeriodStart = epochStart + ((currentPeriod + 1) * billingPeriod);
        return new Date(nextPeriodStart * 1000).toLocaleDateString();
    };

    return (
        <>
            <ModeButton />
            <div className="logo"><a href="/ListenerDashboard">Strictly</a></div>
            <Navbar />
            
            <h1 className="dashboard-title">Balance & Subscription</h1>
            
            <div className="dashboard-layout">
                <div className="main-content">
                    <div className="recommended-tracks">
                        <h2>Premium Subscription</h2>
                        
                        <div className="subscription-box">
                            <div className="subscription-cost-section">
                                <h3 className="subscription-cost-title">Subscription Cost</h3>
                                {loading ? (
                                    <p className="subscription-price">Loading...</p>
                                ) : (
                                    <>
                                        <p className="subscription-price">
                                            {monthlyFee} ETH / {billingPeriod / 86400} days
                                        </p>
                                        <p className="subscription-price-sek">
                                            Period {currentPeriod} {hasSubscription ? '✅ Active' : '❌ Inactive'}
                                        </p>
                                        <p className="subscription-price-sek">
                                            Next payment: {calculateNextPaymentDate()}
                                        </p>
                                    </>
                                )}
                            </div>
                            
                            {hasSubscription ? (
                                <button 
                                    onClick={handleSettlePeriod}
                                    className="subscribe-button"
                                    disabled={isSettling || currentPeriod === 0}
                                >
                                    {isSettling ? 'Settling...' : `Settle Period ${currentPeriod - 1}`}
                                </button>
                            ) : (
                                <button 
                                    onClick={handleSubscribe}
                                    className="subscribe-button"
                                    disabled={isSubscribing || loading}
                                >
                                    {isSubscribing ? 'Subscribing...' : 'Subscribe Now'}
                                </button>
                            )}
                        </div>

                        <div className="distribution-box">
                            <h3 className="distribution-title">How We Distribute Your Money</h3>
                            
                            <div className="distribution-item">
                                <div className="distribution-label">
                                    <span>Artists You Listen To</span>
                                    <span className="distribution-percentage">100%</span>
                                </div>
                                <div className="distribution-bar-container">
                                    <div className="distribution-bar"></div>
                                </div>
                            </div>

                            <p className="distribution-description">
                                100% of your subscription goes directly to the artists you listen to! 
                                Your payment is distributed proportionally based on your listening time. 
                                The more you listen to an artist, the more they earn from your subscription. 
                                All payments are processed transparently on the blockchain.
                            </p>
                        </div>

                        {hasSubscription && playedTracks.length > 0 && (
                            <div className="distribution-box">
                                <h3 className="distribution-title">Your Wrapped - Period {currentPeriod}</h3>
                                <p className="distribution-description">
                                    You've listened to {playedTracks.length} unique tracks this period!
                                </p>
                                <div className="played-tracks-list">
                                    {playedTracks.map((trackId) => (
                                        <div key={trackId} className="played-track-item">
                                            Track ID: {trackId}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        <div className="wallet-info-box">
                            <p className="wallet-info-label">
                                Connected Wallet:
                            </p>
                            <p className="wallet-info-address">
                                {address}
                            </p>
                        </div>
                    </div>
                </div>
                
                <div className="sidebar-player">
                    <div className="streaming-window">
                        <h2>Now Playing...</h2>
                        {currentTrack ? (
                            <>
                                <img src={currentTrack.imageUrl || "/assets/track-1.jpg"} alt={currentTrack.title} />
                                <div className="player-controls">
                                    <button className="from-beginning">⏮</button>
                                    <button className="pause">⏸</button>
                                    <button className="skip">⏭</button>
                                </div>
                                <p className="track-name">{currentTrack.title}</p>
                                <p className="artist-name">{currentTrack.artist}</p>
                                <p className="genre-tag">{currentTrack.genre}</p>
                            </>
                        ) : (
                            <p className="no-track-message">Pick a song to listen to!</p>
                        )}
                    </div>
                </div>
            </div>
        </>
    )
}

export default Balance;
