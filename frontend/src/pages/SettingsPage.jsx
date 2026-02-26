import { THEMES } from "../constants"; // Keeping your external file
import { useThemeStore } from "../store/useThemeStore";
import { Send, Moon, Sun, Check } from "lucide-react";

const PREVIEW_MESSAGES = [
  { id: 1, content: "Hey! How's it going?", isSent: false },
  { id: 2, content: "I'm doing great! Just working on some new features.", isSent: true },
];

const SettingsPage = () => {
  const { theme, setTheme } = useThemeStore();

  // We filter your existing THEMES array to keep only the two you want
  const displayedThemes = THEMES.filter(t => t === "light" || t === "dark");

  return (
    <div className="h-screen container mx-auto px-4 pt-20 max-w-5xl">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-1">
          <h2 className="text-lg font-semibold">Appearance</h2>
          <p className="text-sm text-base-content/70">Switch between light and dark modes</p>
        </div>

        {/* Theme Selection */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {displayedThemes.map((t) => (
            <button
              key={t}
              onClick={() => setTheme(t)}
              className={`
                relative p-8 rounded-2xl border-2 transition-all duration-200 flex flex-col items-center justify-center gap-6
                ${theme === t 
                  ? "border-primary bg-primary/10 shadow-lg" 
                  : "border-base-300 hover:border-base-content/30 bg-base-100"
                }
              `}
            >
              {/* Icon */}
              <div className={`p-6 rounded-full ${theme === t ? "bg-primary/20" : "bg-base-200"}`}>
                {t === "light" ? (
                  <Sun size={48} className={theme === t ? "text-primary" : "text-base-content/60"} />
                ) : (
                  <Moon size={48} className={theme === t ? "text-primary" : "text-base-content/60"} />
                )}
              </div>

              {/* Label */}
              <div className="flex items-center gap-3">
                <span className="text-xl font-bold capitalize">{t}</span>
                {theme === t && (
                  <div className="bg-primary rounded-full p-1">
                    <Check size={16} className="text-primary-content" />
                  </div>
                )}
              </div>
            </button>
          ))}
        </div>

        {/* Preview Section - Remains Identical */}
        <h3 className="text-lg font-semibold mb-3">Preview</h3>
        <div className="rounded-xl border border-base-300 overflow-hidden bg-base-100 shadow-lg">
          <div className="p-4 bg-base-200">
            <div className="max-w-lg mx-auto">
              <div className="bg-base-100 rounded-xl shadow-sm overflow-hidden">
                {/* Chat Header */}
                <div className="px-4 py-3 border-b border-base-300 bg-base-100">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-content font-medium">
                      J
                    </div>
                    <div>
                      <h3 className="font-medium text-sm">John Doe</h3>
                      <p className="text-xs text-base-content/70">Online</p>
                    </div>
                  </div>
                </div>

                {/* Chat Messages */}
                <div className="p-4 space-y-4 min-h-[200px] max-h-[200px] overflow-y-auto bg-base-100">
                  {PREVIEW_MESSAGES.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.isSent ? "justify-end" : "justify-start"}`}
                    >
                      <div
                        className={`
                          max-w-[80%] rounded-xl p-3 shadow-sm
                          ${message.isSent ? "bg-primary text-primary-content" : "bg-base-200"}
                        `}
                      >
                        <p className="text-sm">{message.content}</p>
                        <p className={`text-[10px] mt-1.5 ${message.isSent ? "text-primary-content/70" : "text-base-content/70"}`}>
                          12:00 PM
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Chat Input */}
                <div className="p-4 border-t border-base-300 bg-base-100">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      className="input input-bordered flex-1 text-sm h-10"
                      placeholder="Type a message..."
                      value="This is a preview"
                      readOnly
                    />
                    <button className="btn btn-primary h-10 min-h-0">
                      <Send size={18} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;