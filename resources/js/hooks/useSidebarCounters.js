import { useEffect, useState } from 'react';
import axios from 'axios';

export default function useSidebarCounters(interval = 10000) {
    const [counters, setCounters] = useState({
        comprasFinanzas: 0,
        counterPendingCompra: 0,
    });

    const fetchCounters = async () => {
        try {
            const res = await axios.get(route('sidebar.counters'));
            setCounters(res.data);
        } catch (error) {
            console.error("Error al obtener contadores:", error);
        }
    };

    useEffect(() => {
        fetchCounters();
        const timer = setInterval(fetchCounters, interval);
        return () => clearInterval(timer);
    }, [interval]);

    return counters;
}
