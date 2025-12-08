// SPDX-License-Identifier: MIT
pragma solidity ^0.8.30;

contract Strictly {
        struct Track {
        string title;
        string artist;
        string album;
        string genre;
        string royaltyWallets;
        uint256 releaseDate;
    }
        address public owner;
        modifier onlyOwner() {
            require(msg.sender == owner, "Only owners can call this function");
        }

    mapping(uint256 => Track) public tracks;
    uint256 public trackCount;
    constructor() {
        trackCount = 0;
        tracks[trackCount] = Track(title:"", artist:"", album:"", genre:"", royaltyWallets: "", releaseDate: 0, block.timestamp);
        trackCount++;
    }
    event TrackAdded(uint256 trackId, string title, string artist, string album, string genre, string royaltyWallets, uint256 releaseDate)
    event TrackRemoved(uint256 trackId);
    event TrackPlayed(uint256 trackId, address indexed listener, uint256 indexed timestamp);

    function addTrack(string memory title, string memory artist, string memory album, string memory genre, string memory royaltyWallets) public {

    }

    function getTrack(uint256 trackId) public view returns (Track memory) {
        return tracks[trackId];
    }

    function payRoyalties(uint256 trackId, address listener) public {
        require(tracks[trackId].releaseDate > 0, "Track not released");
        require(tracks[trackId].royaltyWallets.length > 0, "No royalty wallets defined");

        string[] memory royaltyWallets = split(tracks)
    }


}