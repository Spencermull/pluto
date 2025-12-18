export default function FavoriteButton({ isFavorite, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="absolute top-3 right-3 text-lg z-10 hover:scale-110 transition-transform duration-200"
      aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
    >
      <span className={`${isFavorite ? "text-yellow-400" : "text-white/30"} group-hover:text-yellow-400 transition-colors duration-200`}>
        {isFavorite ? "★" : "☆"}
      </span>
    </button>
  );
}
