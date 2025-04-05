import {create} from "zustand"
import  {axiosInstance} from "../lib/axios"
import toast from "react-hot-toast"
import axios from "axios"

export const userStore = create((get,set) => ({
    user:null,
    loading : false,
    checkingAuth : true,

    signup : async({name,email,password,confirmPassword}) => {
        set({loading : true})

        if(password !== confirmPassword){
            return toast.error("Password do not match")
        }

        try {
            const res = await axiosInstance.post("/auth/signup",{name,email,password})
            toast.success(res.data.message)
            set({user : res.data.user,loading : false})
        } catch (error) {
            set({loading : false})
            toast.error(error.response.data.message || "An error occurred")
        }

    }
}))