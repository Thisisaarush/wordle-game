interface OnScreenKeyboardProps {
  handleKeyDown: (onScreenKey?: string, event?: KeyboardEvent) => void
}

export const OnScreenKeyboard: React.FC<OnScreenKeyboardProps> = ({
  handleKeyDown,
}) => {
  const keyRows = [
    ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"],
    ["A", "S", "D", "F", "G", "H", "J", "K", "L"],
    ["Z", "X", "C", "V", "B", "N", "M"],
  ]
  const backspaceEnter = ["Backspace", "Enter"]

  return (
    <div className="flex flex-col justify-center items-center gap-2">
      {keyRows.map((row, index) => (
        <div key={index} className="flex justify-center gap-1 md:gap-2">
          {row.map((key) => (
            <div
              key={key}
              onClick={() => handleKeyDown(key)}
              className="flex justify-center items-center size-8 text-2xl md:size-14 md:text-3xl bg-slate-400 text-black rounded-md  font-medium cursor-default select-none dark:bg-slate-400  active:scale-95"
            >
              {key}
            </div>
          ))}
        </div>
      ))}

      <div className="flex justify-center items-center gap-2">
        {backspaceEnter.map((key) => (
          <div
            key={key}
            onClick={() => handleKeyDown(key)}
            className="flex justify-center items-center size-fit text-xl md:text-3xl px-4 py-2 bg-slate-400 text-black rounded-md font-medium cursor-default select-none dark:bg-slate-400  active:scale-95"
          >
            {key}
          </div>
        ))}
      </div>
    </div>
  )
}
