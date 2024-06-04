interface SquareProps {
  letter: string
  bgColor?: string
  classNames?: string
}

export const Square: React.FC<SquareProps> = ({
  letter,
  bgColor,
  classNames,
}) => {
  return (
    <div
      style={{ backgroundColor: bgColor }}
      className={`bg-gray-800 text-white size-14 rounded-sm flex justify-center items-center font-semibold uppercase text-4xl transition-all duration-100 ease-in-out dark:bg-transparent dark:border dark:border-gray-500 cursor-default select-none ${classNames}`}
    >
      {letter}
    </div>
  )
}
