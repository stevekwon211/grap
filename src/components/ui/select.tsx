import React, { useState } from "react";

interface SelectProps {
    onValueChange: (value: string) => void;
    children: React.ReactNode;
    placeholder?: string;
    className?: string;
}

export const Select: React.forwardRef<HTMLSelectElement, React.HTMLAttributes<HTMLSelectElement>>(
    ({ className, ...props }, ref) => {
        const [isOpen, setIsOpen] = useState(false);
        const [selectedValue, setSelectedValue] = useState("");

        const handleSelect = (value: string) => {
            setSelectedValue(value);
            onValueChange(value);
            setIsOpen(false);
        };

        return (
            <div className="relative">
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className={`w-full px-3 py-2 text-left bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${className}`}
                >
                    {selectedValue || placeholder || "Select..."}
                </button>
                {isOpen && (
                    <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg">
                        {React.Children.map(children, (child) => {
                            if (React.isValidElement(child) && child.type === SelectItem) {
                                return React.cloneElement(child, {
                                    onClick: () => handleSelect(child.props.value),
                                });
                            }
                            return child;
                        })}
                    </div>
                )}
            </div>
        );
    }
);

interface SelectItemProps {
    value: string;
    children: React.ReactNode;
    onClick?: () => void;
}

export const SelectItem: React.FC<SelectItemProps> = ({ children, onClick }) => {
    return (
        <div onClick={onClick} className="px-3 py-2 cursor-pointer hover:bg-gray-100">
            {children}
        </div>
    );
};

export const SelectTrigger: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className }) => (
    <div className={className}>{children}</div>
);
export const SelectContent: React.FC<{ children: React.ReactNode }> = ({ children }) => <>{children}</>;
export const SelectValue: React.FC<{ children?: React.ReactNode; placeholder?: string }> = ({
    children,
    placeholder,
}) => <>{children || placeholder}</>;
