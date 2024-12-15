// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.20;

import { IERC20 } from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import { IConditionalTokens } from "./interfaces/IConditionalTokens.sol";

contract ChallengeManager {

    uint256 public constant MAX_CHALLENGERS = 2;
    uint256 public constant CHALLENGE_DURATION = 1 weeks;

    struct Track {
        string name;
        string artist;
        string cid;
    }

    struct Challenge {
        uint256 startingTime;
        uint256 endingTime;
        bytes32 gameId;
        bytes32 conditionId;
        uint256[] positionIds;
        uint256[] partitions;
        bytes32[] collectionIds;
        address[] players;
        Track[] tracks;
    }

    uint256 _nextTrackId;
    uint256 _nextChallengeId;

    uint256 public immutable arenaStartTime;
    IERC20 public token;
    IConditionalTokens public conditionalTokens;

    mapping (uint256 => Track) tracks;
    mapping (uint256 => Challenge) challenges;

    constructor(
        uint256 _arenaStartTime,
        address _conditionalTokens,
        address _token
    ) {
        arenaStartTime = _arenaStartTime;
        token = IERC20(_token);
        conditionalTokens = IConditionalTokens(_conditionalTokens);
    }

    function joinChallenge(Track calldata track) public {
        Challenge storage challenge = challenges[_nextChallengeId];
        tracks[_nextTrackId] = track;
        _nextTrackId++;

        challenge.players.push(msg.sender);
        challenge.tracks.push(track);

        if (challenge.players.length != MAX_CHALLENGERS) {
            challenge.gameId = bytes32(_nextChallengeId);            
            challenge.startingTime = arenaStartTime + (_nextChallengeId * CHALLENGE_DURATION);
            challenge.endingTime = challenge.startingTime + CHALLENGE_DURATION;

            uint256 numberOfOutcomes = MAX_CHALLENGERS;
            challenge.conditionId = conditionalTokens.getConditionId(address(this), challenge.gameId, numberOfOutcomes);
            conditionalTokens.prepareCondition(address(this), challenge.gameId, numberOfOutcomes);

            for (uint8 i = 0; i < numberOfOutcomes; i++) {
                uint256 indexSet = 1 << i;

                bytes32 collectionId = conditionalTokens.getCollectionId(bytes32(0), challenge.conditionId, indexSet);
                challenge.collectionIds.push(collectionId);

                uint256 positionId = conditionalTokens.getPositionId(token, collectionId);
                challenge.positionIds.push(positionId);

                challenge.partitions.push(indexSet);
            }
        } else {
            _nextChallengeId++;
        }
    }

    function numberOfChallenges() public view returns (uint256) {
        return _nextChallengeId;
    }

    function currentChallengeId() public view returns (uint256) {
        return (block.timestamp - arenaStartTime) / CHALLENGE_DURATION;
    }

    function getCurrentChallenge() public view returns (Challenge memory) {
        return challenges[currentChallengeId()];
    }

    function getChallenge(uint256 _challengeId) public view returns (Challenge memory) {
        return challenges[_challengeId];
    }

    function getTrack(uint256 _trackId) public view returns (Track memory) {
        return tracks[_trackId];
    }
}