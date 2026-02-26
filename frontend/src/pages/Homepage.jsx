import React from 'react'
import { useChatStore } from '../store/useChatStore'
import SideBar from '../components/SideBar';
import NoChatSelected from '../components/NoChatSelected';
import ChatContainer from '../components/ChatContainer';

function Homepage() {
  const { selectedUser } = useChatStore();
  return (
    <div className='h-screen bg-base-200'>
      <div className='flex items-center justify-center pt-16 px-0 sm:px-4 sm:pt-20'>
        <div className='bg-base-100 rounded-none sm:rounded-lg shadow-cl w-full max-w-6xl h-[calc(100vh-4rem)] sm:h-[calc(100vh-8rem)]'>
          <div className='flex h-full rounded-none sm:rounded-lg overflow-hidden'>

            {/* Sidebar: full-width on mobile (when no user selected), icon-only at sm, wide at lg */}
            <div className={`
              ${selectedUser ? 'hidden' : 'flex'} sm:flex
              flex-shrink-0
            `}>
              <SideBar />
            </div>

            {/* Chat / Welcome area: hidden on mobile when no user, always shown sm+ */}
            <div className={`
              ${selectedUser ? 'flex' : 'hidden'} sm:flex
              flex-1 flex-col overflow-hidden
            `}>
              {!selectedUser ? <NoChatSelected /> : <ChatContainer />}
            </div>


          </div>
        </div>
      </div>
    </div>
  )
}

export default Homepage