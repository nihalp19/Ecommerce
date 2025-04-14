import { create } from "zustand"
import { axiosInstance } from "../lib/axios"
import toast from "react-hot-toast"

export const userStore = create((set, get) => ({
    user: null,
    loading: false,
    checkingAuth: true,

    signup: async ({ name, email, password, confirmPassword }) => {
        set({ loading: true })

        if (password !== confirmPassword) {
            return toast.error("Password do not match")
        }

        try {
            const res = await axiosInstance.post("/auth/signup", { name, email, password })
            toast.success(res.data.message)
            set({ user: res.data.user })
        } catch (error) {

            toast.error(error.response.data.message || "An error occurred")
        } finally {
            set({ loading: false })
        }

    },

    login: async (details) => {
        set({ loading: true })
        try {
            const res = await axiosInstance.post("/auth/login", details)
            toast.success(res.data.message)
            set({ user: res.data.user })
        } catch (error) {
            toast.error(error.response.data.message || "An error occurred")
        }
        finally {
            set({ loading: false })
        }
    },

    logout: async () => {
        try {
            const response = await axiosInstance.post("/auth/logout")
            set({user : null})
            toast.success(response.data.message)
        } catch (error) {
            toast.error(error.response.data.message || "An error occurred")
        }
    }
    ,
    checkAuth: async () => {
        try {
            const response = await axiosInstance.get("/auth/profile")
            set({ user: response.data.user })
        } catch (error) {
            console.log(error.message)
        } finally {
            set({ checkingAuth: false })
        }
    }
}))