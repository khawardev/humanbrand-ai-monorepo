
interface ContainerProps {
    children: React.ReactNode;
    className?: string;
}

export const ContainerNoPy = ({ children, className = "" }: ContainerProps) => {
    return (
        <div
            className={`mx-auto max-w-6xl ${className}`}
        >
            {children}
        </div>
    );
};

export const ContainerXs = ({ children, className = "" }: ContainerProps) => {
    return (
        <div
            className={`flex flex-col space-y-4 xl:px-0 px-4 py-10 mx-auto max-w-6xl xl:py-13 ${className}`}
        >
            {children}
        </div>
    );
};

export const ContainerSm = ({ children, className = "" }: ContainerProps) => {
    return (
        <div
            className={`flex flex-col space-y-6  xl:px-0 px-4 py-15 mx-auto max-w-6xl  xl:mx-auto xl:py-26 ${className}`}
        >
            {children}
        </div>
    );
};

export const ContainerMd = ({ children, className = "" }: ContainerProps) => {
    return (
        <div
            className={`flex flex-col space-y-8 xl:px-0 px-4  mx-auto max-w-7xl pt-26 xl:pt-36 ${className}`}
        >
            {children}
        </div>
    );
};

export const ContainerLg = ({ children, className = "" }: ContainerProps) => {
    return (
        <div
            className={`flex flex-col space-y-10 xl:px-0 px-4 py-36 mx-auto max-w-6xl xl:py-48 ${className}`}
        >
            {children}
        </div>
    );
};

export const ContainerXl = ({ children, className = "" }: ContainerProps) => {
    return (
        <div
            className={`flex flex-col space-y-12 xl:px-0 px-4 py-48 mx-auto max-w-6xl xl:py-60 ${className}`}
        >
            {children}
        </div>
    );
};

export const Container2Xl = ({ children, className = "" }: ContainerProps) => {
    return (
        <div
            className={`flex flex-col space-y-16 xl:px-0 px-4 py-60 mx-auto max-w-6xl xl:py-74 ${className}`}
        >
            {children}
        </div>
    );
};