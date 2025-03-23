import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import InfoPage from "@/Components/Partials/InfoPage";
import Nav from "@/Components/Partials/Nav";
import Sidebar from "@/Components/Partials/Sidebar";

function Home({auth}) {
    return (
        <>
            <AuthenticatedLayout user={auth.user} sidebar={<Sidebar />} header={<Nav />}>
            <h3>Hello world</h3>
            </AuthenticatedLayout>
        </>
    );
}

export default Home;