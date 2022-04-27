movieList = [];
nextMovieId = 1000;

function Movie(title, rating, year, stars, genre, format) {
    this.id = nextMovieId++;
    this.title = title;
    this.rating = rating;
    this.year = year;
    this.stars = stars;
    this.genre = genre;
    this.format = format;
}
function modelCreateMovie(title, rating, year, stars, genre, format) {
    
    var newMovie = new Movie(title, rating, year, stars, genre, format);
    movieList.push(newMovie);
    return newMovie;
}

function updateItem(id, title, rating, year, stars, genre, format) {
    for (x in movieList) {
        if (movieList[x].id === id) {
            movieList[x].title = title;
            movieList[x].rating = rating;
            movieList[x].year = year;
            movieList[x].stars = stars;
            movieList[x].genre = genre;
            movieList[x].format = format;

            return movieList[x];
        }
    }

    return null;
}

function modelReadAllMovies() {
    return movieList;
}
function getItemById(id) {
    for (x in movieList) {
        if (movieList[x].id === id) {
            return movieList[x];
        }
    }

    return null;
}
function deleteItem(id) {
    for (x in movieList) {
        if (movieList[x].id === id) {
            movieList.splice(x, 1);
        }
    }
}