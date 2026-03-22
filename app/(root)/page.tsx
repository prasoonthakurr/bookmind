import BookCard from "@/components/BookCard"
import Hero from "@/components/Hero"
import Search from "@/components/Search";
import { getAllBooks } from "@/lib/actions/book.actions"
import { IBook } from "@/types";

const page = async ({ searchParams }: { searchParams: Promise<{ query?: string }> | { query?: string } }) => {
  const resolvedSearchParams = await Promise.resolve(searchParams);
  const query = (resolvedSearchParams?.query || '').trim();
  const bookResults = await getAllBooks(query || undefined);
  const books: IBook[] = bookResults.success && Array.isArray(bookResults.data) ? bookResults.data : [];

  return (
    <main className="wrapper container">
      <Hero />
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5 mb-10">
          <h2 className="text-3xl font-serif font-bold text-[#212a3b]">Recent Books</h2>
          <Search />
      </div>
      <div className="library-books-grid">
        {books.map((book) => (
          <BookCard key={book._id} title={book.title} author={book.author} coverURL={book.coverURL} slug={book.slug} />
        ))}
      </div>
    </main>
  )
}

export default page