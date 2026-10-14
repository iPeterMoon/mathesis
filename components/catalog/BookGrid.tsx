"use client";
import { motion } from "framer-motion";
import { BookCard } from "./BookCard";
import type { CatalogBook } from "./types";

type BookGridProps = {
  books: CatalogBook[];
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
};

export function BookGrid({ books }: BookGridProps) {
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-6 lg:grid-cols-4 xl:grid-cols-5"
    >
      {books.map((book) => (
        <motion.div key={book.id} variants={itemVariants}>
          <BookCard book={book} />
        </motion.div>
      ))}
    </motion.div>
  );
}
