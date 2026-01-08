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
    const { currentTrack, tracks } = useTracks();
    const { address, isConnected, isLoading: walletLoading, signer } = useWallet();
    const contract = useStrictlyContract(signer);

    const [monthlyFee, setMonthlyFee] = useState<string>('0');
    const [billingPeriod, setBillingPeriod] = useState<number>(0);
    const [currentPeriod, setCurrentPeriod] = useState<number>(0);
    const [hasSubscription, setHasSubscription] = useState<boolean>(false);
    const [playedTracks, setPlayedTracks] = useState<number[]>([]);
    const [playedStats, setPlayedStats] = useState<{ trackId: number; plays: number; title: string; artist: string; percent: number }[]>([]);
    const [isLoadingWrapped, setIsLoadingWrapped] = useState(false);
    const [isSubscribing, setIsSubscribing] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!walletLoading && !isConnected) {
            navigate('/login');
        }
    }, [walletLoading, isConnected, navigate]);

    // Fetch contract data
    useEffect(() => {
        const fetchContractData = async () => {
            if (!contract || !address) {
                setLoading(false);
                return;
            }

            try {
                setLoading(true);

                // Fetch variables from the contract
                const fee = await contract.monthlyFee();
                const period = await contract.BILLING_PERIOD();
                const current = await contract.currentPeriod();
                const hasSub = await contract.hasActiveSubscription(address);

                setMonthlyFee(ethers.formatEther(fee));
                setBillingPeriod(Number(period));
                setCurrentPeriod(Number(current));
                setHasSubscription(hasSub);

                // Fetch played tracks for current period
                if (hasSub) {
                    const tracks = await contract.playedTrackIdsByPeriod(address, current);
                    setPlayedTracks(tracks.map((t: bigint) => Number(t)));
                }
                setPlayedStats([]); // reset so we don't show stale wrapped data if period changes

            } catch (error) {
                console.error('Error fetching contract data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchContractData();
    }, [contract, address]);

    // Fetch plays per track for "Your Wrapped"
    useEffect(() => {
        const fetchWrapped = async () => {
            if (!contract || !address || !hasSubscription || playedTracks.length === 0) {
                setPlayedStats([]);
                return;
            }
            setIsLoadingWrapped(true);
            try {
                const current = await contract.currentPeriod();
                    const trackIds = playedTracks;
                // Fetch total plays for the current period
                const totalPlays = await contract.totalTrackPlays(address, current);
                const total = Number(totalPlays);
                if (total === 0) {
                    setPlayedStats([]);
                    return;
                }

                const stats: { trackId: number; plays: number; title: string; artist: string; percent: number }[] = [];
                for (const id of trackIds) {
                    const playsBn = await contract.playsForTrack(address, current, id);
                    const plays = Number(playsBn);
                    if (plays === 0) continue;
                    const trackMeta = currentTrack?.id === id ? currentTrack : tracks.find((t) => t.id === id);
                    const title = trackMeta?.title || `Track #${id}`;
                    const artist = trackMeta?.artist || 'Unknown artist';
                    const percent = Math.round((plays / total) * 1000) / 10;
                    stats.push({ trackId: id, plays, title, artist, percent });
                }
                stats.sort((a, b) => b.percent - a.percent);
                setPlayedStats(stats);
            } catch (error) {
                console.error('Error fetching wrapped data:', error);
                setPlayedStats([]);
            } finally {
                setIsLoadingWrapped(false);
            }
        };

        fetchWrapped();
    }, [contract, address, hasSubscription, playedTracks]);

    const handleSubscribe = async () => {
        if (!contract || !address) return;

        try {
            setIsSubscribing(true);

            const period = await contract.currentPeriod();
            const alreadyPaid = await contract.hasPaidForPeriod(address, period);
            if (alreadyPaid) {
                setHasSubscription(true);
                alert(`You already have an active subscription for period ${Number(period)}!`);
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

            alert('Subscription successful!');
            
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

    const formatPeriodLabel = (periodValue: number) => {
        return periodValue === 0 ? 'First period' : `Period ${periodValue}`;
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
                        <h2>Your Subscription</h2>
                        
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
                                            {formatPeriodLabel(currentPeriod)} {hasSubscription ? 'Active' : 'Inactive'}
                                        </p>
                                    </>
                                )}
                            </div>
                            
                            {hasSubscription ? (
                                <div className="settle-info">
                                    Periods settle automatically when the period ends.
                                </div>
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

            

                        {hasSubscription && playedTracks.length > 0 && (
                            <div className="distribution-box">
                                <h3 className="distribution-title">Your Wrapped - {formatPeriodLabel(currentPeriod)}</h3>
                                {isLoadingWrapped ? (
                                    <p className="distribution-description">Loading your stats...</p>
                                ) : playedStats.length === 0 ? (
                                    <p className="distribution-description">No play data yet this period.</p>
                                ) : (
                                    <>
                                        <p className="distribution-description">
                                            You've listened to {playedStats.length} tracks this period.
                                        </p>
                                        <div className="played-tracks-list">
                                            {playedStats.map((stat) => (
                                                <div key={stat.trackId} className="played-track-item">
                                                    <div className="played-track-title">
                                                       <u> {stat.title} — {stat.artist}</u>
                                                    </div>
                                                    <div className="played-track-meta">
                                                        {stat.plays} plays • {stat.percent}% of your listening
                                                    </div><br />
                                                </div>
                                            ))}
                                        </div>
                                    </>
                                )}
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
                
             
            </div>
        </>
    )
}

export default Balance;
