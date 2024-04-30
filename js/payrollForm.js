
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

        var namePattern = /^[a-zA-Z\s]+$/;
        if (!namePattern.test(form_data.name)) {
            alert('Please enter a valid name');
            return;
        }

        var salaryPattern = /^\d+(\.\d{1,2})?$/;
        if (!salaryPattern.test(form_data.salary)) {
            alert('Please enter a valid salary');
            return;
        }

        $.each($("input[name='department']:checked"), function () {
            form_data.department.push($(this).val());
        });

        $.ajax({
            url: 'http://localhost:3000/user',
            type: 'GET',
            success: function (data) {
                var duplicate = false;
                data.forEach(function (user) {
                    if (user.name === form_data.name && user.gender === form_data.gender) {
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
            alert('Form submitted successfully!');
            window.location.href = "./employeeDetails.html";
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