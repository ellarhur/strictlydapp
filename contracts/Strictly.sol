// SPDX-License-Identifier: MIT
pragma solidity ^0.8.30;
contract Strictly {
    uint64 public constant BILLING_PERIOD = 30 days;
    uint64 public immutable epochStart;
    uint256 public monthlyFee;

    struct Track {
        string title;
        string artist;
        string album;
        string genre;
        address payable royaltyWallet;
        uint256 releaseDate;
        address uploader;
        bool exists;
    }

    uint256 public trackCount;

    mapping(uint256 => Track) private _tracks;

    mapping(address => mapping(uint64 => bool)) public hasPaidForPeriod;
    mapping(address => mapping(uint64 => uint256)) public periodPayment;
    mapping(address => mapping(uint64 => uint256)) public totalTrackPlays;
    mapping(address => mapping(uint64 => bool)) public periodSettled;

    mapping(address => mapping(uint64 => uint256[])) private periodTrackIds;
    mapping(address => mapping(uint64 => mapping(uint256 => uint256))) private trackPlayCount;
    mapping(address => mapping(uint64 => mapping(uint256 => bool))) private trackAlreadyAddedToPeriod;

    event TrackAdded(
        uint256 indexed trackId,
        string title,
        string artist,
        address indexed royaltyWallet,
        address indexed uploader,
        uint256 releaseDate
    );
    event TrackPlayed(uint256 indexed trackId, address indexed listener, uint64 indexed period, uint256 timestamp);
    event SubscriptionPaid(address indexed listener, uint64 indexed period, uint256 amount);
    event ListenerPeriodSettled(
        address indexed listener,
        uint64 indexed period,
        uint256 totalDistributed,
        uint256 refundedToListener
    );

    constructor(uint256 _monthlyFee){
        require(_monthlyFee > 0, "Strictly: monthly fee required");
        monthlyFee = _monthlyFee;
        epochStart = uint64(block.timestamp);
    }

    function addTrack(
        string memory title,
        string memory artist,
        string memory album,
        string memory genre,
        address payable royaltyWallet,
        uint256 releaseDate
    ) external returns (uint256 trackId) {
        require(bytes(title).length > 0, "Strictly: title required");
        require(royaltyWallet != address(0), "Strictly: wallet required");

        trackId = trackCount;

        _tracks[trackId] = Track({
            title: title,
            artist: artist,
            album: album,
            genre: genre,
            royaltyWallet: royaltyWallet,
            releaseDate: releaseDate == 0 ? block.timestamp : releaseDate,
            uploader: msg.sender,
            exists: true
        });

        unchecked {
            trackCount = trackCount + 1;
        }

        emit TrackAdded(
            trackId,
            title,
            artist,
            royaltyWallet,
            msg.sender,
            _tracks[trackId].releaseDate
        );
    }

    function getTrack(uint256 trackId) external view returns (Track memory) {
        Track memory track = _tracks[trackId];
        require(track.exists, "I'm sorry, the track you're looking for doesn't exist");
        return track;
    }

    function currentPeriod() public view returns (uint64) {
        return uint64((block.timestamp - epochStart) / BILLING_PERIOD);
    }

    function periodBounds(uint64 period) external view returns (uint64 start, uint64 end) {
        start = epochStart + period * BILLING_PERIOD;
        end = start + BILLING_PERIOD;
    }

    function playedTrackIdsByPeriod(address listener, uint64 period) external view returns (uint256[] memory) {
        uint256[] storage storedIds = periodTrackIds[listener][period];
        uint256 length = storedIds.length;
        uint256[] memory ids = new uint256[](length);
        for (uint256 i = 0; i < length; i++) {
            ids[i] = storedIds[i];
        }
        return ids;
    }

    function playsForTrack(address listener, uint64 period, uint256 trackId) external view returns (uint256) {
        return trackPlayCount[listener][period][trackId];
    }

    function hasActiveSubscription(address listener) public view returns (bool) {
        return hasPaidForPeriod[listener][currentPeriod()];
    }

    function subscribe() external payable {
        uint64 period = currentPeriod();
        require(!hasPaidForPeriod[msg.sender][period], "Strictly: already paid");
        require(msg.value == monthlyFee, "Strictly: incorrect fee");

        hasPaidForPeriod[msg.sender][period] = true;
        periodPayment[msg.sender][period] = msg.value;

        emit SubscriptionPaid(msg.sender, period, msg.value);
    }

    function playTrack(uint256 trackId) external {
        Track storage track = _tracks[trackId];
        require(track.exists, "Strictly: track missing");
        require(track.releaseDate <= block.timestamp, "Strictly: track not released");

        uint64 period = currentPeriod();
        require(hasPaidForPeriod[msg.sender][period], "Strictly: subscription inactive");

        totalTrackPlays[msg.sender][period] += 1;

        if (!trackAlreadyAddedToPeriod[msg.sender][period][trackId]) {
            periodTrackIds[msg.sender][period].push(trackId);
            trackAlreadyAddedToPeriod[msg.sender][period][trackId] = true;
        }

        trackPlayCount[msg.sender][period][trackId] += 1;

        emit TrackPlayed(trackId, msg.sender, period, block.timestamp);
    }

    function settleListenerPeriod(address listener, uint64 period) external {
        require(listener != address(0), "Strictly: listener required");
        require(period < currentPeriod(), "Strictly: period still active");
        require(hasPaidForPeriod[listener][period], "Strictly: period unpaid");
        require(!periodSettled[listener][period], "Strictly: already settled");

        periodSettled[listener][period] = true;

        uint256 amountPaid = periodPayment[listener][period];
        uint256 totalPlays = totalTrackPlays[listener][period];

        uint256 distributed;
        uint256[] storage tracksForPeriod = periodTrackIds[listener][period];

        if (totalPlays == 0) {
            if (amountPaid > 0) {
                _sendValue(payable(listener), amountPaid);
            }
            emit ListenerPeriodSettled(listener, period, 0, amountPaid);
            return;
        }

        uint256 tracksLength = tracksForPeriod.length;
        for (uint256 i = 0; i < tracksLength; i++) {
            uint256 trackId = tracksForPeriod[i];
            uint256 plays = trackPlayCount[listener][period][trackId];

            if (plays == 0) {
                continue;
            }

            Track storage track = _tracks[trackId];
            if (!track.exists || track.royaltyWallet == address(0)) {
                continue;
            }

            uint256 payout = (amountPaid * plays) / totalPlays;
            if (payout > 0) {
                distributed += payout;
                _sendValue(track.royaltyWallet, payout);
            }
        }

        uint256 remainder = amountPaid - distributed;
        if (remainder > 0) {
            _sendValue(payable(listener), remainder);
        }

        emit ListenerPeriodSettled(listener, period, distributed, remainder);
    }

    function _sendValue(address payable recipient, uint256 amount) private {
        if (amount == 0) {
            return;
        }
        (bool success, ) = recipient.call{value: amount}("");
        require(success, "Strictly: transfer failed");
    }
}