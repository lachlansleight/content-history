const ProgressBar = ({
    progress,
    className = "",
}: {
    progress: number;
    className?: string;
}): JSX.Element => {
    return (
        <div className={`w-full h-8 border rounded relative ${className}`}>
            <div
                className="absolute h-full bg-blue-700 left-0 top-0 rounded transition-width duration-300"
                style={{ width: `${Math.round(progress * 100)}%` }}
            ></div>
            <div className="absolute w-full h-full grid place-items-center">
                <p className="text-center m-0">{Math.round(progress * 100)}%</p>
            </div>
        </div>
    );
};

export default ProgressBar;
