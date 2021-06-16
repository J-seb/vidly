import React, { Component } from "react";
import ListGroup from "./common/listGroup";
import Pagination from "./common/pagination";
import { getMovies } from "../services/fakeMovieService";
import { paginate } from "../utils/paginate";
import { getGenres } from "../services/fakeGenreService";
import MoviesTable from "./moviesTable";
import _ from "lodash";

class Movies extends Component {
  state = {
    movies: [],
    genres: [],
    pageSize: 4,
    currentPage: 1,
    sortColumn: { path: "title", order: "asc" },
  };

  constructor() {
    super();
    this.handleDeleteMovie = this.handleDeleteMovie.bind(this);
    this.handleLike = this.handleLike.bind(this);
    this.handlePageChange = this.handlePageChange.bind(this);
    this.handleGenreSelected = this.handleGenreSelected.bind(this);
    this.handleSort = this.handleSort.bind(this);
    this.getPageData = this.getPageData.bind(this);
  }

  componentDidMount() {
    const genres = [{ _id: "", name: "All Genres" }, ...getGenres()];
    this.setState({ movies: getMovies(), genres });
  }

  handleDeleteMovie(movie) {
    console.log(movie);
    const newMoviesArray = this.state.movies.filter((m) => m._id !== movie._id);
    this.setState({ movies: newMoviesArray });
  }

  handleLike(movie) {
    const newMoviesArray = [...this.state.movies];
    const index = newMoviesArray.indexOf(movie);

    newMoviesArray[index].liked = !newMoviesArray[index].liked;

    this.setState({
      movies: newMoviesArray,
    });
  }

  handlePageChange(page) {
    this.setState({
      currentPage: page,
    });
  }

  handleGenreSelected(genre) {
    this.setState({
      selectedGenre: genre,
      currentPage: 1,
    });
  }

  handleSort(sortColumn) {
    this.setState({ sortColumn });
  }

  getPageData() {
    const { movies, pageSize, currentPage, selectedGenre, sortColumn } =
      this.state;

    const filtered =
      selectedGenre && selectedGenre._id
        ? movies.filter((m) => m.genre._id === selectedGenre._id)
        : movies;

    const sorted = _.orderBy(filtered, [sortColumn.path], [sortColumn.order]);

    const currentMovies = paginate(sorted, currentPage, pageSize);

    return { totalCount: filtered.length, data: currentMovies };
  }

  render() {
    if (this.state.movies.length === 0) {
      return <p>There has no Movies...</p>;
    }

    const { pageSize, currentPage, sortColumn } = this.state;

    const { totalCount, data } = this.getPageData();

    return (
      <div className="row">
        <div className="col-3">
          <ListGroup
            items={this.state.genres}
            selectedItem={this.state.selectedGenre}
            onItemSelect={this.handleGenreSelected}
          />
        </div>
        <div className="col">
          <p>There has {totalCount} remaining</p>
          <MoviesTable
            currentMovies={data}
            onLike={this.handleLike}
            onDelete={this.handleDeleteMovie}
            onSort={this.handleSort}
            sortColumn={sortColumn}
          />
          <Pagination
            itemsCount={totalCount}
            pageSize={pageSize}
            currentPage={currentPage}
            onPageChange={this.handlePageChange}
          />
        </div>
      </div>
    );
  }
}

export default Movies;
