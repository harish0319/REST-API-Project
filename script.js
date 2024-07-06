// Initialize selectedStudentIndex
let selectedStudentIndex = -1;

// Function to show student details in the form
function showDetails(index, name, mobile, address) {
    document.getElementById('name').value = name;
    document.getElementById('mobile').value = mobile;
    document.getElementById('address').value = address;
    selectedStudentIndex = index;
}

// Function to add a new student
function addStudent() {
    const name = document.getElementById('name').value;
    const mobile = document.getElementById('mobile').value;
    const address = document.getElementById('address').value;

    if (name && mobile && address) {
        const formData = {
            name: name,
            mobile: mobile,
            address: address
        };

        const apiUrl = 'https://crudcrud.com/api/47802b48b1e14499a804ddadcda93454/studentmanager';

        fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            console.log('Success:', data);
            alert('Form submitted successfully!');
            updateStudentList(name, mobile, address); // Update UI with the new student
            clearFormFields(); // Clear form fields after successful submission
        })
        .catch(error => {
            console.error('Error:', error);
            alert('An error occurred. Please try again.');
        });
    } else {
        alert('Please fill out all fields');
    }
}

// Function to update the student list in the UI
function updateStudentList(name, mobile, address) {
    const studentList = document.getElementById('student-list');
    const newStudent = document.createElement('li');
    newStudent.textContent = `Name: ${name}, Mobile: ${mobile}, Address: ${address}`;

    const buttonsDiv = document.createElement('div');
    buttonsDiv.classList.add('student-buttons');

    const editButton = document.createElement('button');
    editButton.textContent = 'Edit';
    editButton.classList.add('edit');
    editButton.onclick = () => showDetails(Array.from(studentList.children).indexOf(newStudent), name, mobile, address);

    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'Delete';
    deleteButton.classList.add('delete');
    deleteButton.onclick = () => deleteStudent(Array.from(studentList.children).indexOf(newStudent));

    buttonsDiv.appendChild(editButton);
    buttonsDiv.appendChild(deleteButton);

    newStudent.appendChild(buttonsDiv);
    studentList.appendChild(newStudent);

    // Update student count
    updateStudentCount();
}

// Function to update the student count in the UI
function updateStudentCount() {
    const studentCount = document.getElementById('student-list').children.length;
    document.getElementById('student-count').textContent = studentCount;
}

// Function to clear form fields
function clearFormFields() {
    document.getElementById('name').value = '';
    document.getElementById('mobile').value = '';
    document.getElementById('address').value = '';
}

// Event listener for form submission
document.getElementById('contactForm').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent default form submission

    const name = document.getElementById('name').value;
    const mobile = document.getElementById('mobile').value;
    const address = document.getElementById('address').value;

    addStudent(); // Call addStudent function to handle form submission and API call
});

// Function to delete a student from the list
function deleteStudent(index) {
    const studentList = document.getElementById('student-list');
    studentList.removeChild(studentList.children[index]);

    // Update student count
    updateStudentCount();

    // Clear input fields after deleting the student
    clearFormFields();
    selectedStudentIndex = -1; // Reset selectedStudentIndex

    // Reassign click handlers for edit and delete buttons
    Array.from(studentList.children).forEach((li, idx) => {
        li.querySelector('.edit').onclick = () => showDetails(idx,
            li.textContent.split(', ')[0].split(': ')[1],
            li.textContent.split(', ')[1].split(': ')[1],
            li.textContent.split(', ')[2].split(': ')[1]
        );
        li.querySelector('.delete').onclick = () => deleteStudent(idx);
    });
}
