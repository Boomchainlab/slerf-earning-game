// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "./SLERFToken.sol";

contract SLERFGame is Ownable, ReentrancyGuard, Pausable {
    SLERFToken public slerfToken;
    
    uint256 public constant TOKENS_PER_POINT = 0.1 * 10**18; // 0.1 SLERF per point
    uint256 public constant MAX_SCORE_PER_GAME = 10000; // Prevent unrealistic scores
    uint256 public constant CLAIM_COOLDOWN = 1 hours; // Prevent spam claiming
    
    struct PlayerStats {
        uint256 totalScore;
        uint256 gamesPlayed;
        uint256 tokensEarned;
        uint256 tokensClaimed;
        uint256 lastClaimTime;
        uint256 highScore;
    }
    
    struct GameSession {
        uint256 score;
        uint256 timestamp;
        bool claimed;
    }
    
    mapping(address => PlayerStats) public playerStats;
    mapping(address => GameSession[]) public playerSessions;
    mapping(address => uint256) public pendingTokens;
    
    address[] public leaderboard;
    mapping(address => uint256) public leaderboardIndex;
    
    event GamePlayed(address indexed player, uint256 score, uint256 tokensEarned);
    event TokensClaimed(address indexed player, uint256 amount);
    event LeaderboardUpdated(address indexed player, uint256 newHighScore);
    
    constructor(address _slerfToken) {
        slerfToken = SLERFToken(_slerfToken);
    }
    
    function submitScore(uint256 _score) external whenNotPaused nonReentrant {
        require(_score > 0 && _score <= MAX_SCORE_PER_GAME, "Invalid score");
        
        PlayerStats storage stats = playerStats[msg.sender];
        
        // Calculate tokens earned
        uint256 tokensEarned = _score * TOKENS_PER_POINT;
        
        // Update player stats
        stats.totalScore += _score;
        stats.gamesPlayed += 1;
        stats.tokensEarned += tokensEarned;
        
        // Update high score and leaderboard
        if (_score > stats.highScore) {
            stats.highScore = _score;
            _updateLeaderboard(msg.sender, _score);
            emit LeaderboardUpdated(msg.sender, _score);
        }
        
        // Add to pending tokens
        pendingTokens[msg.sender] += tokensEarned;
        
        // Record game session
        playerSessions[msg.sender].push(GameSession({
            score: _score,
            timestamp: block.timestamp,
            claimed: false
        }));
        
        emit GamePlayed(msg.sender, _score, tokensEarned);
    }
    
    function claimTokens() external whenNotPaused nonReentrant {
        PlayerStats storage stats = playerStats[msg.sender];
        require(block.timestamp >= stats.lastClaimTime + CLAIM_COOLDOWN, "Claim cooldown active");
        
        uint256 amount = pendingTokens[msg.sender];
        require(amount > 0, "No tokens to claim");
        
        // Reset pending tokens
        pendingTokens[msg.sender] = 0;
        stats.tokensClaimed += amount;
        stats.lastClaimTime = block.timestamp;
        
        // Mark sessions as claimed
        GameSession[] storage sessions = playerSessions[msg.sender];
        for (uint256 i = 0; i < sessions.length; i++) {
            if (!sessions[i].claimed) {
                sessions[i].claimed = true;
            }
        }
        
        // Mint tokens to player
        slerfToken.mint(msg.sender, amount);
        
        emit TokensClaimed(msg.sender, amount);
    }
    
    function _updateLeaderboard(address player, uint256 score) internal {
        // If player not in leaderboard, add them
        if (leaderboardIndex[player] == 0 && (leaderboard.length == 0 || leaderboard[0] != player)) {
            leaderboard.push(player);
            leaderboardIndex[player] = leaderboard.length;
        }
        
        // Simple bubble sort for top scores (efficient for small leaderboards)
        uint256 playerIndex = leaderboardIndex[player] - 1;
        
        // Move player up if they have a higher score
        while (playerIndex > 0 && playerStats[leaderboard[playerIndex - 1]].highScore < score) {
            // Swap positions
            address temp = leaderboard[playerIndex];
            leaderboard[playerIndex] = leaderboard[playerIndex - 1];
            leaderboard[playerIndex - 1] = temp;
            
            // Update indices
            leaderboardIndex[leaderboard[playerIndex]] = playerIndex + 1;
            leaderboardIndex[leaderboard[playerIndex - 1]] = playerIndex;
            
            playerIndex--;
        }
    }
    
    function getLeaderboard(uint256 limit) external view returns (address[] memory players, uint256[] memory scores) {
        uint256 length = leaderboard.length > limit ? limit : leaderboard.length;
        players = new address[](length);
        scores = new uint256[](length);
        
        for (uint256 i = 0; i < length; i++) {
            players[i] = leaderboard[i];
            scores[i] = playerStats[leaderboard[i]].highScore;
        }
    }
    
    function getPlayerSessions(address player) external view returns (GameSession[] memory) {
        return playerSessions[player];
    }
    
    function getPlayerStats(address player) external view returns (PlayerStats memory) {
        return playerStats[player];
    }
    
    function pause() external onlyOwner {
        _pause();
    }
    
    function unpause() external onlyOwner {
        _unpause();
    }
    
    function emergencyWithdraw() external onlyOwner {
        // Emergency function to withdraw any accidentally sent tokens
        uint256 balance = slerfToken.balanceOf(address(this));
        if (balance > 0) {
            slerfToken.transfer(owner(), balance);
        }
    }
}
