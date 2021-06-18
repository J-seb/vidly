import React, { Component } from "react";
import ListGroup from "./common/listGroup";
import Pagination from "./common/pagination";
import { getMovies, deleteMovie } from "../services/movieService";
import { paginate } from "../utils/paginate";
import { getGenres } from "../services/genreService";
import { Link } from "react-router-dom";
import MoviesTable from "./moviesTable";
import SearchBox from "./searchBox";
import { toast } from "react-toastify";
import _ from "lodash";

class Movies extends Component {
  state = {
    movies: [],
    genres: [],
    pageSize: 4,
    currentPage: 1,
    searchQuery: "",
    selectedGenre: null,
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
    this.handleSearch = this.handleSearch.bind(this);
  }

  async componentDidMount() {
    const { data } = await getGenres();
    const genres = [{ _id: "", name: "All Genres" }, ...data];

    const { data: movies } = await getMovies();
    this.setState({ movies, genres });
  }

  async handleDeleteMovie(movie) {
    const originalMovies = this.state.movies;

    const newMoviesArray = originalMovies.filter((m) => m._id !== movie._id);
    this.setState({ movies: newMoviesArray });

    try {
      await deleteMovie(movie._id);
    } catch (ex) {
      if (ex.response && ex.response.status === 404) {
        toast.error("This movie has already been deleted.");
      }

      this.setState({ movies: originalMovies });
    }
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
      searchQuery: "",
      currentPage: 1,
    });
  }

  handleSearch(query) {
    this.setState({ searchQuery: query, selectedGenre: null, currentPage: 1 });
  }

  handleSort(sortColumn) {
    this.setState({ sortColumn });
  }

  getPageData() {
    const {
      movies,
      pageSize,
      currentPage,
      selectedGenre,
      sortColumn,
      searchQuery,
    } = this.state;

    let filtered = movies;

    if (searchQuery) {
      filtered = movies.filter((m) =>
        m.title.toLowerCase().startsWith(searchQuery.toLowerCase())
      );
    } else if (selectedGenre && selectedGenre._id) {
      filtered = movies.filter((m) => m.genre._id === selectedGenre._id);
    }

    const sorted = _.orderBy(filtered, [sortColumn.path], [sortColumn.order]);

    const currentMovies = paginate(sorted, currentPage, pageSize);

    return { totalCount: filtered.length, data: currentMovies };
  }

  render() {
    const { pageSize, currentPage, sortColumn, searchQuery } = this.state;
    const { totalCount, data } = this.getPageData();
    const { user } = this.props;

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
          {user && (
            <Link
              to="/movies/new"
              className="btn btn-primary"
              style={{ marginBottom: 20 }}
            >
              New Movie
            </Link>
          )}
          <p>There has {totalCount} remaining</p>
          <SearchBox value={searchQuery} onChange={this.handleSearch} />
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
