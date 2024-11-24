export default function TooltipButton() {
    return (
        <div className="relative group flex items-center justify-center">
            {/* Button */}
            <button className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600">
                Hover me
            </button>

            {/* Tooltip */}
            <div className="absolute bottom-full mb-2 hidden group-hover:flex px-3 py-1 text-sm text-white bg-gray-800 rounded shadow-lg">
                This is a tooltip!
            </div>
        </div>
    );
}
