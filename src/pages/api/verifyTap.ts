export default async function getProduct (u: string, n: string, e: string) {
    try {
        const url = `${process.env.NEXT_PUBLIC_IXKIO_URL}`;

        const params = new URLSearchParams();
        params.append('a', process.env.NEXT_PUBLIC_IXKIO_ACCOUNT_ID || '');
        params.append('u', u);
        params.append('n', n);
        params.append('e', e);

        const response = await fetch(`${url}?${params}`, {
            method: 'GET'
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();

        // Handle the response data here
        return data
    } catch (error) {
        // Handle the error here
        console.error(error);
        throw error;
    }
};
