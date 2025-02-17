import { useEffect, useState } from 'react'

function App() {
 
  const [isToggled, setIsToggled] = useState(false)

  useEffect(() => {
    if(chrome?.storage){
      chrome.storage.sync.get("focusMode", (data) => {
        if(data.focusMode!==undefined){
          setIsToggled(data.focusMode);
        }
      })
    }
  },[]);

  const handleToggle = () => {
    const newState = !isToggled;
    setIsToggled(newState);

    if (chrome?.runtime) {
        chrome.runtime.sendMessage(
            { action: "TOGGLE_FOCUS_MODE", state: newState },
            (response) => {
                if (chrome.runtime.lastError) {
                    console.error("Chrome runtime error:", chrome.runtime.lastError);
                } else if (response && response.status === "success") {
                    console.log("Focus Mode successfully updated:", newState);
                    // Optional: Force content script to reapply the filter
                    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
                        if (tabs[0]?.id) {
                            chrome.scripting.executeScript({
                                target: { tabId: tabs[0].id },
                                function: applyFocusMode
                            });
                        }
                    });
                }
            }
        );
    }  
};


  return (
    <div className='flex flex-col items-center justify-center h-96 w-80'>
      <h1 className='text-4xl font-bold mb-6'>Focus Mode</h1>
      <div className={`flex bg-black w-20 h-10 rounded-4xl cursor-pointer `} 
      onClick={handleToggle}>
        <span className={`bg-amber-50 w-10 h-10 rounded-full transition-all duration-500 ease-in-out ${isToggled ? 'transform translate-x-10 bg-amber-400':''}`}/>
      </div>
    </div>
  )
}

export default App
