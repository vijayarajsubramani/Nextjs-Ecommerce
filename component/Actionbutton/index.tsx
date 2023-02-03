import React, { forwardRef } from 'react'
import style from "./styles.module.scss";

type TActionButtonProps = {
  text: string,
  icon?:any,
  onClick?:any,
  ref?:any,
} & React.ButtonHTMLAttributes<HTMLButtonElement>

const ActionButton: React.FC<TActionButtonProps> = forwardRef(({ icon, text, onClick, ...props },ref) => {

  const clickHandler = (): void => {
    if (onClick) onClick();
  }

  return (
    <button onClick={clickHandler} ref={ref}  {...props}>{icon}{text}</button>
  )
})

export default ActionButton