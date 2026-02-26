import React, { use, useEffect, useRef } from 'react'
import { useChatStore } from '../store/useChatStore'
import { useAuthStore } from '../store/useAuthStore';
import ChatHeader from './ChatHeader';
import MessageInput from './MessageInput';
import MessageSkeleton from './skeletons/MessageSkeleton';
import { formatMessageTime } from '../lib/utils';

function ChatContainer() {
    const { messages, getMessages, isMessagesLoading, selectedUser, subscribeToMessages, unsubscribeToMessages } = useChatStore();
    const { authUser, socket } = useAuthStore();
    const messageEndRef = useRef(null);
    useEffect(() => {
        if (!selectedUser || !selectedUser._id) return

        // Always fetch messages when a user is selected
        getMessages(selectedUser._id);

        // Subscribe to realtime updates only when socket is available
        if (socket) {
            subscribeToMessages();
            return () => {
                unsubscribeToMessages();
            }
        }
        // cleanup noop if no socket
        return undefined;
    }, [selectedUser, socket, getMessages, subscribeToMessages, unsubscribeToMessages])

    useEffect(() => {
        if (messageEndRef.current && messages) {
            messageEndRef.current.scrollIntoView({ behavior: "smooth" })
        }
    }, [messages])

    if (isMessagesLoading) return <div className='flex flex-1 flex-col overflow-auto'>
        <ChatHeader />
        <MessageSkeleton />
        <MessageInput />
    </div>
    return (
        <div className='flex flex-1 flex-col overflow-auto'>
            <ChatHeader />
            <div className='flex-1 overflow-y-auto p-4 space-y-4'>
                {messages.map((message) => (
                    <div
                        key={message._id}
                        className={`chat ${message.senderId === authUser._id ? "chat-end" : "chat-start"}`}
                        ref={messageEndRef}
                    >
                        <div className='chat-image avatar'>
                            <div className='size-10 rounded-full border'>
                                <img src={message.senderId === authUser._id ? authUser.profilePic || "/avatar.png" : selectedUser.profilePic || "/avatar.png"} alt='Profile Pic' />
                            </div>
                        </div>
                        <div className='chat-bubble flex flex-col gap-2'>
                            {message.image && <img src={message.image} alt='Attached' className='sm:max-w-[200px] rounded-md' />}
                            {message.text && <p>{message.text}</p>}
                        </div>
                        <div className='chat-header mb-1'>
                            <time className='text-xs opacity-50 ml-1'>{formatMessageTime(message.createdAt)}</time>
                        </div>
                    </div>
                ))}
            </div>
            <MessageInput />
        </div>
    )
}

export default ChatContainer