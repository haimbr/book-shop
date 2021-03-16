


const bookName = document.querySelector('.book-name').innerText;
const bookAuthor = document.querySelector('.book-author').innerText.replace('מחבר:', '');

const editButton = document.querySelector('.edit-book');
const deleteButton = document.querySelector('.delete-book');
const bookContainer = document.querySelector('.books-details');



editButton.addEventListener('click', (event) => {
    event.preventDefault();
    bookContainer.contentEditable = true;
    addSubmitButton();
});

deleteButton.addEventListener('click', (event) => {
    event.preventDefault();
    deleteBook();
});


function addSubmitButton() {
    const submitButton = document.createElement('button');
    submitButton.innerText = 'שמור שינויים';
    bookContainer.appendChild(submitButton);
    submitButton.addEventListener('click', () => sendChanges())
}
 

async function deleteBook() {
    try {
        await fetch(`/delete-book`, {
            method: 'DELETE',
            body: JSON.stringify({ bookName, bookAuthor }),
            headers: { 'Content-Type': 'application/json' }
        });

        alert('הספר נמחק בהצלחה');
        window.location = '/'
    } catch (e) {
        alert('משהו השתבש נסה שוב');
    }
}


async function sendChanges() {
    const bookDetails = getNewBookDetails();
    try {
        await fetch(`/edit-book`, {
            method: 'PATCH',
            body: JSON.stringify({ bookDetails, bookName, bookAuthor }),
            headers: { 'Content-Type': 'application/json' }
        });

        alert('פרטי הספר עודכנו');
        location.reload();
    } catch (e) {
        alert(e, 'משהו השתבש נסה שוב');
    }
}


function getNewBookDetails(){
    const descriptionContainer = document.querySelectorAll('.book-description');
    let description = "";
    document.querySelectorAll('.book-description').forEach((section) => description += section.innerText + "<br>");
    return {
        name: document.querySelector('.book-name').innerText,
        author: document.querySelector('.book-author').innerText.replace('מחבר:', ''),
        description: description,
        price: parseInt(document.querySelector('.book-price').innerText.replace('₪', '')),
    }
}