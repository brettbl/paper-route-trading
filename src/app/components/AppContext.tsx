'use client'
import React, { useState, useEffect, createContext, ReactNode } from 'react';
import { useLocation } from 'react-router-dom';
import { getData, searchData } from '../../pages/api/bubbleAPI';
import { Alchemy, Network } from 'alchemy-sdk';
import { useAddress } from '@thirdweb-dev/react';

interface Product {
    id: string;
    name: string;
    description: string;
    sku: string;
    image: string;
    media: string;
    type: string;
    contractAddress: string;
    account: string;
    shopifyProductId: string;
    inventoryItemId: string;
    tokenId: number;
    solaireWalletAddress: string;
    isTransferred: boolean;
}

export interface Tab {
    name: string;
    id: string;
}

export interface ProductContextType {
    product: Product | null;
    response: any | null;
    imageryTabs: Tab[];
    selectedTab: Tab | null;
    setSelectedTab: (tab: Tab | null) => void;
    repairTypes: string[];
    repairsCount: number | null;
    isClaimed: boolean;
    setIsClaimed: (isClaimed: boolean) => void;
    isOwner: boolean;
}

const config = {
    apiKey: process.env.REACT_APP_ALCHEMY_API_KEY,
    network: Network.MATIC_MUMBAI,
};
const alchemy = new Alchemy(config);

export const ProductContext = createContext<ProductContextType>({
    product: null,
    response: null,
    imageryTabs: [],
    selectedTab: null,
    setSelectedTab: () => { },
    repairTypes: [],
    repairsCount: null,
    isClaimed: false,
    setIsClaimed: () => { },
    isOwner: false,
});

interface ProductProviderProps {
    children: ReactNode;
}

export const ProductProvider = ({ children }: ProductProviderProps) => {
    const [pk1, setPk1] = useState<string | null>(null);
    const [u, setU] = useState<string | null>(null);
    const [n, setN] = useState<string | null>(null);
    const [e, setE] = useState<string | null>(null);
    const [product, setProduct] = useState<Product | null>(null);
    const [isClaimed, setIsClaimed] = useState<boolean>(false);
    const [isOwner, setIsOwner] = useState<boolean>(false);
    const [imageryTabs, setImageryTabs] = useState<Tab[]>([]);
    const [selectedTab, setSelectedTab] = useState<Tab | null>(null);
    const [response, setResponse] = useState<any | null>(null);
    const location = useLocation();
    const address = useAddress();

    const verifyOwnership = async (address: string, contractAddress: string) => {
        try {
            let options = {
                contractAddresses: [contractAddress]
            }
            const response = await alchemy.nft.getNftsForOwner(address, options);
            if (response && response.ownedNfts.length > 0) {
                setIsOwner(true);
            }
        } catch (error) {
            console.error('Error verifying ownership', error);
        }
    };

    useEffect(() => {
        if (address && product && product?.contractAddress) {
            verifyOwnership(address, product.contractAddress);
        }
    }, [address, product]);

    const fetchVerification = async (u: string, n: string, e: string) => {
        try {
            const params = new URLSearchParams();
            params.append('u', u);
            params.append('n', n);
            params.append('e', e);

            //   const response = await fetch(`/api/verifyTap?${params}`);
            const response = await fetch(`/api/verifyTap?${params}`);
            const data = await response.json();
            setResponse(data?.response);
        } catch (error) {
            console.error((error as Error).message);
        }
    };

    const fetchProduct = async (productId: string, inventoryId: string, tokenId: number, solaireWalletAddress: string, isTransferred: boolean) => {
        const response = await getData('Product', productId);
        setProduct({
            id: productId,
            name: response.Name,
            description: response.Description,
            sku: response.SKU,
            image: `https:${response.Image}`,
            media: `https:${response.Media}`,
            type: response.ProductType,
            contractAddress: response.SmartContract,
            account: response.Account,
            shopifyProductId: response.shopifyProductId,
            inventoryItemId: inventoryId,
            tokenId: tokenId,
            solaireWalletAddress: solaireWalletAddress,
            isTransferred: isTransferred
        });
    };

    const fetchOrderItem = async (orderItemId: string) => {
        const response = await getData('OrderItem', orderItemId);
        setIsClaimed(response.isRedeemed);
    };

    useEffect(() => {
        try {
            const queryParams = new URLSearchParams(location.search);
            setPk1(queryParams?.get('pk1')!);
            setU(queryParams?.get('u')!);
            setN(queryParams?.get('n')!);
            setE(queryParams?.get('e')!);
        } catch (error) {
            console.error('Error processing query parameters:', error);
        }
    }, [location]);

    useEffect(() => {
        if (u && n && e) {
            fetchVerification(u, n, e);
        }

    }, [u, n, e]);

    useEffect(() => {
        const uid = pk1 || u;
        if (uid) {
            const constraints = `[{"key":"publicKey","constraint_type":"equals","value":"${uid}"}]`;
            searchData('InventoryItem', constraints)
                .then(response => {
                    if (response[0]?.OrderItemId) {
                        fetchOrderItem(response[0].OrderItemId);
                    } else {
                        setIsClaimed(false);
                    }

                    if (response[0]?.Product) {
                        fetchProduct(response[0].Product, response[0]._id, response[0]['Token ID'], response[0]['solaireWalletAddress'], response[0]['isTransferred']);
                    }
                })
                .catch(error => {
                    console.error('Error fetching data:', error);
                });
        }
    }, [pk1, u]);

    useEffect(() => {
        if (product) {
            const constraints = `[{"key":"Account","constraint_type":"equals","value":"${product.account}"}]`;
            searchData('ImageryType', constraints)
                .then(response => {
                    if (response) {
                        const newTabs = response.map((item: { Name: string, _id: string }) => ({ name: item.Name, id: item._id }));
                        setImageryTabs(newTabs);
                    }
                })
                .catch(error => {
                    console.error('Error fetching data:', error);
                });
        }
    }, [product]);

    return (
        <ProductContext.Provider value={{ product, response, imageryTabs, selectedTab, setSelectedTab, isClaimed, setIsClaimed, isOwner, repairTypes: [], repairsCount: null }}>
            {children}
        </ProductContext.Provider>
    );
};