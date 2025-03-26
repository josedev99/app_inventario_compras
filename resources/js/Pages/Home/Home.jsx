import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import InfoPage from "@/Components/Partials/InfoPage";
import Nav from "@/Components/Partials/Nav";
import Sidebar from "@/Components/Partials/Sidebar";
import { Head } from '@inertiajs/react';

function Home({auth}) {
    return (
        <>
            <AuthenticatedLayout user={auth.user} sidebar={<Sidebar />} header={<Nav />}>
            <Head title="Inicio" />
            <h3>Hello world</h3>
            </AuthenticatedLayout>
        </>
    );
}

export default Home;