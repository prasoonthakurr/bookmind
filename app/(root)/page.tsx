import BookCard from "@/components/BookCard"
import Hero from "@/components/Hero"
import { getAllBooks } from "@/lib/actions/book.actions"

const page = async () => {
  const bookResults = await getAllBooks();
  const books = bookResults.success && Array.isArray(bookResults.data) ? bookResults.data : [];
  return (
    <main className="wrapper container">
      <Hero />
      <div className="library-books-grid">
        {books.map((book) => (
          <BookCard key={book._id} title={book.title} author={book.author} coverURL={book.coverURL} slug={book.slug} />
        ))}
      </div>
    </main>
  )
}

export default page