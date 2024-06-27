// components/Sidebar.js
import { useRouter } from 'next/router';

const Sidebar = () => {
    const router = useRouter();

    const navigateTo = (path: any) => {
        router.push(path);
    };

    return (
        <div className="h-screen w-64 bg-gray-800 text-white flex flex-col p-4">
            <button
                className="mb-4 p-2 rounded hover:bg-gray-700"
                onClick={() => navigateTo('/home')}
            >
                Home
            </button>
            <button
                className="p-2 rounded hover:bg-gray-700"
                onClick={() => navigateTo('/about')}
            >
                About
            </button>
        </div>
    );
};

export default Sidebar;
