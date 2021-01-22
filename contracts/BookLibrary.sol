// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.7.0;

import "@openzeppelin/contracts/access/Ownable.sol";

contract BookLibrary is Ownable {
    
    struct Book {
        uint copies;
        string title;
        address[] bookBorrowedAddresses;
    }
    
    bytes32[] public bookKey;

    mapping (bytes32 => Book) public books;
    mapping(address => mapping(bytes32 => bool)) borrowedBook;

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
    
    //Return number of books
    function getNumberOfBooks() public view returns (uint _numberOfBooks) {
        return bookKey.length;
    }
    
}