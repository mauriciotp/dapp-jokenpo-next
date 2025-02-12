import { InputHTMLAttributes } from 'react'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  valueType: string
  buttonText: string
}

export function Input({ id, buttonText, valueType, ...props }: InputProps) {
  return (
    <div className="flex items-stretch">
      <input
        {...props}
        id={id}
        className="flex-1 appearance-none rounded-l border-none px-4 py-3 text-black outline-none [&::-moz-number-spin-box]:appearance-none [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
        type="number"
      />
      <span className="bg-gray-700 px-4 py-3 text-lg font-bold">
        {valueType}
      </span>
      <button className="rounded-r bg-blue-600 px-4 py-3 text-lg">
        {buttonText}
      </button>
    </div>
  )
}
