import * as z from 'zod';

export const bookSchema = z.object({
  isbn: z.string().nonempty({ message: 'ISBN is required' }),
  title: z.string().nonempty({ message: 'Title is required' }),
  author: z.string().nonempty({ message: 'Author is required' }),
  stock: z.number().int().nonnegative({ message: 'Stock must be a non-negative integer' }),
  price: z.number().positive({ message: 'Price must be a non-negative number' }),
  publisher: z.string().nonempty().optional(),
  description: z.string().nonempty().optional(),
  language: z.string().nonempty().optional(),
  pageCount: z.number().int().positive({ message: 'Page count must be a non-negative integer' }).optional(),
  coverImageUrl: z.url({ message: 'Cover image URL must be a valid URL' }).nonempty({ message: 'Cover image URL is required' }),
});