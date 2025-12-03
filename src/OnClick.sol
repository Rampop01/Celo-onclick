// SPDX-License-Identifier: MIT
pragma solidity ^0.8.23;

import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {SafeERC20} from "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {ReentrancyGuard} from "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import {Pausable} from "@openzeppelin/contracts/security/Pausable.sol";

/**
 * @title OnClick
 * @notice Universal payment and donation platform smart contract
 * @dev Enables creators, businesses, and crowdfunders to accept payments via handle-based pages
 */
contract OnClick is Ownable, ReentrancyGuard, Pausable {
    using SafeERC20 for IERC20;

    // ============ Types ============

    enum Role {
        Creator,
        Business,
        Crowdfunder
    }

    struct Page {
        address owner;
        string handle;
        Role role;
        address walletAddress;
        uint256 goal; // 0 means no goal
        uint256 deadline; // 0 means no deadline
        uint256 totalRaised;
        uint256 supporterCount;
        string imageIPFS; // IPFS hash or URL for image
        string descriptionIPFS; // IPFS hash or URL for description
        bool exists;
    }

    struct Payment {
        address supporter;
        uint256 amount;
        uint256 timestamp;
        string message;
        bool isFiatConverted; // true if payment came from fiat on-ramp
    }

    // ============ State Variables ============

    /// @notice USDC token address (set on deployment)
    IERC20 public immutable USDC_TOKEN;

    /// @notice Platform fee percentage (basis points, e.g., 100 = 1%)
    uint256 public platformFeeBps;

    /// @notice Platform fee recipient
    address public feeRecipient;

    /// @notice Mapping from handle to Page struct
    mapping(string => Page) public pages;

    /// @notice Mapping from handle to array of payments
    mapping(string => Payment[]) public payments;

    /// @notice Mapping from handle to array of supporter addresses
    mapping(string => address[]) public supporters;

    /// @notice Mapping to check if address has already supported a page
    mapping(string => mapping(address => bool)) public hasSupported;

    /// @notice Total number of pages created
    uint256 public totalPages;

    // ============ Events ============

    event PageCreated(
        string indexed handle,
        address indexed owner,
        Role role,
        address walletAddress,
        uint256 goal,
        uint256 deadline,
        string imageIPFS,
        string descriptionIPFS
    );

    event PageUpdated(
        string indexed handle,
        address walletAddress,
        uint256 goal,
        uint256 deadline
    );

    event PaymentMade(
        string indexed handle,
        address indexed supporter,
        uint256 amount,
        uint256 timestamp,
        string message,
        bool isFiatConverted
    );

    event FundsWithdrawn(
        string indexed handle,
        address indexed recipient,
        uint256 amount
    );

    event HandleTransferred(
        string indexed handle,
        address indexed oldOwner,
        address indexed newOwner
    );

    // ============ Modifiers ============

    modifier onlyPageOwner(string memory handle) {
        require(pages[handle].exists, "Page does not exist");
        require(pages[handle].owner == msg.sender, "Not page owner");
        _;
    }

    modifier validHandle(string memory handle) {
        require(bytes(handle).length > 0, "Handle cannot be empty");
        require(bytes(handle).length <= 50, "Handle too long");
        require(!pages[handle].exists, "Handle already taken");
        _;
    }

    // ============ Constructor ============

    /**
     * @param _usdcToken Address of USDC token contract
     * @param _platformFeeBps Platform fee in basis points (e.g., 100 = 1%)
     * @param _feeRecipient Address to receive platform fees
     */
    constructor(
        address _usdcToken,
        uint256 _platformFeeBps,
        address _feeRecipient
    ) {
        require(_usdcToken != address(0), "Invalid USDC address");
        require(_platformFeeBps <= 1000, "Fee cannot exceed 10%");
        require(_feeRecipient != address(0), "Invalid fee recipient");

        USDC_TOKEN = IERC20(_usdcToken);
        platformFeeBps = _platformFeeBps;
        feeRecipient = _feeRecipient;
    }

    // ============ Page Management ============

    /**
     * @notice Create a new payment page
     * @param handle Unique handle for the page
     * @param role Role type (Creator, Business, or Crowdfunder)
     * @param walletAddress Address to receive payments
     * @param goal Funding goal (0 for no goal)
     * @param deadline Campaign deadline (0 for no deadline)
     */
    function createPage(
        string memory handle,
        Role role,
        address walletAddress,
        uint256 goal,
        uint256 deadline,
        string memory imageIPFS,
        string memory descriptionIPFS
    ) external whenNotPaused validHandle(handle) {
        require(walletAddress != address(0), "Invalid wallet address");
        require(deadline == 0 || deadline > block.timestamp, "Invalid deadline");

        require(bytes(imageIPFS).length > 0, "Image IPFS hash required");
        require(bytes(descriptionIPFS).length > 0, "Description IPFS hash required");
        pages[handle] = Page({
            owner: msg.sender,
            handle: handle,
            role: role,
            walletAddress: walletAddress,
            goal: goal,
            deadline: deadline,
            totalRaised: 0,
            supporterCount: 0,
            imageIPFS: imageIPFS,
            descriptionIPFS: descriptionIPFS,
            exists: true
        });

        totalPages++;

        emit PageCreated(handle, msg.sender, role, walletAddress, goal, deadline, imageIPFS, descriptionIPFS);
    }

    /**
     * @notice Update page settings (only owner)
     * @param handle Page handle
     * @param walletAddress New wallet address to receive payments
     * @param goal New funding goal (0 to remove goal)
     * @param deadline New deadline (0 to remove deadline)
     */
    function updatePage(
        string memory handle,
        address walletAddress,
        uint256 goal,
        uint256 deadline
    ) external onlyPageOwner(handle) {
        require(walletAddress != address(0), "Invalid wallet address");
        require(deadline == 0 || deadline > block.timestamp, "Invalid deadline");

        pages[handle].walletAddress = walletAddress;
        pages[handle].goal = goal;
        pages[handle].deadline = deadline;

        emit PageUpdated(handle, walletAddress, goal, deadline);
    }

    /**
     * @notice Transfer page ownership
     * @param handle Page handle
     * @param newOwner New owner address
     */
    function transferPageOwnership(
        string memory handle,
        address newOwner
    ) external onlyPageOwner(handle) {
        require(newOwner != address(0), "Invalid new owner");

        address oldOwner = pages[handle].owner;
        pages[handle].owner = newOwner;

        emit HandleTransferred(handle, oldOwner, newOwner);
    }

    /**
     * @notice Check if a handle is available
     * @param handle Handle to check
     * @return available True if handle is available
     */
    function isHandleAvailable(string memory handle) external view returns (bool) {
        return !pages[handle].exists;
    }

    // ============ Payment Functions ============

    /**
     * @notice Make a payment to a page (crypto payment)
     * @param handle Page handle to support
     * @param amount Amount in USDC (with decimals)
     * @param message Optional message from supporter
     */
    function makePayment(
        string memory handle,
        uint256 amount,
        string memory message
    ) external nonReentrant whenNotPaused {
        require(pages[handle].exists, "Page does not exist");
        require(amount > 0, "Amount must be greater than 0");
        require(
            pages[handle].deadline == 0 || block.timestamp <= pages[handle].deadline,
            "Campaign deadline has passed"
        );

        // Transfer USDC from supporter to contract
        USDC_TOKEN.safeTransferFrom(msg.sender, address(this), amount);

        // Calculate platform fee
        uint256 fee = (amount * platformFeeBps) / 10000;
        uint256 netAmount = amount - fee;

        // Transfer fee to platform
        if (fee > 0) {
            USDC_TOKEN.safeTransfer(feeRecipient, fee);
        }

        // Transfer net amount to page owner's wallet
        USDC_TOKEN.safeTransfer(pages[handle].walletAddress, netAmount);

        // Update page stats
        if (!hasSupported[handle][msg.sender]) {
            pages[handle].supporterCount++;
            supporters[handle].push(msg.sender);
            hasSupported[handle][msg.sender] = true;
        }

        pages[handle].totalRaised += amount;

        // Record payment
        payments[handle].push(Payment({
            supporter: msg.sender,
            amount: amount,
            timestamp: block.timestamp,
            message: message,
            isFiatConverted: false
        }));

        emit PaymentMade(handle, msg.sender, amount, block.timestamp, message, false);
    }

    /**
     * @notice Record a payment from fiat on-ramp (called by backend/oracle)
     * @param handle Page handle to support
     * @param supporter Supporter address
     * @param amount Amount in USDC (with decimals)
     * @param message Optional message from supporter
     */
    function recordFiatPayment(
        string memory handle,
        address supporter,
        uint256 amount,
        string memory message
    ) external onlyOwner nonReentrant whenNotPaused {
        require(pages[handle].exists, "Page does not exist");
        require(amount > 0, "Amount must be greater than 0");
        require(
            pages[handle].deadline == 0 || block.timestamp <= pages[handle].deadline,
            "Campaign deadline has passed"
        );

        // Calculate platform fee
        uint256 fee = (amount * platformFeeBps) / 10000;
        uint256 netAmount = amount - fee;

        // Transfer fee to platform (assuming USDC is already in contract from fiat conversion)
        if (fee > 0) {
            USDC_TOKEN.safeTransfer(feeRecipient, fee);
        }

        // Transfer net amount to page owner's wallet
        USDC_TOKEN.safeTransfer(pages[handle].walletAddress, netAmount);

        // Update page stats
        if (!hasSupported[handle][supporter]) {
            pages[handle].supporterCount++;
            supporters[handle].push(supporter);
            hasSupported[handle][supporter] = true;
        }

        pages[handle].totalRaised += amount;

        // Record payment
        payments[handle].push(Payment({
            supporter: supporter,
            amount: amount,
            timestamp: block.timestamp,
            message: message,
            isFiatConverted: true
        }));

        emit PaymentMade(handle, supporter, amount, block.timestamp, message, true);
    }

    // ============ View Functions ============

    /**
     * @notice Get page data
     * @param handle Page handle
     * @return page Page struct
     */
    function getPage(string memory handle) external view returns (Page memory) {
        require(pages[handle].exists, "Page does not exist");
        return pages[handle];
    }

    /**
     * @notice Get page progress percentage (0-10000, where 10000 = 100%)
     * @param handle Page handle
     * @return progress Progress in basis points
     */
    function getPageProgress(string memory handle) external view returns (uint256) {
        Page memory page = pages[handle];
        if (!page.exists || page.goal == 0) {
            return 0;
        }
        return (page.totalRaised * 10000) / page.goal;
    }

    /**
     * @notice Get payment count for a page
     * @param handle Page handle
     * @return count Number of payments
     */
    function getPaymentCount(string memory handle) external view returns (uint256) {
        return payments[handle].length;
    }

    /**
     * @notice Get payment at index
     * @param handle Page handle
     * @param index Payment index
     * @return payment Payment struct
     */
    function getPayment(string memory handle, uint256 index) external view returns (Payment memory) {
        require(index < payments[handle].length, "Invalid payment index");
        return payments[handle][index];
    }

    /**
     * @notice Get all payments for a page (use with caution for large arrays)
     * @param handle Page handle
     * @return All payments for the page
     */
    function getPayments(string memory handle) external view returns (Payment[] memory) {
        return payments[handle];
    }

    /**
     * @notice Get supporter count for a page
     * @param handle Page handle
     * @return count Number of unique supporters
     */
    function getSupporterCount(string memory handle) external view returns (uint256) {
        return pages[handle].supporterCount;
    }

    /**
     * @notice Get all supporters for a page
     * @param handle Page handle
     * @return All supporter addresses
     */
    function getSupporters(string memory handle) external view returns (address[] memory) {
        return supporters[handle];
    }

    /**
     * @notice Check if campaign goal is reached
     * @param handle Page handle
     * @return reached True if goal is reached
     */
    function isGoalReached(string memory handle) external view returns (bool) {
        Page memory page = pages[handle];
        if (!page.exists || page.goal == 0) {
            return false;
        }
        return page.totalRaised >= page.goal;
    }

    /**
     * @notice Check if campaign deadline has passed
     * @param handle Page handle
     * @return passed True if deadline has passed
     */
    function isDeadlinePassed(string memory handle) external view returns (bool) {
        Page memory page = pages[handle];
        if (!page.exists || page.deadline == 0) {
            return false;
        }
        return block.timestamp > page.deadline;
    }

    // ============ Admin Functions ============

    /**
     * @notice Update platform fee
     * @param newFeeBps New fee in basis points
     */
    function setPlatformFee(uint256 newFeeBps) external onlyOwner {
        require(newFeeBps <= 1000, "Fee cannot exceed 10%");
        platformFeeBps = newFeeBps;
    }

    /**
     * @notice Update fee recipient
     * @param newFeeRecipient New fee recipient address
     */
    function setFeeRecipient(address newFeeRecipient) external onlyOwner {
        require(newFeeRecipient != address(0), "Invalid fee recipient");
        feeRecipient = newFeeRecipient;
    }

    /**
     * @notice Pause contract (emergency only)
     */
    function pause() external onlyOwner {
        _pause();
    }

    /**
     * @notice Unpause contract
     */
    function unpause() external onlyOwner {
        _unpause();
    }

    /**
     * @notice Emergency withdraw (only owner, for stuck tokens)
     * @param token Token address (0x0 for ETH)
     * @param to Recipient address
     * @param amount Amount to withdraw
     */
    function emergencyWithdraw(
        address token,
        address to,
        uint256 amount
    ) external onlyOwner {
        require(to != address(0), "Invalid recipient");
        if (token == address(0)) {
            payable(to).transfer(amount);
        } else {
            IERC20(token).safeTransfer(to, amount);
        }
    }
}

