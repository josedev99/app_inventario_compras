import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import Nav from "@/Components/Partials/Nav";
import Sidebar from "@/Components/Partials/Sidebar";
import { Head } from '@inertiajs/react';

export default function Index({ auth }) {
    return (
        <AuthenticatedLayout user={auth.user} sidebar={<Sidebar />} header={<Nav />}>
            <Head title="Usuarios" />
        </AuthenticatedLayout>
    );
}
