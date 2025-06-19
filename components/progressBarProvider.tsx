'use client';
import { AppProgressBar as ProgressBar } from 'next-nprogress-bar';

const Providers = ({ children }: any) => {
    return (
        <>
            {children}
            <ProgressBar
                height="1px"
                color="hsl(var(--foreground))"
                options={{ showSpinner: false }}
                shallowRouting
            />
        </>
    );
};

export default Providers;