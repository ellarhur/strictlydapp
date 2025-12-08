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

    mapping(uint256 => Track) public tracks;
    uint256 public trackCount;
    constructor() {
        trackCount = 0;
        tracks[trackCount] = Track(title:"", artist:"", album:"", genre:"", royaltyWallets: "", releaseDate: 0, block.timestamp);
        trackCount++;
    }

    function addTrack(string memory title, string memory artist, string memory album, string memory genre, string memory royaltyWallets) public {

    }
}