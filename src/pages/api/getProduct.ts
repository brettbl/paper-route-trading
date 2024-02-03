export default async function getProduct (uid: string) {
    try {
        const url = `${process.env.NEXT_PUBLIC_BUBBLE_URL}/Product/${uid}`;
        const headers = {
            'Authorization': `Bearer ${process.env.NEXT_PUBLIC_BUBBLE_TOKEN}`
        }

        const response = await fetch(`${url}`, {
            method: 'GET',
            headers: headers,
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
