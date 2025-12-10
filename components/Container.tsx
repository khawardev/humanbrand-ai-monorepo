import React from 'react';

interface ContainerProps {
    children: React.ReactNode;
    className?: string;
}

export const ContainerXs = ({ children, className = '' }: ContainerProps) => {
    return <div className={`md:py-13 py-15 ${className}`}>{children}</div>;
};

export const ContainerSm = ({ children, className = '' }: ContainerProps) => {
    return <div className={`md:py-26 py-15 ${className}`}>{children}</div>;
};

export const ContainerMd = ({ children, className = '' }: ContainerProps) => {
    return <div className={`md:py-36 py-26  ${className}`}>{children}</div>;
};

export const ContainerLg = ({ children, className = '' }: ContainerProps) => {
    return <div className={`md:py-48 py-36 ${className}`}>{children}</div>;
};

export const ContainerXl = ({ children, className = '' }: ContainerProps) => {
    return <div className={`md:py-60 py-48 ${className}`}>{children}</div>;
};

export const Container2Xl = ({ children, className = '' }: ContainerProps) => {
    return <div className={`md:py-74 py-60 ${className}`}>{children}</div>;
};
