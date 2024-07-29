import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import StarRating from "./rating/StarRating"; // Assuming you have a StarRating component
import axios from "axios";
import StarRatingInput from "./rating/StarRatingInput";
import Loader from "react-js-loader";

const BookDetails = () => {
  const { slug } = useParams();

  // State variables
  const [audioBook, setAudioBook] = useState({});
  const [reviews, setReviews] = useState([]);
  const [visibleReviews, setVisibleReviews] = useState(0);
  const [reviewPage, setReviewPage] = useState(1);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [newReview, setNewReview] = useState({
    rating: 1,
    title: "",
    description: "",
  });

  const [loader, setLoader] = useState(false);
  const [reviewLoader, setReviewLoader] = useState(false);

  const fetchAudioBookDetails = async () => {
    setLoader(true);
    const url = `${process.env.REACT_APP_URL}/api/audio-book/get-details/slug/${slug}`;
    const { data } = await axios.get(url);
    setAudioBook(data.data.details);
    setReviews(data.data.reviews);
    setLoader(false);
  };
  useEffect(() => {
    fetchAudioBookDetails();
  }, [slug]);

  // Function to fetch more reviews
  const fetchMoreReview = async (page) => {
    const url = `${process.env.REACT_APP_URL}/api/review/get-review/${audioBook._id}/${page}`;
    const { data } = await axios.get(url);
    setReviews((prev) => [...prev, ...data.data]);
    setVisibleReviews(reviews.length);
  };

  const loadMoreReviews = async () => {
    setReviewLoader(true);
    await fetchMoreReview(reviewPage + 1);
    setReviewPage((prev) => prev + 1);
    setReviewLoader(false);
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    const url = `${process.env.REACT_APP_URL}/api/review/create`;
    await axios.post(url, { ...newReview, audioBookId: audioBook._id });

    // const updatedReviews = [...reviews, { user: 'NewUser', ...newReview }];
    fetchAudioBookDetails();
    // setReviews(updatedReviews);
    setNewReview({ rating: 1, title: "", description: "" });
    setShowReviewForm(false);
  };

  const handleRatingChange = (rating) => {
    setNewReview((prev) => ({ ...prev, rating }));
  };

  if (!audioBook) {
    return <div>Book not found</div>;
  }

  return (
    <>
      {loader ? (
        <Loader
          type="spinner-circle"
          bgColor="grey"
          color="grey"
          title="Fetching Details"
          size={100}
        />
      ) : (
        <div className="p-4">
          <div className="container mx-auto">
            <div className="block md:grid md:grid-cols-2 md:gap-4">
              <div className="mb-4 md:mb-0 md:pr-4">
                <img
                  src={audioBook.coverImage}
                  alt={audioBook.title}
                  className="w-full h-96 object-fit mb-4 md:mb-0 rounded-lg"
                />
              </div>
              <div className="flex flex-col justify-between">
                <div>
                  <h1 className="text-3xl font-semibold mb-4">
                    {audioBook.title}
                  </h1>
                  <p className="mb-4">{audioBook.description}</p>
                  <p className="mb-4 text-gray-600">
                    <strong>Genre:</strong> {audioBook.genre}
                  </p>
                  <p className="mb-4 text-gray-600">
                    <strong>Author:</strong> {audioBook.author}
                  </p>
                  <StarRating rating={audioBook.averageRating} />

                  <p className="mb-4 text-gray-600">
                    <span>{audioBook.averageRating}</span> (Based on{" "}
                    {audioBook.numOfReviews} reviews)
                  </p>
                </div>
              </div>
            </div>

            {/* Reviews section */}
            <div className="mt-8">
              <h2 className="text-2xl text-center font-semibold mb-4">
                User Reviews
              </h2>
              {reviews.map((review, index) => (
                <div
                  key={index}
                  className="p-4 mb-4 border border-gray-300 rounded-lg shadow-sm"
                >
                  <p>
                    <strong>{review.title}</strong>
                  </p>
                  <p>{review.description}</p>
                  <StarRating rating={review.rating} />
                </div>
              ))}
              {reviewLoader &&
              (
                <Loader
                  type="spinner-circle"
                  bgColor="grey"
                  color="grey"
                  title="Fetching Details"
                  size={100}
                />
              )}
              {visibleReviews !== reviews.length && (
                <button
                  onClick={loadMoreReviews}
                  className="p-2 bg-blue-500 text-white rounded"
                >
                  Load More Reviews
                </button>
              )}
              <div className="mt-4 text-center">
                <button
                  onClick={() => setShowReviewForm((prev) => !prev)}
                  className="p-2 bg-green-500 text-white rounded"
                >
                  {showReviewForm ? "Cancel" : "Write a Review"}
                </button>
              </div>
              {showReviewForm && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                  <div className="bg-white p-6 rounded-lg shadow-lg w-11/12 md:w-1/2">
                    <form onSubmit={handleReviewSubmit}>
                      <div className="mb-4">
                        <label
                          htmlFor="rating"
                          className="block mb-2 text-gray-600"
                        >
                          Rating:
                        </label>
                        <StarRatingInput
                          rating={newReview.rating}
                          onRatingChange={handleRatingChange}
                        />
                      </div>
                      <div className="mb-4">
                        <label
                          htmlFor="title"
                          className="block mb-2 text-gray-600"
                        >
                          Title:
                        </label>
                        <input
                          type="text"
                          id="title"
                          name="title"
                          value={newReview.title}
                          onChange={(e) =>
                            setNewReview({
                              ...newReview,
                              title: e.target.value,
                            })
                          }
                          className="w-full p-2 border rounded"
                          required
                        />
                      </div>
                      <div className="mb-4">
                        <label
                          htmlFor="description"
                          className="block mb-2 text-gray-600"
                        >
                          Description:
                        </label>
                        <textarea
                          id="description"
                          name="description"
                          value={newReview.description}
                          onChange={(e) =>
                            setNewReview({
                              ...newReview,
                              description: e.target.value,
                            })
                          }
                          className="w-full p-2 border rounded"
                          rows="4"
                        />
                      </div>
                      <div className="flex justify-end space-x-2">
                        <button
                          type="button"
                          onClick={() => setShowReviewForm(false)}
                          className="p-2 bg-gray-500 text-white rounded"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="p-2 bg-blue-500 text-white rounded"
                        >
                          Submit Review
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default BookDetails;
