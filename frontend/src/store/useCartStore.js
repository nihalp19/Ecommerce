import {create} from "zustand"
import { axiosInstance } from "../lib/axios"
import toast from "react-hot-toast"


export const useCartStore = create((set,get) => ({
    cart:[],
    coupon : null,
    total : 0,
    subtotal : 0,
    isCouponApplied : false,

    getCartItems : async () => {
        try {
            const res = await axiosInstance.get("/cart")
            console.log(res)
            set({cart : res.data.cartItems})
            get().calculateTotals()
        } catch (error) {
            set({cart : []})
            console.log("error",error.message)
            toast.error("An error occured")
        }
    },

    addToCart : async (product) => {
        try {
            await axiosInstance.post("/cart",{productId : product._id,})
            

            set((prevState) => {
                const existingItem = prevState.cart.find((item) => item._id === product._id)

                const newCart = existingItem ? prevState.cart.map((item) => item._id === product._id ? {...item,quantity : item.quantity + 1}  : item) : [...prevState.cart , {...product,quantity : 1}]

                return {cart : newCart}
            })

            get().calculateTotals()

        } catch (error) {
            toast.error(error.response.data.message || "An error occured")            
        }
    },

    calculateTotals : () => {
        const {cart,coupon} = get()

        const subtotal = cart.reduce((sum,item) => sum + item.price * item.quantity,0)

        let total = subtotal

        if(coupon){
            const discount = subtotal * (coupon.discountPercentage/ 100)
            total = subtotal - discount
        }

        set({subtotal,total})
    },

    removeFromCart : async(productId) => {
        try {
            await axiosInstance.delete("/cart",{productId : productId})
            set(prevState => ({cart : prevState.cart.filter((product) => product._id !== productId)}))
            get().calculateTotals()

        } catch (error) {
            toast.error(error.message)
        }
    },

    updateQuantity : async(productId,quantity) => {
        console.log("function is called")
        if(quantity === 0){
            get().removeFromCart(productId)
            return 
        }

        await axiosInstance.put(`/cart/${productId}`,{quantity :quantity})

        set((prevState) => ({
			cart: prevState.cart.map((item) => (item._id === productId ? { ...item, quantity } : item)),
		}));

        get().calculateTotals()
    }
})) 