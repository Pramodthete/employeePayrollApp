$(document).ready(function () {
    $('#employeeForm').submit(function (event) {
        event.preventDefault();
        
        var form_data = {
            name: $('#name').val(),
            profile: $("input[name='profile']:checked").val(),
            gender: $("input[name='gender']:checked").val(),
            department: [],
            salary: $('#salary').val(),
            date: $('#day').val() + " " + $('#month').val() + " " + $('#year').val(),
            notes: $('#notes').val()
        };

        var isValid = true; 
        var namePattern = /^[a-zA-Z\s]+$/;

        if (form_data.name == '') {
            $('#nameErr').html('Name Field Required *').css('color', 'red');
            isValid = false;
        } else if (!namePattern.test(form_data.name)) {
            $('#nameErr').html('Name Should not contain Numbers *').css('color', 'red');
            isValid = false;
        } else {
            $('#nameErr').html('');
        }

        if (form_data.salary == null) {
            $('#salaryErr').html('Please Select a Salary *').css('color', 'red');
            isValid = false;
        } else {
            $('#salaryErr').html('');
        }

        if (form_data.profile == null) {
            $('#profileErr').html('Please Select a Profile pic *').css('color', 'red');
            isValid = false;
        } else {
            $('#profileErr').html('');
        }

        if (form_data.gender == null) {
            $('#genderErr').html('Please Select a Gender *').css('color', 'red');
            isValid = false;
        } else {
            $('#genderErr').html('');
        }

        if (form_data.date.includes('null')) {
            $('#dateErr').html('Please Select a Start Date *').css('color', 'red');
            isValid = false;
        } else {
            $('#dateErr').html('');
        }

        $.each($("input[name='department']:checked"), function () {
            form_data.department.push($(this).val());
        });

        if (form_data.department.length == 0) {
            $('#deptErr').html('Please Select Departments *').css('color', 'red');
            isValid = false;
        } else {
            $('#deptErr').html('');
        }

        if (!isValid) {
            return;
        }

        $.ajax({
            url: 'http://localhost:3000/user',
            type: 'GET',
            success: function (data) {
                var duplicate = false;
                data.forEach(function (user) {
                    if (user.name.toLowerCase() === form_data.name.toLowerCase() && user.gender === form_data.gender) {
                        duplicate = true;
                        return false;
                    }
                });

                if (duplicate) {
                    alert('User already exists!');
                } else {
                    submitForm(form_data);
                }
            },
            error: function (error) {
                console.log('Error:', error);
                alert('Error occurred while submitting the form!');
            }
        });
    });
});



function submitForm(form_data) {
    $.ajax({
        url: 'http://localhost:3000/user',
        type: 'POST',
        data: JSON.stringify(form_data),
        contentType: 'application/json',
        success: function (data) {
            window.location.href = "./employeeDetails.html";
            alert('Form submitted successfully!');
        },
        error: function (error) {
            console.log('Error:', error);
            alert('Error occurred while submitting the form!');
        }
    });
}

function cancelAdd() {
    window.location.href = "./employeeDetails.html";
}

function resetForm() {
    document.getElementById('employeeForm').reset();
}