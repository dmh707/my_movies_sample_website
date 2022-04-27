function onPageLoad () {
    // Wire up all button handlers
    document.getElementById('cancelBtn').onclick = function(){onFormCancel()};
    document.getElementById('newBtn').onclick = function(){onNewClick()};
    clearInputForm();
}

function onNewClick(){
    document.getElementById('formTitle').innerHTML = "Add Movie";
    document.getElementById('saveBtn').innerHTML = "Create";
    showForm()

    document.getElementById('saveBtn').onclick=function() {
        onFormSave();
    };
}

function onFormCancel(){
    clearInputForm();
}

function onFormSave(id=false){
    if (!validateForm())
        return;
    var form = document.forms['movie_edit_form'];
    if (id) {
        let checkboxes = getCheckboxes()
        var updateMovie = updateItem(
            id,
            form.movie_title.value,
            form.movie_rating.value,
            form.movie_year.value,
            form.movie_stars.value,
            form.genre.value,
            checkboxes
            );

        updateTableRow(updateMovie);
    }
    else {
        let checkboxes = getCheckboxes()
        var newMovie = modelCreateMovie(
            form.movie_title.value,
            form.movie_rating.value,
            form.movie_year.value,
            form.movie_stars.value,
            form.genre.value,
            checkboxes);

        addTableRow(newMovie);
    }

    clearInputForm()
}

function onItemEdit(id){

    document.getElementById('formTitle').innerHTML = "Edit Movie";
    document.getElementById('saveBtn').innerHTML = "Update";

    var form = document.forms['movie_edit_form'];

    var movie = getItemById(id);

    form.movie_title.value = movie.title;
    form.movie_rating.value = movie.rating;
    form.movie_year.value = movie.year;
    form.movie_stars.selectedIndex = parseInt(movie.stars);
    document.getElementById(movie.genre).checked = true;
    formats = movie.format;
    for (x in formats){
        document.getElementById(formats[x]).checked = true;
    }

    document.getElementById('saveBtn').onclick=function() {
        onFormSave(id);
    };

    showForm()
}

function onItemDelete(id){
    var movie = getItemById(id);
    if (movie == null) {
        console.log("Error: unable to find movie ID " + id)
    }

    if (!confirm("Are you sure you want to delete " + movie.title + "?"))
        return;

    deleteItem(id);

    var tr = document.getElementById('row' + movie.id);
    tr.remove();
    console.log(id + ' item deleted')
}

function validateForm(){
    
    var form = document.forms['movie_edit_form'];
    let validated = true;
    // Title input
    if (form.movie_title.value == "") {
        document.getElementById("title_error").innerHTML = "Title is required.";
        validated = false;
    }
    else {
        document.getElementById("title_error").innerHTML = "";
    }

    //Rating input
    if (form.movie_rating.value == "0" || form.movie_rating.value == ""){
        validated = false;
        document.getElementById('rating_error').innerHTML = "Movie rating is required."
    }
    else {
        document.getElementById('rating_error').innerHTML = ""
    }

    //Year input
    if (form.movie_year.value == "" || parseInt(form.movie_year.value) < 1900 || parseInt(form.movie_year.value) > 2100){
        document.getElementById('year_error').innerHTML = "Year must be set between 1900 and 2100."
        validated = false
    }
    else {
        document.getElementById('year_error').innerHTML = ""
    }

    //Stars input
    if (form.movie_stars.value == "0"){
        validated = false;
        document.getElementById('stars_error').innerHTML = "My rating is required."
    }
    else {
        document.getElementById('stars_error').innerHTML = ""
    }

    //Genre input
    if (form.genre.value == ""){
        validated = false;
        document.getElementById('genre_error').innerHTML = "Genre is required."
    }
    else {
        document.getElementById('genre_error').innerHTML = ""
    }

    //Format input
    if (form.format[0].checked == false && form.format[1].checked == false){
        validated = false;
        document.getElementById('format_error').innerHTML = "Format is required."
    }
    else {
        document.getElementById('format_error').innerHTML = ""
    }

    return validated;
}

function getCheckboxes(){
    let checkboxes = document.getElementsByName("format");
    let checked = []
    for(var i=0; i < checkboxes.length; ++i) {
        if(checkboxes[i].checked == true){
            checked.push(checkboxes[i].id)
        }
    }
    return checked
}

function clearInputForm(){
    hideForm()
    var form = document.forms['movie_edit_form'];

    form.movie_title.value = '';
    form.movie_rating.selectedIndex = 0;
    form.movie_year.value = '';
    form.movie_stars.selectedIndex = 0;
    form.genre.value = 'genre0';
    document.getElementById('genre0').checked = false;


    let checkboxes = document.getElementsByName("format");
    for(var i=0; i < checkboxes.length; ++i) {
        checkboxes[i].checked = false;
    }

    let errors = document.getElementsByClassName('validation_error')
    for(var i=0; i < errors.length; ++i) {
        errors[i].innerHTML=''
    }
}

function showForm(){
    document.getElementById('movie_edit_form').style.display='block';
    document.getElementById('moviesListArea').style.display='none';
}

function hideForm(){
    document.getElementById('movie_edit_form').style.display='none';
    document.getElementById('moviesListArea').style.display='block';
}

function getDvdStr(movie){
    let formats=movie.format
    let dvd = formats.includes("format-dvd")
    if (dvd == false){
        dvd=''
    }
    else if (dvd == true){
        dvd='&#10004;' //checkmark
    }
    return dvd
}

function updateTableRow(movie) {
    let id = 'row' + movie.id.toString();
    let row = document.getElementById(id);
    let dvd = getDvdStr(movie)
    row.childNodes[0].innerHTML = movie.title;
    row.childNodes[1].innerHTML = movie.rating;
    row.childNodes[2].innerHTML = getStarsStr(movie);
    row.childNodes[3].innerHTML = dvd;
}

function getStarsStr(movie){
    return '&#11088; '.repeat(parseInt(movie.stars));
}

function addTableRow(movie) {
    let table = document.getElementById("moviesTable");

    // Compose a new row, and set its id attribute.  This helps us
    // if the user wants to change the student's info later.
    let row = table.insertRow(table.rows.length-1);
    row.id = "row" + movie.id;
    cellsContents=[movie.title,movie.rating,getStarsStr(movie),getDvdStr(movie)]
    let cell = null
    for (i in cellsContents){
        cell = row.insertCell(i)
        cell.innerHTML = cellsContents[i]
    }

    cell = row.insertCell(4);
    let editBtn = document.createElement("button");
    editBtn.innerText = "Edit";
    editBtn.type = "button";
    editBtn.onclick = function() {
        onItemEdit(movie.id);
    }
    cell.appendChild(editBtn);

    cell = row.insertCell(5);
    let deleteBtn = document.createElement("button");
    deleteBtn.innerText = "Delete";
    deleteBtn.type = "button";
    deleteBtn.classList.add('red_btn')
    deleteBtn.onclick = function() {
        onItemDelete(movie.id);
    }
    cell.appendChild(deleteBtn);
}

function getGenreStr(movie){
    genreDict = {0:"Action/Adventure",
                1:"Drama",
                2:"Comedy",
                3:"Romance",
                4:"Sci-Fi/Fantasy",
                5:"Other"
                }
    return genreDict[movie.genre]
}