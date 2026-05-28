const Button = ({ children, onClick, type = 'button', variant = 'primary', className = '', ...props }) => {
    const variants = {
        primary: 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-500/20',
        secondary: 'bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-900 dark:text-slate-100',
        ghost: 'bg-transparent hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400',
        danger: 'bg-red-600 hover:bg-red-700 text-white shadow-lg shadow-red-500/20',
    };


    return (
        <button
            type={type}
            onClick={onClick}
            className={`px-6 py-2.5 rounded-xl font-semibold transition-all duration-200 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed ${variants[variant]} ${className}`}
            {...props}
        >
            {children}
        </button>
    );
};

export default Button;
