export default function Layout({ title, children }) {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-md rounded-2xl bg-white shadow-lg p-6">
        <h1 className="text-2xl font-bold mb-4 text-center">{title}</h1>
        {children}
      </div>
    </div>
  );
}
