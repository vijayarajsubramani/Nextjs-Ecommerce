import { FC, InputHTMLAttributes } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    name: string;
    label?: string;
    error?: any;
    register?: any;
    wrapperClass?: string;
    className?: string;
}

const Input: FC<InputProps> = ({ register, name, error, label, wrapperClass, ...rest }) => {
    return (
        <div className={wrapperClass}>
            {label && <label htmlFor={name}>{label}</label>}
            <input  {...register(name)}{...rest} />
            {error && <span className="error">{error}</span>}
        </div>
    );
};

export default Input;
