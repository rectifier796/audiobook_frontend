import { useState } from "react";
import { FaStar, FaStarHalfAlt } from "react-icons/fa";

function StarRatingInput({ rating, onRatingChange }) {
  const [hoverRating, setHoverRating] = useState(0);

  // Handle click event on a star
  const handleClick = (selectedRating) => {
    onRatingChange(selectedRating);
  };

  return (
    <div className="flex items-center ml-2">
      {[1, 2, 3, 4, 5].map((index) => {
        const filled = index <= (hoverRating || rating);
        const halfFilled = !filled && index <= (hoverRating || rating) + 0.5;

        return (
          <div
            key={index}
            className="cursor-pointer"
            onMouseEnter={() => setHoverRating(index)}
            onMouseLeave={() => setHoverRating(0)}
            onClick={() => handleClick(index)}
          >
            {filled ? (
              <FaStar className="text-yellow-500" />
            ) : halfFilled ? (
              <FaStarHalfAlt className="text-yellow-500" />
            ) : (
              <FaStar className="text-gray-400" />
            )}
          </div>
        );
      })}
    </div>
  );
}

export default StarRatingInput;
