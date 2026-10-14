export type CartItem = {
    id: string;
    title: string;
    author: string;
    price: number;
    coverImageUrl: string | null;
    stock: number;
    quantity: number;
};

export type CreateBookDTO = {
    isbn: string;
    title: string;
    author: string;
    stock: number;
    price: number;
    publisher?: string;
    description?: string;
    language?: string;
    pageCount?: number;
    coverImageUrl: string;
}