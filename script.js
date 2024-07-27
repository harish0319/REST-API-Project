let selectedStudentIndex = -1;
let selectedStudentId = null; // Store the ID of the selected student

document.addEventListener('DOMContentLoaded', () => {
    fetchStudents(); // Fetch and display students when the page loads
});

// Function to show student details in the form
function showDetails(index, id, name, mobile, address) {
    document.getElementById('name').value = name;
    document.getElementById('mobile').value = mobile;
    document.getElementById('address').value = address;
    selectedStudentIndex = index;
    selectedStudentId = id;
}

// Function to add or update a student
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

        if (selectedStudentId) {
            // Update existing student
            updateStudent(selectedStudentId, formData);
        } else {
            // Add new student
            createStudent(formData);
        }
    } else {
        alert('Please fill out all fields');
    }
}

// Function to create a new student
function createStudent(formData) {
    const apiUrl = 'https://crudcrud.com/api/81d8a0308cf4467fa9d9e51bc69d438b/studentmanager';

    fetch(apiUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`Network response was not ok. Status: ${response.status} ${response.statusText}`);
        }
        return response.json();
    })
    .then(data => {
        console.log('Success:', data);
        alert('Form submitted successfully!');
        updateStudentList(data._id, data.name, data.mobile, data.address); // Update UI with the new student
        clearFormFields(); // Clear form fields after successful submission
    })
    .catch(error => {
        console.error('Fetch error:', error);
        alert('An error occurred. Please check the console for more details.');
    });
}

// Function to update an existing student
function updateStudent(id, formData) {
    const apiUrl = `https://crudcrud.com/api/81d8a0308cf4467fa9d9e51bc69d438b/studentmanager/${id}`;

    fetch(apiUrl, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`Network response was not ok. Status: ${response.status} ${response.statusText}`);
        }
        alert('Student updated successfully!');
        updateStudentList(id, formData.name, formData.mobile, formData.address, true); // Update UI with the updated student
        clearFormFields(); // Clear form fields after successful update
    })
    .catch(error => {
        console.error('Fetch error:', error);
        alert('An error occurred. Please check the console for more details.');
    });
}

// Function to fetch and display all students
function fetchStudents() {
    const apiUrl = 'https://crudcrud.com/api/81d8a0308cf4467fa9d9e51bc69d438b/studentmanager';

    fetch(apiUrl)
    .then(response => {
        if (!response.ok) {
            throw new Error(`Network response was not ok. Status: ${response.status} ${response.statusText}`);
        }
        return response.json();
    })
    .then(data => {
        data.forEach((student, index) => {
            updateStudentList(student._id, student.name, student.mobile, student.address);
        });
    })
    .catch(error => {
        console.error('Fetch error:', error);
        alert('An error occurred while fetching students. Please check the console for more details.');
    });
}

// Function to update the student list in the UI
function updateStudentList(id, name, mobile, address, isUpdate = false) {
    const studentList = document.getElementById('student-list');
    let studentItem;

    if (isUpdate) {
        studentItem = studentList.children[selectedStudentIndex];
        studentItem.innerHTML = `Name: ${name}, Mobile: ${mobile}, Address: ${address}`;
    } else {
        studentItem = document.createElement('li');
        studentItem.innerHTML = `Name: ${name}, Mobile: ${mobile}, Address: ${address}`;
        studentList.appendChild(studentItem);
    }

    const buttonsDiv = document.createElement('div');
    buttonsDiv.classList.add('student-buttons');

    const editButton = document.createElement('button');
    editButton.textContent = 'Edit';
    editButton.classList.add('edit');
    editButton.onclick = () => showDetails(Array.from(studentList.children).indexOf(studentItem), id, name, mobile, address);

    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'Delete';
    deleteButton.classList.add('delete');
    deleteButton.onclick = () => deleteStudent(Array.from(studentList.children).indexOf(studentItem), id);

    buttonsDiv.appendChild(editButton);
    buttonsDiv.appendChild(deleteButton);

    studentItem.appendChild(buttonsDiv);

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
    selectedStudentIndex = -1;
    selectedStudentId = null;
}

// Event listener for form submission
document.getElementById('contactForm').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent default form submission
    addStudent(); // Call addStudent function to handle form submission and API call
});

// Function to delete a student from the list
function deleteStudent(index, id) {
    const apiUrl = `https://crudcrud.com/api/81d8a0308cf4467fa9d9e51bc69d438b/studentmanager/${id}`;

    fetch(apiUrl, {
        method: 'DELETE'
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`Network response was not ok. Status: ${response.status} ${response.statusText}`);
        }
        const studentList = document.getElementById('student-list');
        studentList.removeChild(studentList.children[index]);

        // Update student count
        updateStudentCount();

        // Clear input fields after deleting the student
        clearFormFields();
        selectedStudentIndex = -1; // Reset selectedStudentIndex
        selectedStudentId = null; // Reset selectedStudentId
    })
    .catch(error => {
        console.error('Fetch error:', error);
        alert('An error occurred. Please check the console for more details.');
    });
}