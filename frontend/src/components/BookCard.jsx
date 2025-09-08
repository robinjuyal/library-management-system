import { Edit, Trash2 } from "lucide-react"; 

const BookCard = ({ book, onBorrow, onReturn, onEdit, onDelete, userRole, loading }) => {
    return (
      <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20 hover:bg-white/20 transition-all duration-300 transform hover:scale-105">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h3 className="text-xl font-bold text-white mb-2">{book.title}</h3>
            <p className="text-blue-200 mb-1">by {book.author}</p>
            <p className="text-sm text-gray-300">ISBN: {book.isbn}</p>
          </div>
          <div className={`px-3 py-1 rounded-full text-xs font-medium ${
            book.available ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
          }`}>
            {book.available ? 'Available' : 'Borrowed'}
          </div>
        </div>
  
        <div className="flex gap-2 flex-wrap">
          {book.available ? (
            <button
              onClick={() => onBorrow(book.id)}
              disabled={loading}
              className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg font-medium disabled:opacity-50 transition-colors duration-200"
            >
              Borrow
            </button>
          ) : (
            <button
              onClick={() => onReturn(book.id)}
              disabled={loading}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg font-medium disabled:opacity-50 transition-colors duration-200"
            >
              Return
            </button>
          )}
          
          {userRole === 'ADMIN' && (
            <>
              <button
                onClick={() => onEdit(book)}
                className="p-2 bg-yellow-600 hover:bg-yellow-700 text-white rounded-lg transition-colors duration-200"
              >
                <Edit className="h-4 w-4" />
              </button>
              <button
                onClick={() => onDelete(book.id)}
                disabled={!book.available}
                className="p-2 bg-red-600 hover:bg-red-700 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </>
          )}
        </div>
      </div>
    );
  };
  export default BookCard;