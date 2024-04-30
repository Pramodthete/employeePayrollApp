$(document).ready(function () {

    function displayEmployees(employees) {
        $('#tbody').empty();
        employees.forEach(user => {
            $('#tbody').append(`
                <tr data-id="${user.id}">
                    <td>
                        <div>
                            <img src="${user.profile}" alt="profile" name="profile">
                        </div>
                    </td>
                    <td>
                        <div>
                            <div>${user.name}</div>
                        </div>
                    </td>
                    <td>${user.gender}</td>
                    <td>
                        <div class="dept">
                            ${user.department.map(dept => `<div class="yellow">${dept}</div>`).join("")}
                        </div>
                    </td>
                    <td>${user.salary}</td>
                    <td>${user.date}</td>
                    <td>
                        <div class="actions">
                            <a href="#"><i class="material-icons delete" style="font-size:20px">delete</i></a>
                            <a href="#"><i class="fa fa-edit edit" style="font-size:20px"></i></a>
                        </div>
                    </td>
                </tr>
            `);
        });
    }

    function deleteUser(userId) {
        $.ajax({
            url: `http://localhost:3000/user/${userId}`,
            type: 'DELETE',
            success: function () {
                
                $(`tr[data-id="${userId}"]`).remove();
            },
            error: function (error) {
                console.log('Error:', error);
                alert('Error occurred while deleting user!');
            }
        });
    }

    $.ajax({
        url: 'http://localhost:3000/user',
        type: 'GET',
        success: function (data) {
            console.log(data);
            displayEmployees(data);
        }
    });


    $(document).on('click', '.search', function () {
        var searchText = $('#searchInput').val().toLowerCase();
        $.ajax({
            url: 'http://localhost:3000/user',
            type: 'GET',
            success: function (data) {
                var filteredEmployees = data.filter(user => 
                    user.name.toLowerCase().includes(searchText) ||
                    user.gender.toLowerCase().includes(searchText) ||
                    user.date.toLowerCase().includes(searchText) ||
                    user.salary.toLowerCase().includes(searchText) ||
                    user.department.some(dept => dept.toLowerCase().includes(searchText))
                );
                displayEmployees(filteredEmployees);
            }
        });
    });


    $(document).on('click', '#sortSalary', function () {
        $.ajax({
            url: 'http://localhost:3000/user',
            type: 'GET',
            success: function (data) {
                var sortedEmployees = data.sort((a, b) => a.salary - b.salary);
                displayEmployees(sortedEmployees);
            }
        });
    });

    $(document).on('click', '.delete', function () {
        var userId = $(this).closest('tr').data('id');
        if (confirm("Are you sure you want to delete this user?")) {
            deleteUser(userId);
        }
    });

    $(document).on('click', '.edit', function () {
        var userId = $(this).closest('tr').data('id');
        window.location.href = `editUser.html?id=${userId}`;
    });

    

});
