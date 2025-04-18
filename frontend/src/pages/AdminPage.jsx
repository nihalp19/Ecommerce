import React, { useEffect } from 'react'
import { BarChart,PlusCircle,ShoppingBasket } from 'lucide-react'
import {motion} from "framer-motion"
import AnalyticsTab from '../components/AnalyticsTab'
import ProductsTab from '../components/ProductsTab'
import CreateProductForm from '../components/CreateProductForm'
import { useState } from 'react'
import { useProductStore } from '../store/userProductStore'

const tabs = [
    {id : "create",label : "Create Product", icon : PlusCircle},
    {id : "products" , label : "Products" , icon : ShoppingBasket},
    {id : "analytics" , label : "Analytics" , icon : BarChart}
]

function AdminPage() {
  const [activeTab,setActiveTab] = useState("create")

  const {fetchAllProducts,products} = useProductStore()

  useEffect(() => {
    const func = async() => {
        await fetchAllProducts()
    }
    func()
  },[fetchAllProducts])


  return (
    <div className='min-h-screen bg-gray-900 text-white relative overflow-hidden'>
        <div className='relative z-10 container mx-auto px-4 py-16'>
        <motion.h1 className='text-4xl font-bold mb-8 text-emerald-400 text-center'
           initial={{opacity : 0,y : -20}}
           animate ={{opacity : 1,y : 0}}
           transition={{duration : 0.8}} 
        >   
            Admin Dashboard
        </motion.h1>

        <div className='flex justify-center mb-8'>
            {tabs.map((tab) => (
                <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`flex items-center ml-2 px-4 py-2 rounded-md transition-colors duration-200 ${activeTab === tab.id ? "bg-emerald-600 text-white" : "bg-gray-700 text-gray-300 hover:bg-gray-600" }`}>
                    <tab.icon className='mr-2 h-5 w-5'/>
                    {tab.label}
                </button>
            ))}
            </div>
            {activeTab === "create" && <CreateProductForm/>}
            {activeTab === "products" && <ProductsTab/>}
            {activeTab === "analytics" && <AnalyticsTab/>}
        </div>
    </div>
  )
}

export default AdminPage