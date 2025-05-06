import { useState, useEffect } from 'react';

const useFetch = (url, params = {}) => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const controller = new AbortController();
        const signal = controller.signal;

        const fetchData = async () => {
            setLoading(true);
            setError(null);

            try {
                const res = await fetch(url, { ...params, signal });
                if (!res.ok)
                    throw new Error(`HTTP error! Status: ${res.status}`);
                const data = await res.json();
                setData(data);
            } catch (err) {
                if (err.name !== 'AbortError') {
                    setError('Failed to load posts.');
                }
            } finally {
                setLoading(false);
            }
        };

        fetchData();

        return () => controller.abort();
    }, [url]);

    return { data, setData, loading, error };
};

export default useFetch;
