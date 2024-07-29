import React, { useEffect, useReducer, useState } from "react";
import { useNavigate } from "react-router-dom";
import FilterSidebar from "./FilterSidebar";
import SearchHeader from "./SearchHeader";
import StarRating from "./rating/StarRating";
import axios from "axios";
import Loader from "react-js-loader";

const initialState = {
  selectedGenre: "",
  selectedAuthor: "",
  ratingRange: "0-5",
  searchTerm: "",
  page: 1,
  totalPages: 1,
};

const reducer = (state, action) => {
  switch (action.type) {
    case "SET_GENRE":
      return { ...state, selectedGenre: action.payload };
    case "SET_AUTHOR":
      return { ...state, selectedAuthor: action.payload };
    case "SET_RATING_RANGE":
      return { ...state, ratingRange: action.payload };
    case "SET_SEARCH_TERM":
      return { ...state, searchTerm: action.payload };
    case "CHANGE_PAGE":
      return { ...state, page: action.payload };
    default:
      return state;
  }
};

const Home = () => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [audioBook, setAudioBook] = useState([]);
  const [totalPages, setTotalPages] = useState(1); // Total number of pages
  const navigate = useNavigate();

  const [loader, setLoader] = useState(false);

  useEffect(() => {
    const fetchAudioBook = async () => {
      setLoader(true);
      const url = `${process.env.REACT_APP_URL}/api/audio-book/get-details/page/${state.page}?author=${state.selectedAuthor}&genre=${state.selectedGenre}&rating=${state.ratingRange}&search=${state.searchTerm}`;

      try {
        const response = await axios.get(url);
        const { data } = response.data;

        setAudioBook(data);
        setTotalPages(response.data.totalPages);
        setLoader(false);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchAudioBook();
  }, [state]);

  const handleBookClick = (slug) => {
    navigate(`/book/${slug}`);
  };

  const handlePageChange = (newPage) => {
    dispatch({ type: "CHANGE_PAGE", payload: newPage });
  };

  return (
    <div className="flex flex-col md:flex-row">
      {/* Filter Sidebar */}
      <FilterSidebar state={state} dispatch={dispatch} />

      {/* Main Content */}
      <main className="flex-1 p-4">
        {/* Search Header */}
        <SearchHeader state={state} dispatch={dispatch} />

        {/* Grid for Books */}
        {loader ? (
          <Loader
            type="spinner-circle"
            bgColor="grey"
            color="grey"
            title="Fetching Details"
            size={100}
          />
        ) : (
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-3">
            {audioBook.length > 0 ? (
              audioBook.map((book) => (
                <div
                  key={book._id}
                  className="w-full sm:w-auto px-4 mb-8 hover-effect"
                  onClick={() => handleBookClick(book.slug)}
                >
                  <div className="group rounded-md overflow-hidden shadow-md relative bg-gray-50 hover:shadow-lg transition duration-300 cursor-pointer">
                    <img
                      src={book.coverImage}
                      alt="book"
                      className="w-full h-48 object-fit"
                    />
                    <div className="p-4">
                      <h3 className="text-xl font-semibold mb-2">
                        {book.title}
                      </h3>
                      <p className="text-gray-600">By {book.author}</p>
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "flex-start",
                          gap: "5px",
                        }}
                      >
                        <StarRating rating={book.averageRating} />
                      </div>
                      <span>
                        {book.averageRating} (Based on {book.numOfReviews}{" "}
                        reviews)
                      </span>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="col-span-full text-center">No books found.</p>
            )}
          </div>
        )}

        {/* Pagination */}
        <div className="flex justify-center items-center mt-4">
          <button
            className={state.page === 1 ? "bg-gray-300 hover:bg-gray-200 px-4 py-2 rounded-l-md" : "bg-gray-300 hover:bg-gray-400 px-4 py-2 rounded-l-md"}
            onClick={() => handlePageChange(state.page - 1)}
            disabled={state.page === 1}
          >
            Previous
          </button>
          <span className="px-4">{state.page}</span>
          <button
            className={audioBook.length<8 ? "bg-gray-300 hover:bg-gray-200 px-4 py-2 rounded-r-md" : "bg-gray-300 hover:bg-gray-400 px-4 py-2 rounded-r-md"}
            onClick={() => handlePageChange(state.page + 1)}
            disabled={audioBook.length<8}
          >
            Next
          </button>
        </div>
      </main>
    </div>
  );
};

export default Home;
