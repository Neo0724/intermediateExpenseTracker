/* eslint-disable no-case-declarations */
import React, { useEffect } from 'react'
import { useContext, useState } from 'react'
import axios from 'axios'
import { navbarItems } from '../Component/navbarItems'
import { useCookies } from 'react-cookie'

const GlobalContext = React.createContext()

export const GlobalContextProvider = ({ children }) => {
    const BASE_URL = "https://mern-expense-tracker-213j.onrender.com"

    const [expenses, setExpenses] = useState([])

    const [income, setIncome] = useState([])

    const userOwner = localStorage.getItem("User ID")

    const [ cookies, setCookies ] = useCookies(["access_token"])
    
    const [ close, setClose ] = useState(true)

    const [ loginErr, setLoginErr ] = useState({ text: "", error: false })

    const [ dashboardMonth, setDashboardMonth ] = useState("all")

    const [ transactionMonth, setTransactionMonth ] = useState({ income: "all", expense: "all"})

    const dictForMonth = {
        "all" : "Every Months",
        "01" : "January",
        "02" : "February",
        "03" : "March",
        "04" : "April",
        "05" : "May",
        "06" : "June",
        "07" : "July",
        "08" : "August",
        "09" : "September",
        "10" : "October",
        "11" : "November",
        "12" : "December",

  }

    const [ navbar, setNavbar ] = useState(() => {
      const exist = localStorage.getItem("Navbar")
      if (exist) {
        return JSON.parse(exist)
      } 

      return navbarItems
    })


    useEffect(() => {
      localStorage.setItem("Navbar", JSON.stringify(navbar))
    }, [navbar])

    const fetchExpenses = async () => {
        try {
            if (!userOwner) {
                setExpenses([])
                return
            }
            const response = await axios.get(`${BASE_URL}/expense/get-expense/${userOwner}`, { headers: { authorization: cookies.access_token } })
            setExpenses(response.data)
        } catch (err) {
            console.log(err)
        }
    }

    const fetchIncome = async () => {
        try {
            if (!userOwner) {
                setIncome([])
                return
            }
            const res = await axios.get(`${BASE_URL}/income/get-income/${userOwner}`, { headers: { authorization: cookies.access_token } })
            setIncome(res.data)
        } catch (err) {
            console.log(err)
        }
    }

    const getTotalIncome = () => {
        if (income.length === 0) {
            return 0
        }

        let totalIncome = 0

        if (dashboardMonth === "all") {
            income.map(item => {
                totalIncome += item.amount
            })

            return totalIncome.toFixed(2)
        }

        income.forEach(item => {
            if ( item.date.split("T")[0].split("-").reverse().join("-").split("-")[1].toString() === dashboardMonth ) {
                totalIncome += item.amount
            }
        })

        return totalIncome.toFixed(2)
    }

    const getTotalExpenses = () => {
        if (expenses.length === 0) {
            return 0
        }

        let totalExpenses = 0

        if (dashboardMonth === "all") {
            expenses.map(item => {
                totalExpenses += item.amount
            })

            return totalExpenses.toFixed(2)
        }

        expenses.forEach(item => {
            if ( item.date.split("T")[0].split("-").reverse().join("-").split("-")[1].toString() === dashboardMonth ) {
                totalExpenses += item.amount
            }
        })

        return totalExpenses.toFixed(2)

        
    }

    const getBalance = () => {
        return (getTotalIncome(dashboardMonth) - getTotalExpenses(dashboardMonth)).toFixed(2)
    }

    useEffect(() => {
        fetchExpenses()
        fetchIncome()
    },[cookies.access_token])

    const getSelectedMonthHistoryTransaction= () => {
        let selectedMonthIncome = income.filter(item => {
            if ( dashboardMonth === "all") {
                return item
            } else {
                return item.date.split("T")[0].split("-").reverse().join("-").split("-")[1].toString() === dashboardMonth
            }

        })

        let selectedMonthExpense = expenses.filter(item => {
            if ( dashboardMonth === "all") {
                return item
            } else {
                return item.date.split("T")[0].split("-").reverse().join("-").split("-")[1].toString() === dashboardMonth
            }
        })
        const history = ([...selectedMonthIncome, ...selectedMonthExpense]).sort((a,b) => new Date(b.date) - new Date(a.date))
        return history.splice(0, 3)
    }


    return (
        <GlobalContext.Provider value={{ expenses, income, setExpenses, setIncome, fetchExpenses, fetchIncome, BASE_URL, setNavbar, navbar, getTotalExpenses, getTotalIncome, getBalance, getSelectedMonthHistoryTransaction, setClose, close, setLoginErr, loginErr, dashboardMonth, setDashboardMonth, transactionMonth, setTransactionMonth, dictForMonth }}>
            { children }
        </GlobalContext.Provider>
    )
}

export const useGlobalContext = () => useContext(GlobalContext)

