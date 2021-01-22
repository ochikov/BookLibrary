const { ethers } = require("ethers");
const BookLibrary = require('./build/BookLibrary.json');
const config = require('./config');

const run = async function() {
    const privateKey = config.ropstenPrivateKey; // First account from the 10th accounts created with ganache
    const contractAddress = config.ropstenContractAddress;
    const infuraApiKey = config.infuraApiKey;
    const provider = new ethers.providers.InfuraProvider('ropsten', infuraApiKey);
	const wallet = new ethers.Wallet(privateKey, provider);
    const bookLibrary = new ethers.Contract(contractAddress, BookLibrary.abi, wallet);

    // Add book to the library
    
    // const createBookTransaction = await bookLibrary.addBook("Test1", 25);
    // console.log("Add Book Transaction:", createBookTransaction.hash);
    // const createBookTransactionReceipt = await createBookTransaction.wait();
	// if (createBookTransactionReceipt.status != 1) {
	// 	console.log("Transaction was not successful")
	// 	return 
    // }
    
    // Get total number of books;
    const getAllBooksTransaction = await bookLibrary.getNumberOfBooks();
    const numberOfBooks = getAllBooksTransaction.toString();
    console.log('TOTAL NUMBER OF BOOKS', numberOfBooks)
    
    // Get available books for renting;
    let availableBooks = [];
    for(let i = 0; i < numberOfBooks; i++) {
        const bookKey = await bookLibrary.bookKey(i);
        const book = await bookLibrary.books(bookKey);
       if(book.copies.toString() >0 ) {
           // Keep the key of the book, so we don't have to call every time the contract to get the key.
           tempBook = {
               bookKey: bookKey,
               book: book
           }
           availableBooks.push(tempBook);
       }
    }
    console.log('Available BOOKS', availableBooks);

    //Book Key using for borrow and return a book:
    const bookKey = availableBooks[1].bookKey;

    // // Rent a book;
    // const rentBookTransaction = await bookLibrary.borrowBook(bookKey);
    // const rentBookTransactionReceipt = await rentBookTransaction.wait();
    // if (rentBookTransactionReceipt.status != 1) {
	// 	console.log("Transaction was not successful")
	// 	return 
    // }

    // Check availability of a book after borrowed it;
    const book = await bookLibrary.books(bookKey);
    console.log('Availability after Borrow:',book.copies.toString())

    // Return a book;
     const returnBookTransaction = await bookLibrary.returnBook(bookKey);
     const returnBookTransactionReceipt = await returnBookTransaction.wait();
     if (returnBookTransactionReceipt.status != 1) {
         console.log("Transaction was not successful")
         return 
     }

    // Check availability of a book after return it;
    const book2 = await bookLibrary.books(bookKey);
    console.log('Availability after Return:', book2.copies.toString())
    
}

run()