'use server';

import Book from "@/database/models/book.model";
import { connectToDB } from "@/database/mongoose";
import { CreateBook, IBook, TextSegment } from "@/types";
import { generateSlug, serializeData } from "../utils";
import BookSegment from "@/database/models/book-segment.model";

export const getAllBooks = async () => {
    try{
        await connectToDB();
        const books = await Book.find().sort({ createdAt: -1 }).lean<IBook[]>();
        return {
            success: true,
            data: serializeData(books),
        }
    } catch(e) {
        console.error('Error fetching books:', e);
        return {
            success: false,
            error: e,
        }
    }
}

export const checkBookExists = async (title: string) => {
    try{
        await connectToDB();
        const slug = generateSlug(title);
        const existingBook = await Book.findOne({ slug }).lean<IBook | null>();
        return {
            exists: !!existingBook,
            data: existingBook ? serializeData(existingBook) : null,
        }
    } catch(e) {
        console.error('Error checking book existence:', e);
        return {
            exists: false,
            error: e,
        }
    }
}

export const createBook = async (data: CreateBook) => {
    try {
        await connectToDB();
        const slug = generateSlug(data.title);
        const existingBook = await Book.findOne({ slug }).lean<IBook | null>();
        if (existingBook) {
            return {
                success: true,
                data: serializeData(existingBook),
                alreadyExists: true,
            }
        }
        // Check subscription limits before creating book
        const book = await Book.create({
            ...data,
            slug,
            totalSegments: 0,
        });
        return {
            success: true,
            data: serializeData(book),
        }
    } catch (e) {
        console.error('Error creating book:', e);
        return {
            success: false,
            error: e,
        }
    }
}

export const saveBookSegments = async (bookId: string, clerkId: string, segments: TextSegment[]) => {
    try {
        await connectToDB();
        console.log('Saving Book Segments');
        const segmentsToInsert = segments.map(segment => ({
            clerkId,
            bookId,
            content: segment.text,
            segmentIndex: segment.segmentIndex,
            pageNumber: segment.pageNumber,
            wordCount: segment.wordCount,
        }));
        await BookSegment.insertMany(segmentsToInsert);
        await Book.findByIdAndUpdate(bookId, { totalSegments: segments.length });
        console.log('Book Segments saved successfully');
        return {
            success: true,
            data: {segmentsCreated: segments.length},
        }
    } catch (e) {
        console.error('Error saving book segments:', e);

        await BookSegment.deleteMany({ bookId });
        await Book.findByIdAndDelete(bookId);
        console.log('Deleted Book Segements and Book due to error during segment saving');
        return {
            success: false,
            error: e,
        }
    }
}

