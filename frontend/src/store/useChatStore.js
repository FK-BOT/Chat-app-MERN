import  {create} from "zustand"
import toast from "react-hot-toast"
import { axiosInstance } from "../lib/axios"
import { useAuthStore } from "./useAuthStore"

export const useChatStore = create((set, get) => ({
    messages:[],
    users:[],
    selectedUser:null,
    isUsersLoading:false,
    isMessagesLoading:false,

    getUsers:async()=>{
        set({isUsersLoading:true})
        try {
            const res=await axiosInstance.get("/messages/users")
            set({users:res.data})
        } catch (error) {
            toast.error(error.response.data.message)
        }
        finally{
            set({isUsersLoading:false})
        }
    },
    getMessages:async(userId)=>{
        set({isMessagesLoading:true})
        try {
            const res=await axiosInstance.get(`/messages/${userId}`)
            set({messages:res.data})
        } catch (error) {
            toast.error(error.response.data.message)
        }
        finally{
            set({isMessagesLoading:false})
        }
    },
    sendMessage:async(messagedata)=>{
        const {selectedUser,messages}=get()
        try {
            const res = await axiosInstance.post(`/messages/send/${selectedUser._id}`,messagedata) 
            set({messages:[...messages,res.data]})
        } catch (error) {
            toast.error(error.response.data.message)
        }
    },
    subscribeToMessages: () => {
        const {selectedUser} = get()
        // nothing to subscribe to if no user selected
        if (!selectedUser) return
        const socket = useAuthStore.getState().socket;
        // socket might not be initialized yet (e.g. still connecting)
        if (!socket) return

        // remove any existing listener to avoid duplicates
        socket.off("newMessage")

        

        socket.on("newMessage", (newMessage) => {
            if(newMessage.senderId !== selectedUser._id) return;
            // avoid duplicates if message already exists (can happen from race between fetch and socket)
            const exists = get().messages.some(m => String(m._id) === String(newMessage._id));
            if (exists) return;
            set({messages: [...get().messages, newMessage]})
        })
    },
    unsubscribeToMessages: () => {
        const socket = useAuthStore.getState().socket;
        if (!socket) return
        socket.off("newMessage")
    },

    
    setSelectedUser: async(selectedUser) => set({selectedUser}),
}))