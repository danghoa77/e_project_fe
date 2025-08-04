// src/components/shared/NotFoundPage.tsx
import { Link } from 'react-router-dom';

const NotFoundPage = () => {
  return (
    <div className="flex flex-col items-center justify-center h-[60vh] text-center">
      <h1 className="text-6xl font-bold text-gray-800">404</h1>
      <h2 className="text-2xl font-semibold text-gray-600 mt-4">Page Not Found</h2>
      <p className="text-gray-500 mt-2">
        Sorry, the page you are looking for does not exist.
      </p>
      <Link
        to="/"
        className="mt-6 px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
      >
        Go to Homepage
      </Link>
    </div>
  );
};

export default NotFoundPage;
