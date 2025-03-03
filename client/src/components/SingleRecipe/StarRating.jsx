import { useState, useEffect } from "react";

function StarRating({ initialRating = 0, onRatingChange }) {
  const [rating, setRating] = useState(initialRating);
  const [hoveredRating, setHoveredRating] = useState(0);

  useEffect(() => {
    setRating(initialRating);
    setHoveredRating(0);
  }, [initialRating]);

  const handleStarClick = (value) => {
    setRating(value);
    onRatingChange(value);
  };

  const handleMouseOver = (value) => {
    setHoveredRating(value);
  };

  const handleMouseOut = () => {
    setHoveredRating(rating);
  };

  const renderStars = () => {
    const totalStars = 5;
    const stars = [];

    for (let i = 1; i <= totalStars; i++) {
      const isFilled = i <= (hoveredRating || rating);
      stars.push(
        <span
          key={i}
          className={`star ${isFilled ? "active" : ""}`}
          onClick={() => handleStarClick(i)}
          onMouseOver={() => handleMouseOver(i)}
          onMouseOut={handleMouseOut}
          style={{ cursor: "pointer" }}
        >
          {isFilled ? "★" : "☆"}
        </span>
      );
    }

    return stars;
  };

  return <div>{renderStars()}</div>;
}

export default StarRating;
