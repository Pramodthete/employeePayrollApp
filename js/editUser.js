
$(document).ready(function () {
    var urlParams = new URLSearchParams(window.location.search);
    var userId = urlParams.get('id');
    if (userId) {
        fetchUser(userId);
    }

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
                    if (user.name === form_data.name && user.gender === form_data.gender) {
                        duplicate = true;
                        return false; 
                    }
                });
                
                    submitForm(form_data, userId);
                
            },
            error: function (error) {
                console.log('Error:', error);
                alert('Error occurred while submitting the form!');
            }
        });
    });

    function fetchUser(userId) {
        $.ajax({
            url: `http://localhost:3000/user/${userId}`,
            type: 'GET',
            success: function (user) {
                $('#name').val(user.name);
                $(`input[name='profile'][value="${user.profile}"]`).prop('checked', true);
                $(`input[name='gender'][value="${user.gender}"]`).prop('checked', true);
                user.department.forEach(function (dept) {
                    $(`input[name='department'][value="${dept}"]`).prop('checked', true);
                });
                $('#salary').val(user.salary);
                var date = new Date(user.date);
                $('#day').val(date.getDate());
                $('#month').val(date.toLocaleString('default', {
                    month: 'long'
                }));
                $('#year').val(date.getFullYear());
                $('#notes').val(user.notes);
            },
            error: function (error) {
                console.log('Error:', error);
                alert('Error occurred while fetching user data!');
            }
        });
    }

    function submitForm(form_data, userId) {
        var requestType = userId ? 'PUT' : 'POST';
        var requestUrl = userId ? `http://localhost:3000/user/${userId}` : 'http://localhost:3000/user';

        $.ajax({
            url: requestUrl,
            type: requestType,
            contentType: 'application/json',
            data: JSON.stringify(form_data),
            success: function () {
                window.location.href = "./employeeDetails.html";
                alert('User updated successfully!');
            },
            error: function (error) {
                console.log('Error:', error);
                alert('Error occurred while updating user!');
            }
        });
    }
});

function cancelEdit() {
    window.location.href = "./employeeDetails.html";
}

function resetForm() {
    document.getElementById('employeeForm').reset();
}