export default function Note() {
    return (
        <div className="flex flex-col w-full p-2 shadow-2xl rounded-lg bg-gray-100">
            <div className="flex flex-col space-y-2 p-2 text-start  rounded-lg">


                <div className="w-min">
                    <h2 className="text-xl font-semibold">super duper long title like really long wkwkwkwwk</h2>
                </div>
                <hr />
                <p>body</p>
                <div className="flex justify-between items-center">

                    <p>
                        {new Date().toLocaleDateString()}
                    </p>
                    <div className="flex justify-end items-center space-x-4">
                        <button className="bg-green-500 p-2 rounded-lg">Check</button>
                        <button className="bg-red-500 p-2 rounded-lg">Delete</button>
                    </div>
                </div>
                <div>
                </div>
            </div>
        </div>
    )
}
