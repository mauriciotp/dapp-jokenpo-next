import { InputHTMLAttributes } from 'react'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  valueType: string
}

export function Input({ id, valueType, ...props }: InputProps) {
  return (
    <>
      <input
        {...props}
        id={id}
        className="flex-1 appearance-none rounded-l border-none px-4 py-3 text-black outline-none [&::-moz-number-spin-box]:appearance-none [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
        type="number"
      />
      <span className="bg-gray-700 px-4 py-3 text-lg font-bold">
        {valueType}
      </span>
    </>
  )
}
