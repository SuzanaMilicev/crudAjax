
const start = document.getElementById("start");
const q1 = document.getElementById("q1");
const q2 = document.getElementById("q2");
const q3 = document.getElementById("q3");
const q4 = document.getElementById("q4");
const q5 = document.getElementById("q5");
const end1 = document.getElementById("end-1");
const end2 = document.getElementById("end-2");
const end3 = document.getElementById("end-3");
const end4 = document.getElementById("end-4");
const end5 = document.getElementById("end-5");

function nextPage(event) {
    let firstname = document.getElementById("firstname").value;
    switch (event) {
        case 'next1':
            start.style.display = "none";
            q1.style.display = "block";
            break;
        case 'next2':
            if (!firstname) {
                alert("Name must be filled out!");
            }
            else {
                q1.style.display = "none";
                q2.style.display = "block";
            }
            break;
        case 'next3':
            q2.style.display = "none";
            q3.style.display = "block";
            break;
        case 'next4':
            q3.style.display = "none";
            q4.style.display = "block";
            break;
        default:
            q4.style.display = "none";
            q5.style.display = "block";
            break;
    }
}

function inputPopUp(x) {
    let radio = document.getElementById("optionalInput");
    if (x == 'T') {
        radio.style.display = "block";
    }
    else {
        radio.style.display = "none";
    }
}

function finalPage() {
    let mark = document.getElementById("customRange1").value;
    let span1 = document.getElementsByClassName("span1");
    let firstname = document.getElementById("firstname").value;

    switch (mark) {
        case '1':
            q5.style.display = "none";
            span1[0].innerHTML = firstname;
            end1.style.display = "block";
            break;
        case '2':
            q5.style.display = "none";
            span1[1].innerHTML = firstname;
            end2.style.display = "block";
            break;
        case '3':
            q5.style.display = "none";
            span1[2].innerHTML = firstname;
            end3.style.display = "block";
            break;
        case '4':
            q5.style.display = "none";
            span1[3].innerHTML = firstname;
            end4.style.display = "block";
            break;
        default:
            q5.style.display = "none";
            span1[4].innerHTML = firstname;
            end5.style.display = "block";
            break;
    }
}

/* COURSES PAGE */

var allData = [];
var clickedRowId = "";

$(document).ready(function () {
    getData();

    $("#courses_table_body").on("click", 'button', function () {
        if ($(this).hasClass("btn-outline-info")) {
            viewDetails($(this));
        }
        else if ($(this).hasClass("btn-outline-primary")) {
            makeReservation($(this));
        }
    })
});

function getData() {
    var getRequest = $.ajax({
        type: "GET",
        url: "http://localhost:3000/courses"
    });
    getRequest.done(function (podaci) {
        allData = podaci;
        fillTable(podaci);
        $("#courses_table").dataTable();
    });
    getRequest.fail(function (error) {
        alert(error.statusText);
    });
}

function fillTable(data) {
    $("#courses_table_body").empty();
    $.each(data, function (i, podatak) {
        $("#courses_table_body").append(`
            <tr>
                <td> ${podatak.course} </td>
                <td> ${podatak.startDate} </td>
                <td> ${podatak.duration} </td>
                <td> ${podatak.price}$ </td>
                <td> <button class="btn btn-outline-info" id="view_${podatak.id}">View details</button> </td>
                <td> <button class="btn btn-outline-primary" id="reserve_${podatak.id}">Make reservation</button> </td>
            <\tr>
        `);
    })
}

function deleteEmployee(buttonObj) {
    let emplId = buttonObj.attr("id");
    let id = emplId.split("_")[1];
    var deleteRequest = $.ajax({
        type: "DELETE",
        url: "http://localhost:3000/employee/" + id
    });
    deleteRequest.done(function (podaci) {
        //jedan nacin
        // getData();
        //drugi nacin
        buttonObj.parent().parent().remove();
        let tempIndex = allData.findIndex(x => x.id == id);
        if (tempIndex != -1) {
            allData.splice(tempIndex, 1);
        }
    });
    deleteRequest.fail(function (error) {
        alert(error.statusText);
    });
}

function viewDetails(buttonObj) {
    $("#viewDetailsModal").modal('toggle');
    let courseId = buttonObj.attr("id");
    let id = courseId.split("_")[1];
    clickedRowId = id;
    let tempIndex = allData.findIndex(x => x.id == id);
    if (tempIndex != -1) {
        let selectedCourse = allData[tempIndex];
        $(".modalTitle").text(selectedCourse.course);
        $("#courseDetails").text(selectedCourse.details);
    }
}

function makeReservation(buttonObj) {
    $("#makeReservationModal").modal('toggle');
    let courseId = buttonObj.attr("id");
    let id = courseId.split("_")[1];
    clickedRowId = id;
    let tempIndex = allData.findIndex(x => x.id == id);
    if (tempIndex != -1) {
        let selectedCourse = allData[tempIndex];
        $("#reservcourse").val(selectedCourse.course);
        $("#reservprice").val(selectedCourse.price);
    }
}

function saveChanges() {
    let name = $("#name").val();
    let surname = $("#surname").val();
    let email = $("#email").val();
    let jmbg = $("#jmbg").val();
    let comment = $("#comment").val();
    var editedEmployee = {
        name: name,
        surname: surname,
        email: email,
        JMBG: jmbg,
        comment: comment
    };

    let typeOfSaving = $("#editEmployeeModalLabel").text();
    if (typeOfSaving == "Edit Employee") {
        let editRequest = $.ajax({
            type: "PUT",
            url: "http://localhost:3000/employee/" + clickedRowId,
            data: editedEmployee
        });
        editRequest.done(function () {
            $("#editEmployeeModal").modal('toggle');
            getData();
        });
        editRequest.fail(function () {
            alert("Izmena podataka nije uspela");
        })
    }
    else {
        let addNewRequest = $.ajax({
            type: "POST",
            url: "http://localhost:3000/employee",
            data: editedEmployee
        });
        addNewRequest.done(function (savedData) {
            $("#editEmployeeModal").modal('toggle');
            // getData();
            $("#empl_table_body").append(`
            <tr>
                <td> ${savedData.JMBG} </td>
                <td> ${savedData.name} </td>
                <td> ${savedData.surname} </td>
                <td> ${savedData.email} </td>
                <td> ${savedData.comment} </td>
                <td> <button class="btn btn-warning" id="edit_${savedData.id}">Edit</button> </td>
                <td> <button class="btn btn-danger" id="delete_${savedData.id}">Delete</button> </td>
            <\tr>
        `);
        });
        addNewRequest.fail(function () {
            alert("Dodavanje podataka nije uspela");
        })
    }
}

function addNewEmployee() {
    $("#editEmployeeModal").modal('toggle');
    $("#editEmployeeModalLabel").text("Add New Employee");
}