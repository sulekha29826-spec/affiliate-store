export default function Pagination({ page, pages, onPage }) {
  if (pages <= 1) return null;
  const nums = Array.from({ length: pages }, (_, i) => i + 1).filter((n) => n === 1 || n === pages || Math.abs(n - page) <= 2);
  return (
    <div className="flex gap-2 justify-center mt-8">
      {nums.map((n, i) => {
        const prev = nums[i - 1];
        return (
          <>
            {prev && n - prev > 1 && <span key={`dots-${n}`} className="px-2 py-1 text-gray-400">…</span>}
            <button key={n} onClick={() => onPage(n)}
              className={`px-3 py-1 rounded text-sm ${page === n ? 'bg-indigo-600 text-white' : 'bg-white border hover:bg-gray-50'}`}>
              {n}
            </button>
          </>
        );
      })}
    </div>
  );
}
