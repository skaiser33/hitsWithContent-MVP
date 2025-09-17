export default function Banner({ id, children }) {
  return (
    <div
      role='complementary'
      aria-label={`Promotional banner ${id}`}
      className='my-6 rounded-xl border p-4'
    >
      {children}
    </div>
  );
}
