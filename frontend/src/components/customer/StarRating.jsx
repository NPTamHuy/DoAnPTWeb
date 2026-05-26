import { Star } from 'lucide-react';

export default function StarRating({
  average = 0,
  count = 0,
  size = 14,
  showCount = true,
}) {
  return (
    <div className="flex items-center gap-1.5">
      <div className="flex items-center gap-0.5">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            size={size}
            className={
              i < Math.round(average)
                ? 'text-yellow-400 fill-yellow-400'
                : 'text-gray-200 fill-gray-200'
            }
          />
        ))}
      </div>
      {showCount && (
        <span className="text-xs text-gray-400">
          {average > 0 ? `${average} (${count})` : 'Chưa có đánh giá'}
        </span>
      )}
    </div>
  );
}
