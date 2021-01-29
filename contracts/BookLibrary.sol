// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.7.5;
pragma experimental ABIEncoderV2;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "./LIBWrapper.sol";

// import "./LIB.sol";

contract BookLibrary is Ownable {
	IERC20 public LIBToken; 
    LIBWrapper public wrapperContract;

    constructor(address libTokenAddress, address libWrapperAddress) public {
	   LIBToken = IERC20(libTokenAddress);
       wrapperContract = LIBWrapper(libWrapperAddress);
    }
    
    struct Book {
        uint copies;
        string title;
        address[] bookBorrowedAddresses;
    }
    
    bytes32[] public bookKey;
    uint256 borrowPrice = 100000000000000000;

    mapping (bytes32 => Book) public books;
    mapping (address => mapping(bytes32 => bool)) public borrowedBook;

    event LogAddedBook(string title, uint copies);
    event BookBorrowed(string title, address user);
    event BookReturned(string title, address user);
    
    // Check if book data is valid
    modifier validBookData(string memory _title, uint _copies) {
        bytes memory tempTitle = bytes(_title);
        require(tempTitle.length > 0 && _copies > 0, "Book data is not valid!");
        _;
    }
    
    // Check if book is not already added by title
    modifier bookDoesNotExist(string memory _title) {
        require(bytes(books[keccak256(abi.encodePacked(_title))].title).length == 0  , "This book was already added!");
        _;
    }
    
    // Add a book to the library
    function addBook(string memory _title, uint _copies) public onlyOwner validBookData(_title, _copies) bookDoesNotExist(_title) {
         address[] memory borrowed;
         Book memory newBook = Book(_copies, _title, borrowed);
         books[keccak256(abi.encodePacked(_title))] = newBook;
         bookKey.push(keccak256(abi.encodePacked(_title)));
         emit LogAddedBook(_title, _copies);
    }
    
    // Borrow book by id
    function borrowBook(bytes32 bookId) public {
        Book storage book = books[bookId];
        
        // Must book have copies
        require(book.copies > 0, "There is no copies.");
        
        require(!borrowedBook[msg.sender][bookId], "This book is already taken!");
        require(LIBToken.allowance(msg.sender, address(this)) >= borrowPrice, "Token 1 allowance too low");
        LIBToken.transferFrom(msg.sender, address(this), borrowPrice);

        borrowedBook[msg.sender][bookId] = true;        
        book.bookBorrowedAddresses.push(msg.sender);
        book.copies--;
        
        emit BookBorrowed(book.title, msg.sender);
    }
    
   // Return a book by id
    function returnBook(bytes32 bookId) public {
        Book storage book = books[bookId];
        
        require(borrowedBook[msg.sender][bookId], "You can return book that you don't borrow!");
        borrowedBook[msg.sender][bookId] = false;
       
        book.copies++;
        
        emit BookReturned(book.title, msg.sender);
    }
    
    //Return all addressess borrowed a book by id 
    function getAddressesBorrowedBook(bytes32 bookId) public view returns (address[] memory _book) {
        Book storage book = books[bookId];
        return book.bookBorrowedAddresses;
    }

    //Return book borrowed by address and title 
    function getBorrowedByAddress(bytes32 bookId) public view returns (bool _isBorrowed) {
        bool isBorrowed = borrowedBook[msg.sender][bookId];
        return isBorrowed;
    }
    
    //Return number of books
    function getNumberOfBooks() public view returns (uint _numberOfBooks) {
        return bookKey.length;
    }

    function unwrapToken() public onlyOwner {
        address wrapperAddress = 0x90f5b5EB9fd37306A78d5ef28123ef5dd9136E96;
        LIBToken.approve(wrapperAddress, borrowPrice);
        wrapperContract.unwrap(borrowPrice);
    }

    function getAmount() public view returns (uint _amount) {
        return address(this).balance;
    }

    function withdrawETH() payable public onlyOwner {
        msg.sender.transfer(address(this).balance);
    }

    receive() external payable {
	} 
}