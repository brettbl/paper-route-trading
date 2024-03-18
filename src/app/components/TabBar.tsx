import React, { useEffect, useContext } from 'react';
import { ProductContext } from './AppContext';
import '../App.css';

export default function TabBar() {
    const { product, imageryTabs, selectedTab, setSelectedTab } = useContext(ProductContext);

    useEffect(() => {
        if (product) {
            // fetchImagery(product.id);
        }
    }, [product]);

    useEffect(() => {
        if (!selectedTab && imageryTabs.length > 0) {
            setSelectedTab(imageryTabs[0].id);
        }
    }, [selectedTab, imageryTabs, setSelectedTab]);

    const handleTabClick = (tab) => {
        setSelectedTab(tab);
    };

    return (
        <div className='Tab'>
            <div className='Tab-Container'>
                <div className='Tab-Row'>
                    {imageryTabs.map((item) => (
                        <div 
                            key={item.id} // Add a key prop to each child in a list
                            className={`Tab-Item ${selectedTab === item.id ? 'selected' : ''}`} 
                            onClick={() => handleTabClick(item.id)}
                        >
                            {item.name}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};