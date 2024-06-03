interface SquareProps {
  letter: string
  bgColor: string
}

export const Square: React.FC<SquareProps> = ({ letter, bgColor }) => {
  return (
    <div
      style={{ backgroundColor: bgColor }}
      className="bg-gray-800 w-14 h-14 rounded-sm flex justify-center items-center font-semibold uppercase text-4xl transition-all duration-200 ease-in-out"
    >
      {letter}
    </div>
  )
}
