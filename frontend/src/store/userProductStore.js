import { create } from "zustand"
import { axiosInstance } from "../lib/axios"
import toast from "react-hot-toast"

export const useProductStore = create((set) => ({
    products: [],
    loading: false,
    setProducts: (products) => set({ products }),


    createProduct: async (productData) => {
        set({ loading: true })

        try {
            const res = await axiosInstance.post("/products", productData)

            set((prevState) => ({
                products: [...prevState.products, res.data.product]
            }))
            toast.success("Product is created")
        } catch (error) {
            toast.error(error.response.data.error)
        } finally {
            set({ loading: false })
        }
    },


    fetchAllProducts : async () => {
        set({loading:true})

        try {
            const response = await axiosInstance.get("/products")
            set({products : response.data.products})
        } catch (error) {
            set({error : "Failed to fetch products"})
            toast.error(error.response.data.error || "Failed to fetch products")
        }finally{
            set({loading : false})
        }
    },

    deleteProduct : async (productId) => {
        set({loading : true})
        try {
            const response = await axiosInstance.delete(`/products/${productId}`)
            set((prevState) => ({
                products : prevState.products.filter((product) => product._id !== productId)
            }))
        } catch (error) {
            toast.error(error.response.data.error || "Failed to delete products")
        }finally{
            set({loading : false})
        }
    },

    toggleFeaturedProduct : async (productId) => {
        set({loading : true})
        try {
            const response = await axiosInstance.patch(`/products/${productId}`)
            set((prevState) => ({
                products : prevState.products.map((product) => product._id === productId ? {...product,isFeatured : response.data.products.isFeatured} : product)
            }))
        } catch (error) {
            toast.error(error.response.data.error || "Failed to update product")
        }finally{
            set({loading : false})
        }
    }

}))