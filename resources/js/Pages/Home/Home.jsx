import InfoPage from "@/Components/Partials/InfoPage";
import Nav from "@/Components/Partials/Nav";
import Sidebar from "@/Components/Partials/Sidebar";
import Template from "@/Components/Partials/Template";

function Home() {
    return (
        <>
            <Template sidebar={<Sidebar />} navbar={<Nav />} infoPage={<InfoPage />}>
                
            </Template>
        </>
    );
}

export default Home;