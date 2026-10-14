import { create } from 'zustand';
import { CartItem } from '@/lib/types/index';
import { devtools, persist } from 'zustand/middleware';

interface CartState {
    items: CartItem[];
    addItem: (item: Omit<CartItem, 'quantity'>) => void;
    removeItem: (id: string) => void;
    clearCart: () => void;
    updateQuantity: (id: string, quantity: number) => void;
}

export const useCartStore = create<CartState>()(
    devtools(
        persist(
            (set) => ({
                items: [],

                addItem: (item) => set((state) => {
                    const exists = state.items.find((i) => i.id === item.id);
                    if (exists) {
                        if (exists.quantity >= exists.stock) return state; // No se puede agregar más de lo que hay en stock
                        return {
                            items: state.items.map((i) =>
                                i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
                            ),
                        };
                    }

                    if (item.stock < 1) return state; // No se puede agregar un item sin stock
                    return {
                        items: [...state.items, { ...item, quantity: 1 }],
                    };
                }),

                removeItem: (id) => set((state) => ({ items: state.items.filter((item) => item.id !== id) })),

                clearCart: () => set({ items: [] }),

                updateQuantity: (id, quantity) =>
                    set((state) => {
                        if (quantity <= 0) {
                            return { items: state.items.filter((item) => item.id !== id) };
                        }
                        return {
                            items: state.items.map((item) =>
                                item.id === id ? { ...item, quantity: Math.min(quantity, item.stock) } : item
                            ),
                        };
                    }),
            }),
            {
                name: 'cart-storage',
            }
        ),
    ),
);

//Helpers

// Calcula el total de items en el carrito
export const selectTotalItems = (state: CartState) =>
    state.items.reduce((sum, i) => sum + i.quantity, 0);

// Calcula el precio total del carrito
export const selectTotalPrice = (state: CartState) => {
    const total = state.items.reduce((sum, i) => sum + i.price * i.quantity, 0);
    return Math.round(total * 100) / 100; // Redondea a dos decimales
};
