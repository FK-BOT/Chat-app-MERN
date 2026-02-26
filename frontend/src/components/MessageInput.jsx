import React, { useRef, useState } from 'react'
import { useChatStore } from '../store/useChatStore';
import { Send, Image, X } from 'lucide-react';
import toast from 'react-hot-toast';

function MessageInput() {
  const [text, settext] = useState("");
  const [imagePreview, setImagePreview] = useState(null)
  const fileinputRef = useRef(null)
  const { sendMessage } = useChatStore()

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      toast.error("Please select a valid image file");
      return;
    }

    // Enforce 5MB limit on client-side
    const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
    if (file.size > MAX_FILE_SIZE) {
      toast.error("File size must be less than 5MB");
      // reset input so user can pick again
      if (fileinputRef.current) fileinputRef.current.value = "";
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
    }
    reader.readAsDataURL(file);
  }
  const removeImage = (e) => {
    setImagePreview(null);
    if (fileinputRef.current) {
      fileinputRef.current.value = "";
    }
  }
  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!text.trim() && !imagePreview) {
      toast.error("Please enter a message or select an image");
      return;
    }
    try {
      await sendMessage({
        text: text.trim(),
        image: imagePreview,
      })
      settext("");
      setImagePreview(null);
      if (fileinputRef.current) {
        fileinputRef.current.value = "";
      }
    } catch (error) {
      console.log("Failed to send message", error);
    }
  }


  return (
    <div className="p-4 w-full">
      {imagePreview && (
        <div className="mb-3 flex items-center gap-2">
          <div className="relative">
            <img
              src={imagePreview}
              alt="Preview"
              className="w-20 h-20 object-cover rounded-lg border border-zinc-700"
            />
            <button
              onClick={removeImage}
              className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-base-300
              flex items-center justify-center"
              type="button"
            >
              <X className="size-3" />
            </button>
          </div>
        </div>
      )}
      <form onSubmit={handleSendMessage} className='flex items-center gap-2'>
        <div className='flex-1 flex gap-2'>
          <input
            type="text"
            placeholder="Type your message..."
            className="input input-bordered w-full rounded-lg input-sm sm:input-md"
            value={text}
            onChange={(e) => settext(e.target.value)}
          />
          <input type="file"
            accept='image/*'
            className='hidden'
            ref={fileinputRef}
            onChange={handleImageChange} />
          <button
            type="button"
            className={`flex btn btn-circle ${imagePreview ? 'text-emerald-500' : 'text-zinc-400'}`}
            onClick={() => fileinputRef.current?.click()}
          >
            <Image size={20} />
          </button>
        </div>
        <button
          type='submit'
          className={`btn btn-sm btn-circle`}
          disabled={!text.trim() && !imagePreview}>
          <Send size={22} />
        </button>
      </form>
    </div>
  )
}

export default MessageInput