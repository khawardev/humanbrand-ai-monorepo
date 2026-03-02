import { Spinner } from "./SpinnerLoader"

const Loading = () => {
    return (
        <div className='flex gap-2 text-muted-foreground text-sm justify-center items-center min-h-screen'>
            <Spinner /> loading...
        </div>

    )
}

export default Loading