// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.20;

import { IERC20 } from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import { IConditionalTokens } from "./interfaces/IConditionalTokens.sol";
import { ConditionalTokens } from "./gnosis/ConditionalTokens.sol";
import { FixedProductMarketMaker } from "./gnosis/FixedProductMarketMaker.sol";
import { IFixedProductMarketMakerFactory } from "./interfaces/IFixedProductMarketMakerFactory.sol";

contract ChallengeManager {

    uint256 public constant MAX_CHALLENGERS = 2;
    uint256 public constant CHALLENGE_DURATION = 1 weeks;

    struct Track {
        uint256 id;
        string trackName;
        string artist;
        string cid;
    }

    struct Challenge {
        uint256 id;
        uint256 startingTime;
        uint256 endingTime;
        uint256 winnerTrackId;
        address marketMaker;
        bytes32 gameId;
        bytes32 conditionId;
        uint256[] positionIds;
        uint256[] partitions;
        bytes32[] collectionIds;
        address[] players;
        Track[] tracks;
        string criteria;
    }

    uint256 _nextTrackId = 1;
    uint256 _nextChallengeId;

    uint256 public immutable arenaStartTime;
    address public oracle;
    IERC20 public collateralToken;
    IConditionalTokens public conditionalTokens;
    IFixedProductMarketMakerFactory public fixedProductMarketMakerFactory;

    mapping (uint256 => Track) tracks;
    mapping (uint256 => Challenge) challenges;

    event JoinedChallenge(
        uint256 challengeId, 
        uint256 trackId,
        address player
    );

    event WinnerSelected(
        uint256 challengeId,
        uint256 trackId
    );

    modifier onlyOracle() {
        require(msg.sender == oracle, "Only oracle");
        _;
    }

    modifier gameExists(uint256 _challengeId) {
        require(_challengeId < _nextChallengeId, "Game does not exist");
        _;
    }

    modifier gameEnded(uint256 _challengeId) {
        require(challenges[_challengeId].endingTime < block.timestamp, "Game has not ended");
        _;
    }

    constructor(
        uint256 _arenaStartTime,
        address _oracle,
        address _conditionalTokens,
        address _collateralToken,
        address _fixedProductMarketMakerFactory
    ) {
        arenaStartTime = _arenaStartTime;
        oracle = _oracle;
        collateralToken = IERC20(_collateralToken);
        conditionalTokens = IConditionalTokens(_conditionalTokens);
        fixedProductMarketMakerFactory = IFixedProductMarketMakerFactory(_fixedProductMarketMakerFactory);
    }

    function joinChallenge(
        string calldata trackName,
        string calldata artist,
        string calldata cid
    ) external {
        Track memory track = Track(_nextTrackId, trackName, artist, cid);
        Challenge storage challenge = challenges[_nextChallengeId];
        tracks[_nextTrackId] = track;
        _nextTrackId++;

        challenge.players.push(msg.sender);
        challenge.tracks.push(track);

        if (challenge.players.length != MAX_CHALLENGERS) {
            challenge.id = _nextChallengeId;
            challenge.gameId = bytes32(_nextChallengeId);            
            challenge.startingTime = arenaStartTime + (_nextChallengeId * CHALLENGE_DURATION);
            challenge.endingTime = challenge.startingTime + CHALLENGE_DURATION;

            uint256 numberOfOutcomes = MAX_CHALLENGERS;
            challenge.conditionId = conditionalTokens.getConditionId(
                address(this), 
                challenge.gameId, 
                numberOfOutcomes
            );
            conditionalTokens.prepareCondition(address(this), challenge.gameId, numberOfOutcomes);

            for (uint8 i = 0; i < numberOfOutcomes; i++) {
                uint256 indexSet = 1 << i;

                bytes32 collectionId = conditionalTokens.getCollectionId(
                    bytes32(0), 
                    challenge.conditionId, 
                    indexSet
                );
                challenge.collectionIds.push(collectionId);

                uint256 positionId = conditionalTokens.getPositionId(collateralToken, collectionId);
                challenge.positionIds.push(positionId);

                challenge.partitions.push(indexSet);
            }

            bytes32[] memory conditionIds = new bytes32[](1);
            conditionIds[0] = challenge.conditionId;
            challenge.marketMaker = address(fixedProductMarketMakerFactory.createFixedProductMarketMaker(
                ConditionalTokens(address(conditionalTokens)), 
                collateralToken, 
                conditionIds,
                0
            ));
        } else {
            _nextChallengeId++;
        }

        emit JoinedChallenge(_nextChallengeId, _nextTrackId, msg.sender);
    }

    function selectWinner(
        uint256 challengeId, 
        uint256 trackId,
        string calldata criteria
    ) 
        external 
        onlyOracle 
        gameExists(challengeId) 
        gameEnded(challengeId) 
    {
        Challenge storage challenge = challenges[challengeId];
        challenge.winnerTrackId = trackId;
        challenge.criteria = criteria;

        uint8 winnerTrackIndex = 0;
        for (uint8 i = 0; i < challenge.tracks.length; i++) {
            if (challenge.tracks[i].id == trackId) {
                winnerTrackIndex = i;
                break;
            }
        }

        uint256[] memory payouts = new uint256[](MAX_CHALLENGERS);
        payouts[winnerTrackIndex] = 1;
        conditionalTokens.reportPayouts(challenge.gameId, payouts);

        emit WinnerSelected(challengeId, trackId);
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

    function getChallenge(uint256 challengeId) public view returns (Challenge memory) {
        return challenges[challengeId];
    }

    function getTrack(uint256 trackId) public view returns (Track memory) {
        return tracks[trackId];
    }

    function getWinner(uint256 challengeId) public view returns (Track memory) {
        uint256 winnerTrackId = challenges[challengeId].winnerTrackId;
        return tracks[winnerTrackId];
    }
}