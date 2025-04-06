import {create} from "zustand"


export const useProductStore = create((set) => ({
    products : [],
    loading : false,
    setProducts : (products) => set({products}),


    createProducr : async (productData) => {
        set({loading : true})
    }

}))